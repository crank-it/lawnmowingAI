"use client";

import { cn } from "@/lib/utils";

interface SuburbPillsProps {
  suburbs: string[];
  onSelect: (suburb: string) => void;
  className?: string;
}

export function SuburbPills({ suburbs, onSelect, className }: SuburbPillsProps) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-1.5 lg:gap-2", className)}>
      <span className="text-xs lg:text-sm text-muted-foreground mr-1">Popular:</span>
      {suburbs.map((suburb) => (
        <button
          key={suburb}
          onClick={() => onSelect(suburb)}
          className={cn(
            "px-2.5 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium",
            "bg-card/60 text-muted-foreground",
            "hover:bg-card hover:text-foreground hover:shadow-sm",
            "transition-all cursor-pointer"
          )}
        >
          {suburb}
        </button>
      ))}
    </div>
  );
}
