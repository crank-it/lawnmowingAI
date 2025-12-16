import { NextRequest, NextResponse } from "next/server";
import {
  calculateDistance,
  calculateAddressSimilarity,
  calculatePolygonArea,
  calculateConfidence,
  samplePointsFromPolygon,
  estimatePropertyDiagonal,
  categorizeSslope,
  GeoJSONPolygon,
} from "@/lib/geo-utils";

const LINZ_API_KEY = process.env.LINZ_API_KEY;
const ADDY_API_KEY = process.env.ADDY_API_KEY;
const LINZ_DATA_SERVICE = "https://data.linz.govt.nz/services";
const ADDY_BASE = "https://api.addysolutions.com";

const LAYERS = {
  addresses: "105689",
  parcels: "50823",
};

interface AddressComponents {
  street?: string;
  suburb?: string;
  city?: string;
  region?: string;
  postcode?: string;
}

interface Validation {
  linzMatch: boolean;
  linzAddress: string | null;
  distance?: number;
  confidence: number;
}

interface PropertyAnalysisResponse {
  status: "success" | "error";
  address: {
    input: string;
    resolved: string;
    source: string;
    components: AddressComponents | null;
  };
  coordinates: { lat: number; lng: number };
  suburb: string;
  validation: Validation;
  property: {
    totalArea: { sqm: number; sqft: number } | null;
    boundary: GeoJSONPolygon | null;
    estimatedLawnArea: { sqm: number; sqft: number; note: string } | null;
  };
  terrain: {
    elevation: { min: number; max: number; range: number } | null;
    slope: { percent: number; category: string } | null;
  };
  // Legacy fields for backward compatibility
  totalAreaSqm: number;
  lawnAreaSqm: number;
  gradient: "Flat" | "Gentle slope" | "Moderate slope" | "Steep";
  estimatedEdgingM: number;
  accessDifficulty: "Easy" | "Standard" | "Tricky";
  hedgeLengthM: number;
  parcelId?: string;
  confidence: number;
}

// Get coordinates and details from Addy
async function getAddyDetails(addressId: string): Promise<{
  coordinates: { lat: number; lng: number } | null;
  address: string | null;
  components: AddressComponents | null;
}> {
  if (!ADDY_API_KEY) return { coordinates: null, address: null, components: null };

  try {
    const response = await fetch(
      `${ADDY_BASE}/address/${addressId}?key=${ADDY_API_KEY}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) return { coordinates: null, address: null, components: null };

    const data = await response.json();
    return {
      coordinates: data.y && data.x ? { lat: data.y, lng: data.x } : null,
      address: data.a || data.full || null,
      components: {
        street: data.street,
        suburb: data.suburb,
        city: data.city,
        region: data.region,
        postcode: data.postcode,
      },
    };
  } catch (e) {
    console.error("Addy details error:", e);
    return { coordinates: null, address: null, components: null };
  }
}

// Search Addy for address
async function searchAddy(query: string): Promise<{
  addressId: string | null;
  address: string | null;
}> {
  if (!ADDY_API_KEY) return { addressId: null, address: null };

  try {
    const response = await fetch(
      `${ADDY_BASE}/search?key=${ADDY_API_KEY}&s=${encodeURIComponent(query)}&max=1`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) return { addressId: null, address: null };

    const data = await response.json();
    if (data.addresses && data.addresses.length > 0) {
      return {
        addressId: data.addresses[0].id,
        address: data.addresses[0].a,
      };
    }
    return { addressId: null, address: null };
  } catch (e) {
    console.error("Addy search error:", e);
    return { addressId: null, address: null };
  }
}

// Cross-validate with LINZ
async function validateWithLinz(
  lat: number,
  lng: number,
  address: string
): Promise<Validation> {
  const validation: Validation = {
    linzMatch: false,
    linzAddress: null,
    confidence: 0,
  };

  if (!LINZ_API_KEY) return validation;

  try {
    const buffer = 0.0005;
    const bbox = `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`;

    const params = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeNames: `layer-${LAYERS.addresses}`,
      outputFormat: "application/json",
      bbox: bbox,
      count: "5",
    });

    const response = await fetch(
      `${LINZ_DATA_SERVICE};key=${LINZ_API_KEY}/wfs?${params}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) return validation;

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const addresses = data.features.map(
        (f: {
          properties: { full_address: string };
          geometry: { coordinates: [number, number] };
        }) => ({
          full: f.properties.full_address,
          distance: calculateDistance(
            lat,
            lng,
            f.geometry.coordinates[1],
            f.geometry.coordinates[0]
          ),
        })
      );

      addresses.sort(
        (a: { distance: number }, b: { distance: number }) =>
          a.distance - b.distance
      );
      const closest = addresses[0];

      const textSimilarity = calculateAddressSimilarity(address, closest.full);

      validation.linzMatch = true;
      validation.linzAddress = closest.full;
      validation.distance = Math.round(closest.distance);
      validation.confidence = calculateConfidence(closest.distance, textSimilarity);
    }
  } catch (e) {
    console.error("LINZ validation error:", e);
  }

  return validation;
}

