"use client";

import { cn } from "@/lib/utils";
import { DogSize } from "@/types/quote";

interface DogSizeSelectorProps {
  value?: DogSize;
  onChange: (size: DogSize) => void;
  className?: string;
}

const dogSizes: { value: DogSize; label: string; price: string; emoji: string }[] = [
  { value: "small", label: "Small", price: "$10", emoji: "🐕" },
  { value: "medium", label: "Medium", price: "$15", emoji: "🐕" },
  { value: "large", label: "Large", price: "$20", emoji: "🐕" },
];

export function DogSizeSelector({
  value,
  onChange,
  className,
}: DogSizeSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-muted-foreground">Select dog size:</p>
      <div className="flex gap-2">
        {dogSizes.map((size) => (
          <button
            key={size.value}
            onClick={() => onChange(size.value)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
              value === size.value
                ? "bg-secondary border-2 border-beefy-green"
                : "bg-muted/50 border-2 border-transparent hover:bg-muted"
            )}
          >
            <span className="text-xl">{size.emoji}</span>
            <span className="text-sm font-medium">{size.label}</span>
            <span className="text-xs text-muted-foreground">{size.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
