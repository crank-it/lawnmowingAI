// Lawnmowing.ai - MVP Property Analysis API
// Uses LINZ free data for geocoding, boundaries, imagery, and elevation
// Lawn area is confirmed manually by operator on-site

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// =============================================================================
// CONFIGURATION
// =============================================================================

const LINZ_API_KEY = process.env.LINZ_API_KEY; // Get from data.linz.govt.nz
const PORT = process.env.PORT || 3001;

// LINZ endpoints
const LINZ_BASE = 'https://data.linz.govt.nz/services';
const LINZ_TILES = 'https://basemaps.linz.govt.nz/v1/tiles/aerial';

// Layer IDs
const LAYERS = {
  addresses: '105689',      // NZ Addresses
  parcels: '50823',         // NZ Primary Land Parcels
  elevation: '104499',      // NZ 8m DEM (for slope)
};

// =============================================================================
// GEOCODING - Convert address to coordinates
// =============================================================================

app.post('/api/geocode', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Search LINZ addresses using WFS
    const searchTerms = address.replace(/,/g, ' ').trim();
    const wfsUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeNames: `layer-${LAYERS.addresses}`,
      outputFormat: 'application/json',
      count: '5',
      cql_filter: `full_address ILIKE '%${searchTerms.replace(/'/g, "''")}%'`
    });

    const response = await fetch(wfsUrl);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Return top matches
    const results = data.features.map(f => ({
      address: f.properties.full_address,
      coordinates: {
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1]
      },
      addressId: f.properties.address_id,
      suburb: f.properties.suburb_locality,
      city: f.properties.town_city,
      postcode: f.properties.postcode
    }));

    res.json({ results });

  } catch (error) {
    console.error('Geocode error:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

// =============================================================================
// PROPERTY BOUNDARY - Get parcel polygon for coordinates
// =============================================================================

app.post('/api/property-boundary', async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Coordinates are required' });
    }

    // Query parcels that contain this point
    const wfsUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeNames: `layer-${LAYERS.parcels}`,
      outputFormat: 'application/json',
      cql_filter: `INTERSECTS(shape, POINT(${lng} ${lat}))`
    });

    const response = await fetch(wfsUrl);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return res.status(404).json({ error: 'No property boundary found' });
    }

    const parcel = data.features[0];
    
    // Calculate area from the geometry
    const areaM2 = parcel.properties.calc_area || calculatePolygonArea(parcel.geometry);

    res.json({
      parcelId: parcel.properties.id,
      geometry: parcel.geometry,
      area: {
        sqm: Math.round(areaM2),
        sqft: Math.round(areaM2 * 10.764)
      },
      parcelIntent: parcel.properties.parcel_intent, // e.g., "Fee Simple Title"
      topology: parcel.properties.topology_type
    });

  } catch (error) {
    console.error('Property boundary error:', error);
    res.status(500).json({ error: 'Failed to get property boundary' });
  }
});

// =============================================================================
// AERIAL IMAGERY - Get tile URL for property
// =============================================================================

app.post('/api/aerial-imagery', async (req, res) => {
  try {
    const { lat, lng, zoom = 19 } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Coordinates are required' });
    }

    // Convert lat/lng to tile coordinates
    const { x, y } = latLngToTile(lat, lng, zoom);

    // LINZ aerial basemap tile URL
    const tileUrl = `${LINZ_TILES}/WebMercatorQuad/${zoom}/${x}/${y}.webp?api=${LINZ_API_KEY}`;
    
    // Also provide a static map URL for the property (multiple tiles stitched)
    const staticMapUrl = `${LINZ_TILES}/WebMercatorQuad/${zoom}/${x}/${y}.webp?api=${LINZ_API_KEY}`;

    res.json({
      tileUrl,
      staticMapUrl,
      zoom,
      tileCoords: { x, y, z: zoom },
      attribution: 'Sourced from Toitū Te Whenua Land Information New Zealand'
    });

  } catch (error) {
    console.error('Aerial imagery error:', error);
    res.status(500).json({ error: 'Failed to get aerial imagery' });
  }
});

// =============================================================================
// ELEVATION & SLOPE - Get terrain data for property
// =============================================================================

