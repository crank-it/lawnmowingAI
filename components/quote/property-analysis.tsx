"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PropertyMap } from "@/components/shared/property-map";

interface PropertyAnalysisProps {
  isOpen: boolean;
  onComplete: () => void;
  address: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const analysisSteps = [
  { label: "Locating property", duration: 800 },
  { label: "Loading satellite imagery", duration: 1000 },
  { label: "Detecting property boundaries", duration: 800 },
  { label: "Measuring lawn area", duration: 700 },
  { label: "Checking slope gradient", duration: 600 },
  { label: "Calculating quote", duration: 500 },
];

export function PropertyAnalysis({
  isOpen,
  onComplete,
  address,
}: PropertyAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Fetch coordinates when dialog opens
  useEffect(() => {
    if (!isOpen || !address) return;

    const fetchCoordinates = async () => {
      try {
        // Use our search-address API to get coordinates
        const response = await fetch(`/api/search-address?q=${encodeURIComponent(address)}`);
        const data = await response.json();

        if (data.suggestions && data.suggestions.length > 0) {
          const firstResult = data.suggestions[0];
          setCoordinates({
            lat: firstResult.lat,
            lng: firstResult.lng,
          });
        } else {
          // Fallback to Dunedin center if no results
          setCoordinates({ lat: -45.8788, lng: 170.5028 });
        }
      } catch (error) {
        console.error("Failed to fetch coordinates:", error);
        // Fallback to Dunedin center
        setCoordinates({ lat: -45.8788, lng: 170.5028 });
      }
    };

    fetchCoordinates();
  }, [isOpen, address]);

  // Run analysis animation
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      setShowMap(false);
      setCoordinates(null);
      return;
    }

    let stepIndex = 0;
    const totalSteps = analysisSteps.length;

    const runAnalysis = () => {
      if (stepIndex >= totalSteps) {
        setTimeout(() => {
          onComplete();
        }, 500);
        return;
      }

      setCurrentStep(stepIndex);
      setProgress(((stepIndex + 1) / totalSteps) * 100);

      // Show map after "Loading satellite imagery" step
      if (stepIndex >= 1) {
        setShowMap(true);
      }

      setTimeout(() => {
        stepIndex++;
        runAnalysis();
      }, analysisSteps[stepIndex].duration);
    };

    const timer = setTimeout(runAnalysis, 400);

    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-lg bg-card border-0 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-center">
            🛰️ Analyzing Property
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Address Display */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Scanning</p>
            <p className="font-medium text-foreground">{address}</p>
          </div>

          {/* Satellite View - Real Map or Placeholder */}
          <div className="relative h-48 rounded-xl overflow-hidden">
            {showMap && coordinates ? (
              <>
                <PropertyMap
                  lat={coordinates.lat}
                  lng={coordinates.lng}
                  address={address}
                  height="192px"
                  showToggle={false}
                />
                {/* Scanning overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Scanning line */}
                  <div
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lawn-teal to-transparent"
                    style={{
                      top: `${((currentStep - 1) / (analysisSteps.length - 2)) * 100}%`,
                      transition: "top 0.6s ease-out",
                      opacity: currentStep < analysisSteps.length - 1 ? 1 : 0,
                    }}
                  />
                  {/* Corner markers */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-lawn-teal" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-lawn-teal" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-lawn-teal" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-lawn-teal" />

                  {/* Status badge */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                    {currentStep < analysisSteps.length - 1 ? "AI Scanning..." : "Complete ✓"}
                  </div>
                </div>
              </>
            ) : (
              // Loading placeholder
              <div className="w-full h-full bg-gradient-to-br from-lawn-teal/20 to-lawn-grass/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl animate-pulse mb-2">🛰️</div>
                  <p className="text-sm text-muted-foreground">Loading satellite view...</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          {/* Analysis Steps */}
          <div className="space-y-2">
            {analysisSteps.map((step, index) => (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-3 text-sm transition-all duration-300",
                  index < currentStep && "text-lawn-teal",
                  index === currentStep && "text-foreground font-medium",
                  index > currentStep && "text-muted-foreground/50"
                )}
              >
                <span className="w-5 text-center">
                  {index < currentStep ? (
                    "✓"
                  ) : index === currentStep ? (
                    <span className="inline-block animate-spin">⏳</span>
                  ) : (
                    "○"
                  )}
                </span>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
