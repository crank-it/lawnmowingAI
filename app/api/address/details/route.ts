import { NextRequest, NextResponse } from "next/server";

const ADDY_API_KEY = process.env.ADDY_API_KEY;

interface AddyAddressDetails {
  id: string;
  a?: string;
  full?: string;
  x: number; // longitude
  y: number; // latitude
  street?: string;
  suburb?: string;
  city?: string;
  region?: string;
  postcode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addressId, source } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "addressId is required" },
        { status: 400 }
      );
    }

    let coordinates: { lat: number; lng: number } | null = null;
    let fullAddress: string | null = null;
    let components: {
      street?: string;
      suburb?: string;
      city?: string;
      region?: string;
      postcode?: string;
    } | null = null;

    // Get details from Addy
    if (source === "addy" && ADDY_API_KEY) {
      try {
        const detailUrl = `https://api.addysolutions.com/address/${addressId}?key=${ADDY_API_KEY}`;
        const response = await fetch(detailUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data: AddyAddressDetails = await response.json();

          if (data) {
            coordinates = { lat: data.y, lng: data.x };
            fullAddress = data.a || data.full || null;
            components = {
              street: data.street,
              suburb: data.suburb,
              city: data.city,
              region: data.region,
              postcode: data.postcode,
            };
          }
        } else {
          console.error("Addy details error:", response.status);
        }
      } catch (e) {
        console.error("Failed to get Addy details:", e);
      }
    }

    if (!coordinates) {
      return NextResponse.json(
        { error: "Could not resolve address coordinates" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      address: fullAddress,
      coordinates,
      components,
      source,
    });
  } catch (error) {
    console.error("Address details error:", error);
    return NextResponse.json(
      { error: "Failed to get address details" },
      { status: 500 }
    );
  }
}
