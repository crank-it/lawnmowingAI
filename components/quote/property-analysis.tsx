"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface PropertyAnalysisProps {
  isOpen: boolean;
  onComplete: () => void;
  address: string;
}

const analysisSteps = [
  { label: "Detecting property boundaries", duration: 600 },
  { label: "Measuring lawn area", duration: 700 },
  { label: "Checking slope gradient", duration: 600 },
  { label: "Calculating access routes", duration: 600 },
];

export function PropertyAnalysis({
  isOpen,
  onComplete,
  address,
}: PropertyAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    const totalSteps = analysisSteps.length;

    const runAnalysis = () => {
      if (stepIndex >= totalSteps) {
        setTimeout(() => {
          onComplete();
        }, 300);
        return;
      }

      setCurrentStep(stepIndex);
      setProgress(((stepIndex + 1) / totalSteps) * 100);

      setTimeout(() => {
        stepIndex++;
        runAnalysis();
      }, analysisSteps[stepIndex].duration);
    };

    const timer = setTimeout(runAnalysis, 300);

    return () => clearTimeout(timer);
  }, [isOpen, onComplete]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl shadow-beefy-lg">
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

          {/* Satellite View Simulation */}
          <div className="relative h-40 bg-gradient-to-br from-beefy-green/20 to-beefy-green-light/20 rounded-xl overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(45, 90, 39, 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(45, 90, 39, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>

            {/* Scanning Line Animation */}
            <div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-beefy-green-light to-transparent animate-pulse"
              style={{
                top: `${(currentStep / analysisSteps.length) * 100}%`,
                transition: "top 0.5s ease-out",
              }}
            />

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-5xl animate-pulse">🏡</div>
            </div>

            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-beefy-green" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-beefy-green" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-beefy-green" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-beefy-green" />
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
                  index < currentStep && "text-beefy-green",
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
