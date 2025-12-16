// Lawnmowing.ai - Enhanced Property Analysis API
// Multi-source geocoding: Addy (primary) + Google (fallback) + LINZ (authoritative)

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// =============================================================================
// CONFIGURATION
// =============================================================================

const LINZ_API_KEY = process.env.LINZ_API_KEY;           // Get from data.linz.govt.nz
const ADDY_API_KEY = process.env.ADDY_API_KEY;           // Get from addysolutions.com
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;       // Optional - Google Cloud Console

const PORT = process.env.PORT || 3001;

// Endpoints
const LINZ_BASE = 'https://data.linz.govt.nz/services';
const LINZ_TILES = 'https://basemaps.linz.govt.nz/v1/tiles/aerial';
const ADDY_BASE = 'https://api.addysolutions.com/search';

const LAYERS = {
  addresses: '105689',
  parcels: '50823',
};

// =============================================================================
// MULTI-SOURCE ADDRESS AUTOCOMPLETE
// =============================================================================

app.get('/api/address/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 3) {
      return res.json({ results: [] });
    }

    const results = [];

    // Source 1: Addy Solutions (primary - best NZ fuzzy matching)
    if (ADDY_API_KEY) {
      try {
        const addyUrl = `${ADDY_BASE}?key=${ADDY_API_KEY}&s=${encodeURIComponent(q)}&max=5`;
        const addyResponse = await fetch(addyUrl);
        const addyData = await addyResponse.json();

        if (addyData.addresses) {
          addyData.addresses.forEach(addr => {
            results.push({
              source: 'addy',
              address: addr.a,  // Full address
              addressId: addr.id,
              confidence: 0.95, // Addy has excellent NZ coverage
              components: {
                street: addr.street,
                suburb: addr.suburb,
                city: addr.city,
                postcode: addr.postcode
              }
            });
          });
        }
      } catch (e) {
        console.warn('Addy lookup failed:', e.message);
      }
    }

    // Source 2: Google Places (fallback if Addy returns nothing)
    if (GOOGLE_API_KEY && results.length === 0) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
          `input=${encodeURIComponent(q)}&components=country:nz&key=${GOOGLE_API_KEY}`;
        
        const googleResponse = await fetch(googleUrl);
        const googleData = await googleResponse.json();

        if (googleData.predictions) {
          googleData.predictions.slice(0, 5).forEach(pred => {
            results.push({
              source: 'google',
              address: pred.description,
              placeId: pred.place_id,
              confidence: 0.85, // Good but sometimes missing NZ addresses
              components: null  // Need separate call for components
            });
          });
        }
      } catch (e) {
        console.warn('Google lookup failed:', e.message);
      }
    }

    res.json({ 
      results,
      sources: {
        addy: !!ADDY_API_KEY,
        google: !!GOOGLE_API_KEY
      }
    });

  } catch (error) {
    console.error('Autocomplete error:', error);
    res.status(500).json({ error: 'Autocomplete failed' });
  }
});

// =============================================================================
// GET FULL ADDRESS DETAILS (called after user selects from autocomplete)
// =============================================================================