// Get property parcel from LINZ
async function getPropertyParcel(
  lat: number,
  lng: number
): Promise<{ id: string; area: number; geometry: GeoJSONPolygon } | null> {
  if (!LINZ_API_KEY) return null;

  try {
    const params = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeNames: `layer-${LAYERS.parcels}`,
      outputFormat: "application/json",
      cql_filter: `INTERSECTS(shape, POINT(${lng} ${lat}))`,
    });

    const response = await fetch(
      `${LINZ_DATA_SERVICE};key=${LINZ_API_KEY}/wfs?${params}`,
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const parcel = data.features[0];
      const geometry = parcel.geometry as GeoJSONPolygon;
      return {
        id: parcel.properties?.id?.toString() || parcel.id || "",
        area: parcel.properties?.calc_area || calculatePolygonArea(geometry),
        geometry,
      };
    }
  } catch (e) {
    console.error("LINZ parcel error:", e);
  }

  return null;
}

// Get elevation and slope from OpenTopoData
async function getTerrainData(geometry: GeoJSONPolygon): Promise<{
  elevation: { min: number; max: number; range: number } | null;
  slope: { percent: number; category: string } | null;
}> {
  try {
    const points = samplePointsFromPolygon(geometry, 9);
    if (points.length === 0) return { elevation: null, slope: null };

    const locations = points.map((p) => `${p.lat},${p.lng}`).join("|");
    const response = await fetch(
      `https://api.opentopodata.org/v1/nzdem8m?locations=${locations}`
    );

    if (!response.ok) return { elevation: null, slope: null };

    const data = await response.json();
    if (data.status !== "OK" || !data.results) return { elevation: null, slope: null };

    const elevations = data.results
      .map((r: { elevation: number | null }) => r.elevation)
      .filter((e: number | null): e is number => e !== null);

    if (elevations.length === 0) return { elevation: null, slope: null };

    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const elevRange = maxElev - minElev;
    const diagonal = estimatePropertyDiagonal(geometry);
    const slopePercent = (elevRange / diagonal) * 100;

    return {
      elevation: {
        min: Math.round(minElev * 10) / 10,
        max: Math.round(maxElev * 10) / 10,
        range: Math.round(elevRange * 10) / 10,
      },
      slope: {
        percent: Math.round(slopePercent * 10) / 10,
        category: categorizeSslope(slopePercent),
      },
    };
  } catch (e) {
    console.error("Terrain data error:", e);
    return { elevation: null, slope: null };
  }
}

// Estimate lawn area percentage
function estimateLawnPercent(totalArea: number): number {
  if (totalArea < 300) return 0.4;
  if (totalArea < 600) return 0.5;
  if (totalArea < 1000) return 0.55;
  return 0.6;
}

// Estimate edging length
function estimateEdging(lawnArea: number): number {
  const perimeter = Math.sqrt(lawnArea) * 4;
  const internal = Math.sqrt(lawnArea) * 1.5;
  return Math.round(perimeter + internal);
}

// Estimate access difficulty
function estimateAccess(
  totalArea: number,
  suburb: string
): "Easy" | "Standard" | "Tricky" {
  const lowerSuburb = suburb.toLowerCase();
  const trickySuburbs = ["roslyn", "maori hill", "belleknowes", "mornington"];
  if (trickySuburbs.some((s) => lowerSuburb.includes(s))) return "Tricky";
  if (totalArea < 400) return "Standard";
  return "Easy";
}

