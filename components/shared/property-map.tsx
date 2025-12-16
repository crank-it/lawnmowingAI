"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyMapProps {
  lat: number;
  lng: number;
  address?: string;
  className?: string;
  height?: string;
  showToggle?: boolean;
}

export function PropertyMap({
  lat,
  lng,
  address,
  className,
  height = "200px",
  showToggle = true,
}: PropertyMapProps) {
  const [mapType, setMapType] = useState<"satellite" | "roadmap">("satellite");

  // Always prefer Google's place search with the address if provided
  // Google is excellent at NZ address geocoding and will show the correct location
  // Only fall back to coordinates if no address is provided
  const mapUrl = address
    ? `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&zoom=19&maptype=${mapType}`
    : `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${lat},${lng}&zoom=19&maptype=${mapType}`;

  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      <iframe
        src={mapUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={address || "Property Location"}
        className="w-full"
      />

      {showToggle && (
        <div className="absolute bottom-2 right-2 flex gap-1 bg-white/90 rounded-lg p-1 shadow-md">
          <button
            onClick={() => setMapType("satellite")}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded transition-colors",
              mapType === "satellite"
                ? "bg-lawn-teal text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType("roadmap")}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded transition-colors",
              mapType === "roadmap"
                ? "bg-lawn-teal text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Map
          </button>
        </div>
      )}

      {/* Scanning overlay effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-lawn-teal" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-lawn-teal" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-lawn-teal" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-lawn-teal" />
      </div>
    </div>
  );
}