app.post('/api/address/details', async (req, res) => {
  try {
    const { addressId, source, placeId } = req.body;

    let coordinates = null;
    let fullAddress = null;
    let components = null;

    // Get coordinates based on source
    if (source === 'addy' && addressId && ADDY_API_KEY) {
      // Addy address details endpoint
      const detailUrl = `https://api.addysolutions.com/address/${addressId}?key=${ADDY_API_KEY}`;
      const response = await fetch(detailUrl);
      const data = await response.json();

      if (data) {
        coordinates = { lat: data.y, lng: data.x };
        fullAddress = data.a || data.full;
        components = {
          street: data.street,
          suburb: data.suburb,
          city: data.city,
          region: data.region,
          postcode: data.postcode
        };
      }
    } 
    else if (source === 'google' && placeId && GOOGLE_API_KEY) {
      // Google Place Details
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}&fields=geometry,formatted_address,address_components&key=${GOOGLE_API_KEY}`;
      
      const response = await fetch(detailUrl);
      const data = await response.json();

      if (data.result) {
        coordinates = {
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng
        };
        fullAddress = data.result.formatted_address;
        
        // Parse Google address components
        const comps = data.result.address_components || [];
        components = {
          street: comps.find(c => c.types.includes('route'))?.long_name,
          streetNumber: comps.find(c => c.types.includes('street_number'))?.long_name,
          suburb: comps.find(c => c.types.includes('sublocality'))?.long_name,
          city: comps.find(c => c.types.includes('locality'))?.long_name,
          postcode: comps.find(c => c.types.includes('postal_code'))?.long_name
        };
      }
    }

    if (!coordinates) {
      return res.status(404).json({ error: 'Could not resolve address coordinates' });
    }

    res.json({
      address: fullAddress,
      coordinates,
      components,
      source
    });

  } catch (error) {
    console.error('Address details error:', error);
    res.status(500).json({ error: 'Failed to get address details' });
  }
});

// =============================================================================
// CROSS-VALIDATE WITH LINZ AND GET PROPERTY DATA
// =============================================================================

app.post('/api/property/validate', async (req, res) => {
  try {
    const { lat, lng, address } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Coordinates required' });
    }

    const validation = {
      linzMatch: false,
      linzAddress: null,
      parcel: null,
      confidence: 0
    };

    // Step 1: Find LINZ address near these coordinates
    if (LINZ_API_KEY) {
      try {
        // Search for addresses within ~50m of the point
        const buffer = 0.0005; // roughly 50m
        const bbox = `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`;
        
        const addressUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
          typeNames: `layer-${LAYERS.addresses}`,
          outputFormat: 'application/json',
          bbox: bbox,
          count: '10'
        });

        const addressResponse = await fetch(addressUrl);
        const addressData = await addressResponse.json();

        if (addressData.features && addressData.features.length > 0) {
          // Find best matching address
          const linzAddresses = addressData.features.map(f => ({
            full: f.properties.full_address,
            coords: f.geometry.coordinates,
            distance: calculateDistance(lat, lng, f.geometry.coordinates[1], f.geometry.coordinates[0])
          }));

          // Sort by distance
          linzAddresses.sort((a, b) => a.distance - b.distance);
          const closest = linzAddresses[0];

          validation.linzAddress = closest.full;
          validation.linzMatch = true;
          validation.linzDistance = Math.round(closest.distance);

          // Calculate confidence based on distance and address similarity
          const distanceScore = Math.max(0, 1 - (closest.distance / 50)); // 1.0 at 0m, 0 at 50m
          const textScore = address ? calculateAddressSimilarity(address, closest.full) : 0.5;
          validation.confidence = Math.round((distanceScore * 0.6 + textScore * 0.4) * 100);
        }
      } catch (e) {
        console.warn('LINZ address lookup failed:', e.message);
      }

      // Step 2: Get property parcel
      try {
        const parcelUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
          typeNames: `layer-${LAYERS.parcels}`,
          outputFormat: 'application/json',
          cql_filter: `INTERSECTS(shape, POINT(${lng} ${lat}))`
        });

        const parcelResponse = await fetch(parcelUrl);
        const parcelData = await parcelResponse.json();

        if (parcelData.features && parcelData.features.length > 0) {
          const parcel = parcelData.features[0];
          validation.parcel = {
            id: parcel.properties.id,
            area: parcel.properties.calc_area || calculatePolygonArea(parcel.geometry),
            geometry: parcel.geometry
          };
        }
      } catch (e) {
        console.warn('LINZ parcel lookup failed:', e.message);
      }
    }

    res.json(validation);

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

// =============================================================================
// FULL PROPERTY ANALYSIS (ENHANCED)
// =============================================================================

app.post('/api/analyze-property', async (req, res) => {
  try {
    const { address, addressId, source, placeId } = req.body;

    // Step 1: Get coordinates from the address source
    let coordinates = null;
    let resolvedAddress = address;
    let components = null;

    // If we have an addressId from Addy
    if (source === 'addy' && addressId && ADDY_API_KEY) {
      const detailUrl = `https://api.addysolutions.com/address/${addressId}?key=${ADDY_API_KEY}`;
      const response = await fetch(detailUrl);
      const data = await response.json();

      if (data) {
        coordinates = { lat: data.y, lng: data.x };
        resolvedAddress = data.a || data.full;
        components = {
          street: data.street,
          suburb: data.suburb,
          city: data.city,
          postcode: data.postcode
        };
      }
    }
    // If we have a placeId from Google
    else if (source === 'google' && placeId && GOOGLE_API_KEY) {
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_API_KEY}`;
      
      const response = await fetch(detailUrl);
      const data = await response.json();

      if (data.result) {
        coordinates = {
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng
        };
        resolvedAddress = data.result.formatted_address;
      }
    }
    // Fallback: Try Addy search with the address string
    else if (address && ADDY_API_KEY) {
      const searchUrl = `${ADDY_BASE}?key=${ADDY_API_KEY}&s=${encodeURIComponent(address)}&max=1`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.addresses && searchData.addresses.length > 0) {
        const addr = searchData.addresses[0];
        const detailUrl = `https://api.addysolutions.com/address/${addr.id}?key=${ADDY_API_KEY}`;
        const detailResponse = await fetch(detailUrl);
        const detailData = await detailResponse.json();

        if (detailData) {
          coordinates = { lat: detailData.y, lng: detailData.x };
          resolvedAddress = detailData.a || detailData.full;
          components = {
            street: detailData.street,
            suburb: detailData.suburb,
            city: detailData.city,
            postcode: detailData.postcode
          };
        }
      }
    }

    if (!coordinates) {
      return res.status(404).json({ 
        error: 'Could not resolve address', 
        suggestion: 'Please select an address from the autocomplete suggestions'
      });
    }

    const { lat, lng } = coordinates;

    // Step 2: Cross-validate with LINZ
    let linzValidation = { confidence: 0, linzMatch: false };
    let propertyBoundary = null;
    let totalArea = null;

    if (LINZ_API_KEY) {
      // Check LINZ addresses nearby
      const buffer = 0.0005;
      const bbox = `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`;
      
      try {
        const addressUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
          typeNames: `layer-${LAYERS.addresses}`,
          outputFormat: 'application/json',
          bbox: bbox,
          count: '5'
        });

        const addressResponse = await fetch(addressUrl);
        const addressData = await addressResponse.json();

        if (addressData.features && addressData.features.length > 0) {
          const linzAddresses = addressData.features.map(f => ({
            full: f.properties.full_address,
            distance: calculateDistance(lat, lng, f.geometry.coordinates[1], f.geometry.coordinates[0])
          }));
          linzAddresses.sort((a, b) => a.distance - b.distance);
          
          const closest = linzAddresses[0];
          const distanceScore = Math.max(0, 1 - (closest.distance / 50));
          const textScore = calculateAddressSimilarity(resolvedAddress, closest.full);
          
          linzValidation = {
            linzMatch: true,
            linzAddress: closest.full,
            distance: Math.round(closest.distance),
            confidence: Math.round((distanceScore * 0.6 + textScore * 0.4) * 100)
          };
        }
      } catch (e) {
        console.warn('LINZ address validation failed:', e.message);
      }

      // Get property boundary
      try {
        const parcelUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?` + new URLSearchParams({
          service: 'WFS',
          version: '2.0.0',
          request: 'GetFeature',
          typeNames: `layer-${LAYERS.parcels}`,
          outputFormat: 'application/json',
          cql_filter: `INTERSECTS(shape, POINT(${lng} ${lat}))`
        });

        const parcelResponse = await fetch(parcelUrl);
        const parcelData = await parcelResponse.json();

        if (parcelData.features && parcelData.features.length > 0) {
          const parcel = parcelData.features[0];
          propertyBoundary = parcel.geometry;
          totalArea = parcel.properties.calc_area || calculatePolygonArea(parcel.geometry);
        }
      } catch (e) {
        console.warn('LINZ parcel lookup failed:', e.message);
      }
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

    // Step 4: Generate imagery URL
    const zoom = 19;
    const { x, y } = latLngToTile(lat, lng, zoom);
    const aerialImageUrl = LINZ_API_KEY 
      ? `${LINZ_TILES}/WebMercatorQuad/${zoom}/${x}/${y}.webp?api=${LINZ_API_KEY}`
      : null;

    // Step 5: Estimate lawn area
    const estimatedLawnPercent = 0.5;
    const estimatedLawnArea = totalArea ? Math.round(totalArea * estimatedLawnPercent) : null;

    // Build response
    res.json({
      status: 'success',
      address: {
        input: address,
        resolved: resolvedAddress,
        source: source || 'addy',
        components
      },
      coordinates: { lat, lng },
      validation: linzValidation,
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
        status: linzValidation.confidence >= 80 ? 'ready_for_estimate' : 'needs_verification',
        confidence: linzValidation.confidence,
        message: linzValidation.confidence >= 80 
          ? 'Address verified. Lawn area to be confirmed on-site.'
          : 'Address could not be fully verified. Operator will confirm location.'
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

function calculateDistance(lat1, lng1, lat2, lng2) {
  // Haversine formula - returns distance in meters
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateAddressSimilarity(addr1, addr2) {
  // Simple word overlap similarity
  if (!addr1 || !addr2) return 0;
  
  const words1 = addr1.toLowerCase().replace(/[,]/g, '').split(/\s+/);
  const words2 = addr2.toLowerCase().replace(/[,]/g, '').split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  let matches = 0;
  set1.forEach(word => {
    if (set2.has(word)) matches++;
  });
  
  return matches / Math.max(set1.size, set2.size);
}

function latLngToTile(lat, lng, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor((lng + 180) / 360 * n);
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}

function calculatePolygonArea(geometry) {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') return null;

  const coords = geometry.type === 'Polygon' 
    ? geometry.coordinates[0] 
    : geometry.coordinates[0][0];

  const centerLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
  const latRad = centerLat * Math.PI / 180;
  const metersPerDegreeLng = 111320 * Math.cos(latRad);
  const metersPerDegreeLat = 110540;

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

function samplePointsFromPolygon(geometry, count) {
  const coords = geometry.type === 'Polygon' 
    ? geometry.coordinates[0] 
    : geometry.coordinates[0][0];

  const lngs = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

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
    sources: {
      linz: !!LINZ_API_KEY,
      addy: !!ADDY_API_KEY,
      google: !!GOOGLE_API_KEY
    }
  });
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
  console.log(`🌿 Lawnmowing.ai API running on port ${PORT}`);
  console.log('   Sources configured:');
  console.log(`   - LINZ: ${LINZ_API_KEY ? '✓' : '✗'}`);
  console.log(`   - Addy: ${ADDY_API_KEY ? '✓' : '✗'}`);
  console.log(`   - Google: ${GOOGLE_API_KEY ? '✓ (optional)' : '✗ (optional)'}`);
});

module.exports = app;