app.post('/api/elevation', async (req, res) => {
  try {
    const { geometry } = req.body; // Property boundary polygon

    if (!geometry) {
      return res.status(400).json({ error: 'Property geometry is required' });
    }

    // Sample elevation at multiple points across the property
    const points = samplePointsFromPolygon(geometry, 9); // 3x3 grid
    
    // Use Open Topo Data API (free, uses LINZ 8m DEM)
    const locations = points.map(p => `${p.lat},${p.lng}`).join('|');
    const elevationUrl = `https://api.opentopodata.org/v1/nzdem8m?locations=${locations}`;
    
    const response = await fetch(elevationUrl);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results) {
      return res.status(500).json({ error: 'Failed to get elevation data' });
    }

    const elevations = data.results.map(r => r.elevation).filter(e => e !== null);
    
    if (elevations.length === 0) {
      return res.status(404).json({ error: 'No elevation data available' });
    }

    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const avgElevation = elevations.reduce((a, b) => a + b, 0) / elevations.length;
    
    // Calculate approximate slope
    // This is simplified - real slope would use the full DEM raster
    const elevationRange = maxElevation - minElevation;
    const approximateDistance = estimatePropertyDiagonal(geometry);
    const slopePercent = (elevationRange / approximateDistance) * 100;

    // Classify slope difficulty
    let slopeCategory;
    if (slopePercent < 5) slopeCategory = 'Flat';
    else if (slopePercent < 15) slopeCategory = 'Gentle slope';
    else if (slopePercent < 25) slopeCategory = 'Moderate slope';
    else if (slopePercent < 35) slopeCategory = 'Steep';
    else slopeCategory = 'Very steep';

    res.json({
      elevation: {
        min: Math.round(minElevation * 10) / 10,
        max: Math.round(maxElevation * 10) / 10,
        average: Math.round(avgElevation * 10) / 10,
        range: Math.round(elevationRange * 10) / 10
      },
      slope: {
        percent: Math.round(slopePercent * 10) / 10,
        category: slopeCategory
      },
      sampledPoints: data.results.length
    });

  } catch (error) {
    console.error('Elevation error:', error);
    res.status(500).json({ error: 'Failed to get elevation data' });
  }
});

// =============================================================================
// FULL PROPERTY ANALYSIS - Combined endpoint
// =============================================================================

app.post('/api/analyze-property', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Step 1: Geocode the address
    const geocodeUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeNames: `layer-${LAYERS.addresses}`,
      outputFormat: 'application/json',
      count: '1',
      cql_filter: `full_address ILIKE '%${address.replace(/'/g, "''")}%'`
    });

    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.features || geocodeData.features.length === 0) {
      return res.status(404).json({ error: 'Address not found', step: 'geocode' });
    }

    const location = geocodeData.features[0];
    const [lng, lat] = location.geometry.coordinates;
    const fullAddress = location.properties.full_address;

    // Step 2: Get property boundary
    const boundaryUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeNames: `layer-${LAYERS.parcels}`,
      outputFormat: 'application/json',
      cql_filter: `INTERSECTS(shape, POINT(${lng} ${lat}))`
    });

    const boundaryResponse = await fetch(boundaryUrl);
    const boundaryData = await boundaryResponse.json();

    let propertyBoundary = null;
    let totalArea = null;

    if (boundaryData.features && boundaryData.features.length > 0) {
      const parcel = boundaryData.features[0];
      propertyBoundary = parcel.geometry;
      totalArea = parcel.properties.calc_area || calculatePolygonArea(parcel.geometry);
    }

    // Step 3: Get elevation/slope
    let elevation = null;
    let slope = null;

    if (propertyBoundary) {
      try {
        const points = samplePointsFromPolygon(propertyBoundary, 9);
        const locations = points.map(p => `${p.lat},${p.lng}`).join('|');
        const elevationUrl = `https://api.opentopodata.org/v1/nzdem8m?locations=${locations}`;
        
        const elevationResponse = await fetch(elevationUrl);
        const elevationData = await elevationResponse.json();

        if (elevationData.status === 'OK' && elevationData.results) {
          const elevations = elevationData.results.map(r => r.elevation).filter(e => e !== null);
          
          if (elevations.length > 0) {
            const minElev = Math.min(...elevations);
            const maxElev = Math.max(...elevations);
            const elevRange = maxElev - minElev;
            const distance = estimatePropertyDiagonal(propertyBoundary);
            const slopePercent = (elevRange / distance) * 100;

            elevation = {
              min: Math.round(minElev * 10) / 10,
              max: Math.round(maxElev * 10) / 10,
              range: Math.round(elevRange * 10) / 10
            };

            let slopeCategory;
            if (slopePercent < 5) slopeCategory = 'Flat';
            else if (slopePercent < 15) slopeCategory = 'Gentle slope';
            else if (slopePercent < 25) slopeCategory = 'Moderate slope';
            else if (slopePercent < 35) slopeCategory = 'Steep';
            else slopeCategory = 'Very steep';

            slope = {
              percent: Math.round(slopePercent * 10) / 10,
              category: slopeCategory
            };
          }
        }
      } catch (e) {
        console.warn('Elevation lookup failed:', e.message);
      }
    }

    // Step 4: Generate imagery URLs
    const zoom = 19;
    const { x, y } = latLngToTile(lat, lng, zoom);
    const aerialImageUrl = `${LINZ_TILES}/WebMercatorQuad/${zoom}/${x}/${y}.webp?api=${LINZ_API_KEY}`;

    // Step 5: Estimate lawn area (placeholder - to be confirmed by operator)
    // Rule of thumb: ~40-60% of residential property is lawn
    const estimatedLawnPercent = 0.5;
    const estimatedLawnArea = totalArea ? Math.round(totalArea * estimatedLawnPercent) : null;

    // Build response
    res.json({
      status: 'success',
      address: {
        full: fullAddress,
        suburb: location.properties.suburb_locality,
        city: location.properties.town_city,
        postcode: location.properties.postcode
      },
      coordinates: { lat, lng },
      property: {
        totalArea: totalArea ? {
          sqm: Math.round(totalArea),
          sqft: Math.round(totalArea * 10.764)
        } : null,
        boundary: propertyBoundary,
        estimatedLawnArea: estimatedLawnArea ? {
          sqm: estimatedLawnArea,
          sqft: Math.round(estimatedLawnArea * 10.764),
          note: 'Estimate only - to be confirmed on-site'
        } : null
      },
      terrain: {
        elevation,
        slope
      },
      imagery: {
        aerialTileUrl: aerialImageUrl,
        zoom,
        attribution: 'Sourced from Toitū Te Whenua Land Information New Zealand'
      },
      quote: {
        status: 'pending_site_visit',
        message: 'Lawn area and final price to be confirmed during site assessment'
      }
    });

  } catch (error) {
    console.error('Property analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze property', details: error.message });
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Convert lat/lng to tile coordinates
function latLngToTile(lat, lng, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor((lng + 180) / 360 * n);
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}

