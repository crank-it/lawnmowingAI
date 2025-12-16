"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTourStore, tourSteps } from "@/stores/tour-store";
import { cn } from "@/lib/utils";

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: "top" | "bottom" | "left" | "right";
}

export function TourOverlay() {
  const { isActive, currentStep, nextStep, prevStep, endTour } = useTourStore();
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const calculatePosition = useCallback(() => {
    if (!step) return;

    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      // If target not found, try next step or position in center
      setTargetRect(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 175,
        arrowPosition: "top",
      });
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    setTargetRect(rect);

    const tooltipWidth = 350;
    const tooltipHeight = 180;
    const padding = 16;
    const arrowOffset = 12;

    let top = 0;
    let left = 0;
    let arrowPosition = step.position;

    switch (step.position) {
      case "top":
        top = rect.top - tooltipHeight - arrowOffset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowPosition = "bottom";
        break;
      case "bottom":
        top = rect.bottom + arrowOffset;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowPosition = "top";
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - arrowOffset;
        arrowPosition = "right";
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + arrowOffset;
        arrowPosition = "left";
        break;
    }

    // Clamp to viewport
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));

    setTooltipPosition({ top, left, arrowPosition });
  }, [step]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isActive || !mounted) return;

    calculatePosition();

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    // Recalculate on any layout changes
    const observer = new MutationObserver(calculatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      observer.disconnect();
    };
  }, [isActive, currentStep, mounted, calculatePosition]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        endTour();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        nextStep();
      } else if (e.key === "ArrowLeft") {
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, nextStep, prevStep, endTour]);

  if (!mounted || !isActive || !tooltipPosition) return null;

  const arrowClasses = {
    top: "before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-card",
    bottom:
      "before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-card",
    left: "before:absolute before:top-1/2 before:-left-2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-card",
    right:
      "before:absolute before:top-1/2 before:-right-2 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-l-card",
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border */}
      {targetRect && (
        <div
          className="absolute border-2 border-primary rounded-xl pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      {/* Tooltip */}
      <Card
        className={cn(
          "absolute w-[350px] p-4 bg-card border-primary/50 shadow-2xl z-10",
          arrowClasses[tooltipPosition.arrowPosition]
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Step counter */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">
            Step {currentStep + 1} of {tourSteps.length}
          </span>
          <button
            onClick={endTour}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Skip tour
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-3">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentStep
                  ? "w-6 bg-primary"
                  : index < currentStep
                    ? "w-1.5 bg-primary/50"
                    : "w-1.5 bg-muted"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="font-heading font-bold text-lg mb-2">{step?.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {step?.content}
        </p>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={isFirstStep}
            className={cn(isFirstStep && "invisible")}
          >
            ← Back
          </Button>

          <Button
            size="sm"
            onClick={nextStep}
            className="bg-primary hover:bg-primary/90"
          >
            {isLastStep ? "Finish Tour 🎉" : "Next →"}
          </Button>
        </div>
      </Card>

      {/* Click blocker - allow clicks only on tooltip */}
      <div
        className="absolute inset-0 -z-10"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
    </div>,
    document.body
  );
}
