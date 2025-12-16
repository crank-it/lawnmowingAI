import { NextRequest, NextResponse } from "next/server";

const ADDY_API_KEY = process.env.ADDY_API_KEY;
const ADDY_BASE = "https://api.addysolutions.com/search";

// South Island cities and regions for filtering
const SOUTH_ISLAND_LOCATIONS = [
  // Otago
  "dunedin", "mosgiel", "oamaru", "alexandra", "cromwell", "queenstown",
  "wanaka", "balclutha", "milton", "palmerston", "port chalmers", "otago",
  // Canterbury
  "christchurch", "timaru", "ashburton", "rangiora", "kaiapoi", "rolleston",
  "lincoln", "geraldine", "temuka", "canterbury",
  // Southland
  "invercargill", "gore", "winton", "te anau", "riverton", "southland",
  // West Coast
  "greymouth", "hokitika", "westport", "reefton", "west coast",
  // Nelson/Tasman/Marlborough
  "nelson", "richmond", "blenheim", "picton", "motueka", "takaka",
  "marlborough", "tasman",
];

function isSouthIslandAddress(address: string): boolean {
  const lowerAddress = address.toLowerCase();
  return SOUTH_ISLAND_LOCATIONS.some(location => lowerAddress.includes(location));
}

interface AddyAddress {
  id: string;
  a: string; // Full address
  street?: string;
  suburb?: string;
  city?: string;
  postcode?: string;
}

interface AddyResponse {
  addresses?: AddyAddress[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: {
      source: string;
      address: string;
      addressId: string;
      confidence: number;
      components: {
        street?: string;
        suburb?: string;
        city?: string;
        postcode?: string;
      } | null;
    }[] = [];

    // Primary source: Addy Solutions
    if (ADDY_API_KEY) {
      try {
        // Add "Dunedin" hint if query doesn't already include a city
        // This helps Addy prioritize South Island results
        const hasLocationHint = SOUTH_ISLAND_LOCATIONS.some(loc =>
          query.toLowerCase().includes(loc)
        );
        const searchQuery = hasLocationHint ? query : `${query} Dunedin`;

        // Request more results so we have enough after filtering
        const addyUrl = `${ADDY_BASE}?key=${ADDY_API_KEY}&s=${encodeURIComponent(searchQuery)}&max=15`;
        const addyResponse = await fetch(addyUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (addyResponse.ok) {
          const addyData: AddyResponse = await addyResponse.json();

          if (addyData.addresses) {
            // Filter to South Island only and limit to 6 results
            const southIslandAddresses = addyData.addresses
              .filter(addr => isSouthIslandAddress(addr.a))
              .slice(0, 6);

            southIslandAddresses.forEach((addr) => {
              results.push({
                source: "addy",
                address: addr.a,
                addressId: addr.id,
                confidence: 0.95,
                components: {
                  street: addr.street,
                  suburb: addr.suburb,
                  city: addr.city,
                  postcode: addr.postcode,
                },
              });
            });
          }
        } else {
          console.warn("Addy API error:", addyResponse.status);
        }
      } catch (e) {
        console.warn("Addy lookup failed:", e);
      }
    } else {
      console.warn("ADDY_API_KEY not configured");
    }

    return NextResponse.json({
      results,
      sources: {
        addy: !!ADDY_API_KEY,
      },
    });
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json({ error: "Autocomplete failed" }, { status: 500 });
  }
}