// Calculate polygon area using Shoelace formula (approximate for small areas)
function calculatePolygonArea(geometry) {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return null;
  }

  const coords = geometry.type === 'Polygon' 
    ? geometry.coordinates[0] 
    : geometry.coordinates[0][0];

  // Convert to approximate meters using center point
  const centerLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
  const latRad = centerLat * Math.PI / 180;
  const metersPerDegreeLng = 111320 * Math.cos(latRad);
  const metersPerDegreeLat = 110540;

  // Shoelace formula
  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const x1 = coords[i][0] * metersPerDegreeLng;
    const y1 = coords[i][1] * metersPerDegreeLat;
    const x2 = coords[i + 1][0] * metersPerDegreeLng;
    const y2 = coords[i + 1][1] * metersPerDegreeLat;
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area) / 2;
}

// Sample points from polygon for elevation queries
function samplePointsFromPolygon(geometry, count) {
  const coords = geometry.type === 'Polygon' 
    ? geometry.coordinates[0] 
    : geometry.coordinates[0][0];

  // Get bounding box
  const lngs = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Generate grid of points
  const gridSize = Math.ceil(Math.sqrt(count));
  const points = [];
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lng = minLng + (maxLng - minLng) * (i + 0.5) / gridSize;
      const lat = minLat + (maxLat - minLat) * (j + 0.5) / gridSize;
      points.push({ lat, lng });
    }
  }

  return points.slice(0, count);
}

// Estimate diagonal distance across property
function estimatePropertyDiagonal(geometry) {
  const coords = geometry.type === 'Polygon' 
    ? geometry.coordinates[0] 
    : geometry.coordinates[0][0];

  const lngs = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  // Approximate meters
  const centerLat = (minLat + maxLat) / 2;
  const latRad = centerLat * Math.PI / 180;
  const metersPerDegreeLng = 111320 * Math.cos(latRad);
  const metersPerDegreeLat = 110540;

  const width = (maxLng - minLng) * metersPerDegreeLng;
  const height = (maxLat - minLat) * metersPerDegreeLat;

  return Math.sqrt(width * width + height * height);
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'lawnmowing-ai-api',
    linzConfigured: !!LINZ_API_KEY
  });
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
  console.log(`🌿 Lawnmowing.ai API running on port ${PORT}`);
  if (!LINZ_API_KEY) {
    console.warn('⚠️  LINZ_API_KEY not set - API calls will fail');
  }
});

module.exports = app;