// Fallback gradient estimation by suburb
function estimateGradientBySuburb(
  suburb: string
): "Flat" | "Gentle slope" | "Moderate slope" | "Steep" {
  const lowerSuburb = suburb.toLowerCase();
  const steepSuburbs = [
    "signal hill",
    "unity park",
    "halfway bush",
    "wakari",
    "maori hill",
    "roslyn",
  ];
  const moderateSuburbs = [
    "kaikorai",
    "mornington",
    "belleknowes",
    "woodhaugh",
    "opoho",
    "normanby",
  ];
  const gentleSuburbs = ["andersons bay", "musselburgh", "vauxhall", "tainui", "caversham"];

  if (steepSuburbs.some((s) => lowerSuburb.includes(s))) return "Steep";
  if (moderateSuburbs.some((s) => lowerSuburb.includes(s))) return "Moderate slope";
  if (gentleSuburbs.some((s) => lowerSuburb.includes(s))) return "Gentle slope";
  return "Flat";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, addressId, source } = body;

    if (!address && !addressId) {
      return NextResponse.json(
        { error: "Address or addressId is required" },
        { status: 400 }
      );
    }

    // Step 1: Resolve address to coordinates
    let coordinates: { lat: number; lng: number } | null = null;
    let resolvedAddress = address;
    let components: AddressComponents | null = null;
    let usedSource = source || "addy";

    // If we have an addressId from Addy
    if (addressId && source === "addy") {
      const addyDetails = await getAddyDetails(addressId);
      if (addyDetails.coordinates) {
        coordinates = addyDetails.coordinates;
        resolvedAddress = addyDetails.address || address;
        components = addyDetails.components;
      }
    }

    // Fallback: Search Addy with address string
    if (!coordinates && address && ADDY_API_KEY) {
      const searchResult = await searchAddy(address);
      if (searchResult.addressId) {
        const addyDetails = await getAddyDetails(searchResult.addressId);
        if (addyDetails.coordinates) {
          coordinates = addyDetails.coordinates;
          resolvedAddress = addyDetails.address || address;
          components = addyDetails.components;
        }
      }
    }

    // If still no coordinates, return error with helpful message
    if (!coordinates) {
      return NextResponse.json(
        {
          error: "Could not resolve address",
          suggestion: "Please select an address from the autocomplete suggestions",
        },
        { status: 404 }
      );
    }

    const { lat, lng } = coordinates;
    const suburb = components?.suburb || components?.city || "Dunedin";

    // Step 2: Cross-validate with LINZ
    const validation = await validateWithLinz(lat, lng, resolvedAddress);

    // Step 3: Get property boundary
    const parcel = await getPropertyParcel(lat, lng);
    const totalArea = parcel?.area || 600;
    const lawnPercent = estimateLawnPercent(totalArea);
    const lawnArea = Math.round(totalArea * lawnPercent);

    // Step 4: Get terrain data
    let terrain = { elevation: null, slope: null } as {
      elevation: { min: number; max: number; range: number } | null;
      slope: { percent: number; category: string } | null;
    };
    if (parcel?.geometry) {
      terrain = await getTerrainData(parcel.geometry);
    }

    // Determine gradient from terrain or suburb
    const gradient =
      terrain.slope?.category === "Flat" ||
      terrain.slope?.category === "Gentle slope" ||
      terrain.slope?.category === "Moderate slope" ||
      terrain.slope?.category === "Steep"
        ? (terrain.slope.category as
            | "Flat"
            | "Gentle slope"
            | "Moderate slope"
            | "Steep")
        : estimateGradientBySuburb(suburb);

    // Calculate other estimates
    const edgingM = estimateEdging(lawnArea);
    const access = estimateAccess(totalArea, suburb);
    const hedgeLength = Math.random() > 0.7 ? Math.round(Math.random() * 15 + 5) : 0;

    // Use validation confidence or calculate based on data availability
    const confidence =
      validation.confidence > 0
        ? validation.confidence / 100
        : parcel
          ? 0.8
          : 0.6;

    const response: PropertyAnalysisResponse = {
      status: "success",
      address: {
        input: address,
        resolved: resolvedAddress,
        source: usedSource,
        components,
      },
      coordinates: { lat, lng },
      suburb,
      validation,
      property: {
        totalArea: {
          sqm: Math.round(totalArea),
          sqft: Math.round(totalArea * 10.764),
        },
        boundary: parcel?.geometry || null,
        estimatedLawnArea: {
          sqm: lawnArea,
          sqft: Math.round(lawnArea * 10.764),
          note: "Estimate only - to be confirmed on-site",
        },
      },
      terrain,
      // Legacy fields for backward compatibility
      totalAreaSqm: Math.round(totalArea),
      lawnAreaSqm: lawnArea,
      gradient,
      estimatedEdgingM: edgingM,
      accessDifficulty: access,
      hedgeLengthM: hedgeLength,
      parcelId: parcel?.id,
      confidence,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Property analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze property" },
      { status: 500 }
    );
  }
}
