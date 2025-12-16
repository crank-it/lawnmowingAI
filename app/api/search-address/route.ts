import { NextRequest, NextResponse } from "next/server";

interface AddressSuggestion {
  address: string;
  suburb: string;
  city: string;
  lat: number;
  lng: number;
}

// Use OpenStreetMap Nominatim for free address search
// Filtered to New Zealand only
async function searchNominatim(query: string): Promise<AddressSuggestion[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&` +
      `countrycodes=nz&` +
      `format=json&` +
      `addressdetails=1&` +
      `limit=6`,
      {
        headers: {
          "User-Agent": "LawnMowing.ai/1.0 (contact@lawnmowing.ai)",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Nominatim error:", response.status);
      return [];
    }

    const data = await response.json();

    return data
      .map((item: {
        display_name: string;
        lat: string;
        lon: string;
        address: {
          house_number?: string;
          road?: string;
          suburb?: string;
          city?: string;
          town?: string;
          village?: string;
          state?: string;
        };
      }) => {
        const addr = item.address;
        const houseNumber = addr.house_number || "";
        const road = addr.road || "";
        const suburb = addr.suburb || addr.city || addr.town || addr.village || "";
        const city = addr.city || addr.town || addr.village || addr.state || "";

        // Format a clean address
        const streetAddress = [houseNumber, road].filter(Boolean).join(" ");
        const fullAddress = [streetAddress, suburb, city]
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
          .join(", ");

        return {
          address: fullAddress || item.display_name.split(",").slice(0, 3).join(","),
          suburb: suburb,
          city: city,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        };
      })
      .filter((item: AddressSuggestion) => item.address.length > 5);
  } catch (error) {
    console.error("Nominatim search error:", error);
    return [];
  }
}

// Also try LINZ Address API if available
async function searchLINZ(query: string): Promise<AddressSuggestion[]> {
  const LINZ_API_KEY = process.env.LINZ_API_KEY;
  if (!LINZ_API_KEY) return [];

  try {
    const response = await fetch(
      `https://api.linz.govt.nz/addressing/v1/addresses?q=${encodeURIComponent(query)}&size=6`,
      {
        headers: {
          "Authorization": `Bearer ${LINZ_API_KEY}`,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data.features) return [];

    return data.features.map((feature: {
      properties: {
        fullAddress?: string;
        suburbLocality?: string;
        townCity?: string;
      };
      geometry: {
        coordinates: [number, number];
      };
    }) => ({
      address: feature.properties.fullAddress || "",
      suburb: feature.properties.suburbLocality || "",
      city: feature.properties.townCity || "",
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
    }));
  } catch (error) {
    console.error("LINZ search error:", error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  // Try both sources in parallel
  const [nominatimResults, linzResults] = await Promise.all([
    searchNominatim(query),
    searchLINZ(query),
  ]);

  // Prefer LINZ results if available, otherwise use Nominatim
  let suggestions = linzResults.length > 0 ? linzResults : nominatimResults;

  // Remove duplicates based on address
  const seen = new Set<string>();
  suggestions = suggestions.filter((s) => {
    const key = s.address.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Limit to 6 results
  suggestions = suggestions.slice(0, 6);

  return NextResponse.json({ suggestions });
}
