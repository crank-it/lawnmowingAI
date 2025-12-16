import { NextRequest, NextResponse } from "next/server";

const LINZ_API_KEY = process.env.LINZ_API_KEY;
const LINZ_ADDRESS_API = "https://api.linz.govt.nz/addressing/v1";
const LINZ_DATA_SERVICE = "https://data.linz.govt.nz/services";

interface AddressResult {
  addressId: string;
  fullAddress: string;
  addressNumber: string;
  roadName: string;
  suburbLocality: string;
  townCity: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
}

interface PropertyAnalysis {
  address: string;
  suburb: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  totalAreaSqm: number;
  lawnAreaSqm: number;
  gradient: "Flat" | "Gentle slope" | "Moderate slope" | "Steep";
  estimatedEdgingM: number;
  accessDifficulty: "Easy" | "Standard" | "Tricky";
  hedgeLengthM: number;
  parcelId?: string;
  confidence: number;
}

// Search for an address using LINZ Address API
async function searchAddress(query: string): Promise<AddressResult | null> {
  try {
    const response = await fetch(
      `${LINZ_ADDRESS_API}/addresses?q=${encodeURIComponent(query)}&size=1`,
      {
        headers: {
          "Authorization": `Bearer ${LINZ_API_KEY}`,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("LINZ Address API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];
    const props = feature.properties;
    const coords = feature.geometry.coordinates;

    return {
      addressId: props.addressId?.toString() || "",
      fullAddress: props.fullAddress || query,
      addressNumber: props.addressNumber || "",
      roadName: props.roadName || "",
      suburbLocality: props.suburbLocality || "",
      townCity: props.townCity || "",
      coordinates: {
        longitude: coords[0],
        latitude: coords[1],
      },
    };
  } catch (error) {
    console.error("Error searching address:", error);
    return null;
  }
}

// Get property parcel data from LINZ WFS
async function getParcelData(lat: number, lng: number): Promise<{
  areaSqm: number;
  parcelId: string;
} | null> {
  try {
    // Use LINZ WFS to get NZ Primary Parcels layer
    // Layer key: layer-50772 (NZ Primary Parcels)
    const bbox = `${lng - 0.001},${lat - 0.001},${lng + 0.001},${lat + 0.001}`;

    const response = await fetch(
      `${LINZ_DATA_SERVICE}/wfs?service=WFS&version=2.0.0&request=GetFeature` +
      `&typeNames=layer-50772&outputFormat=json&srsName=EPSG:4326` +
      `&bbox=${bbox},EPSG:4326&count=1&key=${LINZ_API_KEY}`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("LINZ WFS error:", response.status);
      return null;
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return null;
    }

    const feature = data.features[0];
    const areaSqm = feature.properties?.calculated_area ||
                    feature.properties?.area_sq_m ||
                    feature.properties?.shape_area ||
                    estimateAreaFromGeometry(feature.geometry);

    return {
      areaSqm: Math.round(areaSqm),
      parcelId: feature.properties?.id?.toString() || feature.id || "",
    };
  } catch (error) {
    console.error("Error getting parcel data:", error);
    return null;
  }
}

// Estimate area from GeoJSON geometry (rough calculation)
function estimateAreaFromGeometry(geometry: {
  type: string;
  coordinates: number[][][];
}): number {
  if (!geometry || geometry.type !== "Polygon") {
    return 600; // Default fallback
  }

  try {
    const coords = geometry.coordinates[0];
    // Simple shoelace formula for polygon area
    let area = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      area += coords[i][0] * coords[i + 1][1];
      area -= coords[i + 1][0] * coords[i][1];
    }
    area = Math.abs(area) / 2;

    // Convert from degrees to approximate square meters (rough for NZ latitude)
    const metersPerDegree = 111320; // approximate at ~45° latitude
    area = area * metersPerDegree * metersPerDegree * Math.cos(coords[0][1] * Math.PI / 180);

    return Math.round(area);
  } catch {
    return 600;
  }
}

// Estimate lawn area from total property area
function estimateLawnArea(totalAreaSqm: number): number {
  // Typical NZ residential property:
  // - House footprint: ~120-200 sqm
  // - Driveway/paths: ~30-50 sqm
  // - Gardens/beds: ~10-20% of remaining
  // - Lawn: ~50-70% of total property

  if (totalAreaSqm < 300) {
    return Math.round(totalAreaSqm * 0.4); // Small section, less lawn
  } else if (totalAreaSqm < 600) {
    return Math.round(totalAreaSqm * 0.5);
  } else if (totalAreaSqm < 1000) {
    return Math.round(totalAreaSqm * 0.55);
  } else {
    return Math.round(totalAreaSqm * 0.6); // Larger properties have more lawn
  }
}

// Estimate gradient based on Dunedin suburbs
function estimateGradient(suburb: string): "Flat" | "Gentle slope" | "Moderate slope" | "Steep" {
  const lowerSuburb = suburb.toLowerCase();

  // Hilly Dunedin suburbs
  const steepSuburbs = ["signal hill", "unity park", "halfway bush", "wakari", "maori hill", "roslyn"];
  const moderateSuburbs = ["kaikorai", "mornington", "belleknowes", "woodhaugh", "opoho", "normanby"];
  const gentleSuburbs = ["andersons bay", "musselburgh", "vauxhall", "tainui", "caversham"];

  if (steepSuburbs.some(s => lowerSuburb.includes(s))) return "Steep";
  if (moderateSuburbs.some(s => lowerSuburb.includes(s))) return "Moderate slope";
  if (gentleSuburbs.some(s => lowerSuburb.includes(s))) return "Gentle slope";

  return "Flat"; // Default for most suburbs
}

// Estimate edging length based on lawn area
function estimateEdging(lawnAreaSqm: number): number {
  // Approximate: perimeter based on square root of area, plus some internal edges
  const perimeter = Math.sqrt(lawnAreaSqm) * 4;
  const internalEdges = Math.sqrt(lawnAreaSqm) * 1.5; // paths, garden beds
  return Math.round(perimeter + internalEdges);
}

// Estimate access difficulty based on property size and suburb
function estimateAccess(totalAreaSqm: number, suburb: string): "Easy" | "Standard" | "Tricky" {
  const lowerSuburb = suburb.toLowerCase();

  // Older/hillier suburbs often have tricky access
  const trickySuburbs = ["roslyn", "maori hill", "belleknowes", "mornington"];
  if (trickySuburbs.some(s => lowerSuburb.includes(s))) return "Tricky";

  // Smaller properties often have narrow access
  if (totalAreaSqm < 400) return "Standard";

  return "Easy";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    if (!LINZ_API_KEY) {
      console.error("LINZ_API_KEY not configured");
      // Return mock data if API key not available
      return NextResponse.json(generateMockAnalysis(address));
    }

    // Step 1: Search for address
    const addressResult = await searchAddress(address);

    if (!addressResult) {
      // Return mock data with lower confidence if address not found
      return NextResponse.json({
        ...generateMockAnalysis(address),
        confidence: 0.5,
        message: "Address not found in LINZ database. Using estimated values.",
      });
    }

    // Step 2: Get parcel data
    const parcelData = await getParcelData(
      addressResult.coordinates.latitude,
      addressResult.coordinates.longitude
    );

    // Step 3: Calculate property metrics
    const totalAreaSqm = parcelData?.areaSqm || estimateDefaultArea(addressResult.suburbLocality);
    const lawnAreaSqm = estimateLawnArea(totalAreaSqm);
    const gradient = estimateGradient(addressResult.suburbLocality);
    const estimatedEdgingM = estimateEdging(lawnAreaSqm);
    const accessDifficulty = estimateAccess(totalAreaSqm, addressResult.suburbLocality);

    // Estimate hedge length (rough: 10-20% of properties have significant hedges)
    const hedgeLengthM = Math.random() > 0.7 ? Math.round(Math.random() * 15 + 5) : 0;

    const analysis: PropertyAnalysis = {
      address: addressResult.fullAddress,
      suburb: addressResult.suburbLocality || addressResult.townCity,
      coordinates: {
        lat: addressResult.coordinates.latitude,
        lng: addressResult.coordinates.longitude,
      },
      totalAreaSqm,
      lawnAreaSqm,
      gradient,
      estimatedEdgingM,
      accessDifficulty,
      hedgeLengthM,
      parcelId: parcelData?.parcelId,
      confidence: parcelData ? 0.9 : 0.7,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Property analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze property" },
      { status: 500 }
    );
  }
}

// Estimate default area based on suburb
function estimateDefaultArea(suburb: string): number {
  const lowerSuburb = suburb.toLowerCase();

  // Smaller sections in central/older suburbs
  const smallSuburbs = ["south dunedin", "st kilda", "caversham", "dunedin central"];
  if (smallSuburbs.some(s => lowerSuburb.includes(s))) {
    return 400 + Math.round(Math.random() * 200);
  }

  // Larger sections in newer/outer suburbs
  const largeSuburbs = ["mosgiel", "brighton", "outram", "fairfield"];
  if (largeSuburbs.some(s => lowerSuburb.includes(s))) {
    return 700 + Math.round(Math.random() * 400);
  }

  // Average section size
  return 500 + Math.round(Math.random() * 300);
}

// Generate mock analysis when API not available
function generateMockAnalysis(address: string): PropertyAnalysis {
  const suburbs = address.match(/,\s*([^,]+),?\s*(?:Dunedin)?/i);
  const suburb = suburbs?.[1]?.trim() || "Dunedin";

  const totalAreaSqm = 500 + Math.round(Math.random() * 400);
  const lawnAreaSqm = estimateLawnArea(totalAreaSqm);

  return {
    address: address,
    suburb: suburb,
    coordinates: {
      lat: -45.8788 + (Math.random() - 0.5) * 0.1,
      lng: 170.5028 + (Math.random() - 0.5) * 0.1,
    },
    totalAreaSqm,
    lawnAreaSqm,
    gradient: estimateGradient(suburb),
    estimatedEdgingM: estimateEdging(lawnAreaSqm),
    accessDifficulty: estimateAccess(totalAreaSqm, suburb),
    hedgeLengthM: Math.random() > 0.7 ? Math.round(Math.random() * 15 + 5) : 0,
    confidence: 0.6,
  };
}
