import { NextRequest, NextResponse } from "next/server";
import {
  calculateDistance,
  calculateAddressSimilarity,
  calculatePolygonArea,
  calculateConfidence,
  GeoJSONPolygon,
} from "@/lib/geo-utils";

const LINZ_API_KEY = process.env.LINZ_API_KEY;
const LINZ_BASE = "https://data.linz.govt.nz/services";

const LAYERS = {
  addresses: "105689",
  parcels: "50823",
};

interface LinzAddress {
  full: string;
  coords: [number, number]; // [lng, lat]
  distance: number;
}

interface ValidationResult {
  linzMatch: boolean;
  linzAddress: string | null;
  linzDistance?: number;
  confidence: number;
  parcel: {
    id: string;
    area: number;
    geometry: GeoJSONPolygon;
  } | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, address } = body;

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Coordinates required" },
        { status: 400 }
      );
    }

    const validation: ValidationResult = {
      linzMatch: false,
      linzAddress: null,
      confidence: 0,
      parcel: null,
    };

    if (!LINZ_API_KEY) {
      console.warn("LINZ_API_KEY not configured");
      return NextResponse.json(validation);
    }

    // Step 1: Find LINZ addresses near these coordinates
    try {
      // Search for addresses within ~50m of the point
      const buffer = 0.0005; // roughly 50m
      const bbox = `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`;

      const params = new URLSearchParams({
        service: "WFS",
        version: "2.0.0",
        request: "GetFeature",
        typeNames: `layer-${LAYERS.addresses}`,
        outputFormat: "application/json",
        bbox: bbox,
        count: "10",
      });

      const addressUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?${params}`;
      const addressResponse = await fetch(addressUrl, {
        headers: { Accept: "application/json" },
      });

      if (addressResponse.ok) {
        const addressData = await addressResponse.json();

        if (addressData.features && addressData.features.length > 0) {
          // Find best matching address
          const linzAddresses: LinzAddress[] = addressData.features.map(
            (f: {
              properties: { full_address: string };
              geometry: { coordinates: [number, number] };
            }) => ({
              full: f.properties.full_address,
              coords: f.geometry.coordinates,
              distance: calculateDistance(
                lat,
                lng,
                f.geometry.coordinates[1],
                f.geometry.coordinates[0]
              ),
            })
          );

          // Sort by distance
          linzAddresses.sort((a, b) => a.distance - b.distance);
          const closest = linzAddresses[0];

          validation.linzAddress = closest.full;
          validation.linzMatch = true;
          validation.linzDistance = Math.round(closest.distance);

          // Calculate confidence
          const textSimilarity = address
            ? calculateAddressSimilarity(address, closest.full)
            : 0.5;
          validation.confidence = calculateConfidence(
            closest.distance,
            textSimilarity
          );
        }
      } else {
        console.warn("LINZ address lookup failed:", addressResponse.status);
      }
    } catch (e) {
      console.warn("LINZ address lookup error:", e);
    }

    // Step 2: Get property parcel
    try {
      const params = new URLSearchParams({
        service: "WFS",
        version: "2.0.0",
        request: "GetFeature",
        typeNames: `layer-${LAYERS.parcels}`,
        outputFormat: "application/json",
        cql_filter: `INTERSECTS(shape, POINT(${lng} ${lat}))`,
      });

      const parcelUrl = `${LINZ_BASE};key=${LINZ_API_KEY}/wfs?${params}`;
      const parcelResponse = await fetch(parcelUrl, {
        headers: { Accept: "application/json" },
      });

      if (parcelResponse.ok) {
        const parcelData = await parcelResponse.json();

        if (parcelData.features && parcelData.features.length > 0) {
          const parcel = parcelData.features[0];
          const geometry = parcel.geometry as GeoJSONPolygon;
          const area =
            parcel.properties?.calc_area || calculatePolygonArea(geometry);

          validation.parcel = {
            id: parcel.properties?.id?.toString() || parcel.id || "",
            area: Math.round(area),
            geometry,
          };
        }
      } else {
        console.warn("LINZ parcel lookup failed:", parcelResponse.status);
      }
    } catch (e) {
      console.warn("LINZ parcel lookup error:", e);
    }

    return NextResponse.json(validation);
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
