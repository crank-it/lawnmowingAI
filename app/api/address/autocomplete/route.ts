import { NextRequest, NextResponse } from "next/server";

const ADDY_API_KEY = process.env.ADDY_API_KEY;
const ADDY_BASE = "https://api.addysolutions.com/search";

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

    if (!query || query.length < 3) {
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
        const addyUrl = `${ADDY_BASE}?key=${ADDY_API_KEY}&s=${encodeURIComponent(query)}&max=6`;
        const addyResponse = await fetch(addyUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (addyResponse.ok) {
          const addyData: AddyResponse = await addyResponse.json();

          if (addyData.addresses) {
            addyData.addresses.forEach((addr) => {
              results.push({
                source: "addy",
                address: addr.a,
                addressId: addr.id,
                confidence: 0.95, // Addy has excellent NZ coverage
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
