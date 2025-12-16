"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FrequencyPicker } from "./frequency-picker";
import { Frequency } from "@/types/quote";
import { getServiceById } from "@/lib/data/services";

interface QuoteSummaryProps {
  selectedServices: string[];
  frequency: Frequency;
  onFrequencyChange: (frequency: Frequency) => void;
  priceRange: { min: number; max: number };
  onBookClick: () => void;
  className?: string;
}

export function QuoteSummary({
  selectedServices,
  frequency,
  onFrequencyChange,
  priceRange,
  onBookClick,
  className,
}: QuoteSummaryProps) {
  const serviceDetails = selectedServices
    .map((id) => getServiceById(id))
    .filter(Boolean);

  return (
    <Card className={cn("border-0 bg-card rounded-2xl shadow-beefy-md", className)}>
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="font-heading text-lg lg:text-xl">Your Quote</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6">
        {/* Frequency Picker */}
        <div>
          <p className="text-xs lg:text-sm text-muted-foreground mb-2">
            How often would you like us to visit?
          </p>
          <FrequencyPicker value={frequency} onChange={onFrequencyChange} />
        </div>

        {/* Price Display */}
        <div className="bg-gradient-to-br from-beefy-green to-beefy-green-light rounded-xl p-4 lg:p-6 text-center text-white">
          <p className="text-xs lg:text-sm opacity-90 mb-1">Estimated price per visit</p>
          <div className="font-mono text-3xl lg:text-4xl font-bold">
            ${priceRange.min} - ${priceRange.max}
          </div>
          {frequency === "weekly" && (
            <p className="text-xs lg:text-sm opacity-90 mt-2">
              Includes 15% regular customer discount
            </p>
          )}
          {frequency === "fortnightly" && (
            <p className="text-xs lg:text-sm opacity-90 mt-2">
              Includes 10% regular customer discount
            </p>
          )}
        </div>

        {/* Selected Services */}
        <div>
          <p className="text-xs lg:text-sm text-muted-foreground mb-2">
            Included services:
          </p>
          <div className="flex flex-wrap gap-1.5 lg:gap-2">
            {serviceDetails.map(
              (service) =>
                service && (
                  <Badge
                    key={service.id}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground text-xs"
                  >
                    {service.icon} {service.name}
                  </Badge>
                )
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onBookClick}
          className={cn(
            "w-full bg-gradient-to-br from-beefy-red to-beefy-red-dark text-white",
            "font-heading font-bold rounded-xl px-6 py-5 lg:px-8 lg:py-6 text-base lg:text-lg",
            "transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
          )}
        >
          Book Free Assessment →
        </Button>

        {/* Trust Badges */}
        <div className="flex justify-center gap-4 text-xs lg:text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span>✓</span> No obligation
          </span>
          <span className="flex items-center gap-1">
            <span>✓</span> Free quote
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
