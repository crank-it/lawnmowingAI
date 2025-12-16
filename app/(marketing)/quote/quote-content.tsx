"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/components/quote/property-card";
import { ServiceSelector } from "@/components/quote/service-selector";
import { QuoteSummary } from "@/components/quote/quote-summary";
import { BookingModal } from "@/components/quote/booking-modal";
import { PropertyData } from "@/types/property";
import { Frequency, DogSize } from "@/types/quote";
import { calculatePrice } from "@/lib/data/pricing";
import { submitQuote } from "@/lib/supabase/queries";
import { toast } from "sonner";

interface PropertyAnalysisResponse {
  address: string;
  suburb: string;
  coordinates: { lat: number; lng: number };
  totalAreaSqm: number;
  lawnAreaSqm: number;
  gradient: "Flat" | "Gentle slope" | "Moderate slope" | "Steep";
  estimatedEdgingM: number;
  accessDifficulty: "Easy" | "Standard" | "Tricky";
  hedgeLengthM: number;
  parcelId?: string;
  confidence: number;
  message?: string;
}

// Fetch property analysis from our API
async function analyzeProperty(address: string): Promise<PropertyAnalysisResponse> {
  const response = await fetch("/api/analyze-property", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze property");
  }

  return response.json();
}

export function QuoteContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "123 Example Street, Dunedin";

  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [suburb, setSuburb] = useState<string>("Dunedin");
  const [confidence, setConfidence] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>(["mowing"]);
  const [frequency, setFrequency] = useState<Frequency>("fortnightly");
  const [dogSize, setDogSize] = useState<DogSize | undefined>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch property data from API on mount
  useEffect(() => {
    async function fetchPropertyData() {
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeProperty(address);

        setPropertyData({
          totalArea: analysis.totalAreaSqm,
          lawnArea: analysis.lawnAreaSqm,
          gradient: analysis.gradient,
          estimatedEdging: analysis.estimatedEdgingM,
          accessDifficulty: analysis.accessDifficulty,
          hedgeLength: analysis.hedgeLengthM,
        });
        setCoordinates(analysis.coordinates);
        setSuburb(analysis.suburb);
        setConfidence(analysis.confidence);
      } catch (error) {
        console.error("Property analysis failed:", error);
        // Fallback to default values
        setPropertyData({
          totalArea: 600,
          lawnArea: 350,
          gradient: "Flat",
          estimatedEdging: 60,
          accessDifficulty: "Easy",
          hedgeLength: 0,
        });
        // Fallback to Dunedin center
        setCoordinates({ lat: -45.8788, lng: 170.5028 });
        setConfidence(0.3);
      } finally {
        setIsAnalyzing(false);
      }
    }

    fetchPropertyData();
  }, [address]);

  // Calculate price (only when propertyData is available)
  const priceBreakdown = propertyData
    ? calculatePrice(propertyData, selectedServices, frequency, suburb, dogSize)
    : { priceRange: { min: 0, max: 0 }, breakdown: [] };

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        // If removing dog cleanup, also clear dog size
        if (serviceId === "dogcleanup") {
          setDogSize(undefined);
        }
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleBookingSubmit = async (data: {
    name: string;
    phone: string;
    email?: string;
  }) => {
    if (!propertyData) return;

    setIsSubmitting(true);

    try {
      // Submit quote to Supabase
      await submitQuote({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address,
        suburb,
        // Property data
        total_area_sqm: propertyData.totalArea,
        lawn_area_sqm: propertyData.lawnArea,
        gradient: propertyData.gradient,
        estimated_edging_m: propertyData.estimatedEdging,
        access_difficulty: propertyData.accessDifficulty,
        hedge_length_m: propertyData.hedgeLength,
        // Quote details
        services: selectedServices,
        frequency: frequency,
        dog_size: dogSize || null,
        price_min: priceBreakdown.priceRange.min,
        price_max: priceBreakdown.priceRange.max,
      });

      setIsBookingOpen(false);
      toast.success("Booking request sent!", {
        description: "William will be in touch within 24 hours to arrange your free assessment.",
      });
    } catch (error) {
      console.error("Failed to submit quote:", error);
      toast.error("Something went wrong", {
        description: "Please try again or call us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Your Instant Quote
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Customize your lawn care package below
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4 lg:space-y-6">
            {/* Property Analysis Card */}
            <PropertyCard
              address={address}
              propertyData={propertyData}
              coordinates={coordinates}
              isLoading={isAnalyzing}
              confidence={confidence}
            />

            {/* Service Selection */}
            <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="font-heading text-lg lg:text-xl">
                  Build Your Service Package
                </CardTitle>
                <p className="text-muted-foreground text-xs lg:text-sm">
                  Lawn mowing is always included. Add extras as needed.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ServiceSelector
                  selectedServices={selectedServices}
                  onToggle={handleToggleService}
                  dogSize={dogSize}
                  onDogSizeChange={setDogSize}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sticky on desktop, normal flow on mobile */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <QuoteSummary
              selectedServices={selectedServices}
              frequency={frequency}
              onFrequencyChange={setFrequency}
              priceRange={priceBreakdown.priceRange}
              onBookClick={() => setIsBookingOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={handleBookingSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
