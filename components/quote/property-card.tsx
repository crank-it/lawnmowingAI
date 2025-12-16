"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyData } from "@/types/property";
import { PropertyMap } from "@/components/shared/property-map";

interface PropertyCardProps {
  address: string;
  propertyData: PropertyData | null;
  coordinates?: { lat: number; lng: number } | null;
  isLoading?: boolean;
  confidence?: number;
  className?: string;
}

const stats = [
  { key: "totalArea", label: "Total Property", icon: "📐", suffix: "m²" },
  { key: "lawnArea", label: "Lawn Area", icon: "🌿", suffix: "m²" },
  { key: "gradient", label: "Gradient", icon: "⛰️", suffix: "" },
  { key: "estimatedEdging", label: "Edging", icon: "✂️", suffix: "m" },
  { key: "accessDifficulty", label: "Access", icon: "🚶", suffix: "" },
  { key: "hedgeLength", label: "Hedges", icon: "🌳", suffix: "m" },
];

function getConfidenceLabel(confidence: number): { label: string; color: string } {
  if (confidence >= 0.8) return { label: "High Confidence", color: "bg-green-100 text-green-700 border-green-200" };
  if (confidence >= 0.5) return { label: "AI Estimated", color: "bg-lawn-teal/10 text-lawn-teal border-lawn-teal/20" };
  return { label: "Rough Estimate", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
}

export function PropertyCard({
  address,
  propertyData,
  coordinates,
  isLoading = false,
  confidence = 0.5,
  className,
}: PropertyCardProps) {
  const confidenceInfo = getConfidenceLabel(confidence);

  return (
    <Card className={cn("border-0 bg-card rounded-2xl shadow-beefy-sm", className)}>
      <CardHeader className="pb-3 lg:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="font-heading text-lg lg:text-xl mb-1">
              Property Analysis
            </CardTitle>
            <p className="text-muted-foreground text-sm truncate">{address}</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-24 rounded-full" />
          ) : (
            <Badge
              variant="secondary"
              className={cn("border self-start whitespace-nowrap", confidenceInfo.color)}
            >
              🛰️ {confidenceInfo.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Satellite Map View */}
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : coordinates ? (
          <PropertyMap
            lat={coordinates.lat}
            lng={coordinates.lng}
            address={address}
            height="200px"
            className="shadow-sm"
          />
        ) : null}

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 lg:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="bg-muted rounded-xl p-2 lg:p-3 text-center"
              >
                <span className="text-lg lg:text-2xl block mb-0.5 lg:mb-1">
                  {stat.icon}
                </span>
                <Skeleton className="h-4 w-12 mx-auto mb-1" />
                <p className="text-[10px] lg:text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        ) : propertyData ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 lg:gap-4">
            {stats.map((stat) => {
              const value = propertyData[stat.key as keyof PropertyData];
              return (
                <div
                  key={stat.key}
                  className="bg-muted rounded-xl p-2 lg:p-3 text-center"
                >
                  <span className="text-lg lg:text-2xl block mb-0.5 lg:mb-1">
                    {stat.icon}
                  </span>
                  <p className="font-mono font-semibold text-xs lg:text-sm text-foreground truncate">
                    {value}
                    {stat.suffix}
                  </p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground truncate">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Unable to analyze property
          </div>
        )}

        {/* Confidence indicator */}
        {!isLoading && propertyData && confidence < 0.8 && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Final measurements confirmed during free on-site assessment
          </p>
        )}
      </CardContent>
    </Card>
  );
}
