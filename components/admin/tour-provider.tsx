"use client";

import { useEffect } from "react";
import { TourOverlay } from "./tour-overlay";
import { useTourStore } from "@/stores/tour-store";

interface TourProviderProps {
  children: React.ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const { hasCompletedTour, startTour, isActive } = useTourStore();

  // Auto-start tour for first-time users
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!hasCompletedTour && !isActive) {
        startTour();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [hasCompletedTour, isActive, startTour]);

  return (
    <>
      {children}
      <TourOverlay />
    </>
  );
}
