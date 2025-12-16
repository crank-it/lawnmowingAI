"use client";

import { cn } from "@/lib/utils";
import { Frequency } from "@/types/quote";

interface FrequencyPickerProps {
  value: Frequency;
  onChange: (value: Frequency) => void;
  className?: string;
}

const frequencies: {
  value: Frequency;
  label: string;
  discount?: string;
}[] = [
  { value: "weekly", label: "Weekly", discount: "15% off" },
  { value: "fortnightly", label: "Fortnightly", discount: "10% off" },
  { value: "monthly", label: "Monthly" },
];

export function FrequencyPicker({
  value,
  onChange,
  className,
}: FrequencyPickerProps) {
  return (
    <div
      className={cn(
        "flex bg-muted rounded-xl p-1",
        className
      )}
    >
      {frequencies.map((freq) => (
        <button
          key={freq.value}
          onClick={() => onChange(freq.value)}
          className={cn(
            "flex-1 relative py-3 px-4 rounded-lg text-sm font-medium transition-all",
            value === freq.value
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{freq.label}</span>
          {freq.discount && (
            <span
              className={cn(
                "absolute -top-1 -right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                value === freq.value
                  ? "bg-beefy-green text-white"
                  : "bg-beefy-green/20 text-beefy-green"
              )}
            >
              {freq.discount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
