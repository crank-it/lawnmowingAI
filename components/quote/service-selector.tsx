"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { services } from "@/lib/data/services";
import { DogSizeSelector } from "./dog-size-selector";
import { DogSize } from "@/types/quote";

interface ServiceSelectorProps {
  selectedServices: string[];
  onToggle: (serviceId: string) => void;
  dogSize?: DogSize;
  onDogSizeChange?: (size: DogSize) => void;
  className?: string;
}

export function ServiceSelector({
  selectedServices,
  onToggle,
  dogSize,
  onDogSizeChange,
  className,
}: ServiceSelectorProps) {
  const isDogCleanupSelected = selectedServices.includes("dogcleanup");

  return (
    <div className={cn("space-y-2 lg:space-y-3", className)}>
      {services.map((service) => {
        const isSelected = selectedServices.includes(service.id);
        const isMowing = service.id === "mowing";

        return (
          <div key={service.id}>
            <div
              onClick={() => !isMowing && onToggle(service.id)}
              className={cn(
                "flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl transition-all",
                isMowing
                  ? "bg-secondary border-2 border-beefy-green cursor-default"
                  : isSelected
                    ? "bg-secondary border-2 border-beefy-green cursor-pointer"
                    : "bg-muted border-2 border-transparent hover:bg-muted/80 cursor-pointer active:scale-[0.99]"
              )}
            >
              <Checkbox
                checked={isSelected || isMowing}
                disabled={isMowing}
                className={cn(
                  "h-5 w-5",
                  isMowing && "opacity-100 data-[state=checked]:bg-beefy-green"
                )}
              />
              <span className="text-xl lg:text-2xl">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm lg:text-base text-foreground">
                  {service.name}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground truncate">
                  {service.description}
                </div>
              </div>
              {isMowing ? (
                <Badge
                  variant="secondary"
                  className="bg-beefy-green text-white text-[10px] lg:text-xs"
                >
                  INCLUDED
                </Badge>
              ) : (
                service.priceLabel && (
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground text-[10px] lg:text-xs"
                  >
                    {service.priceLabel}
                  </Badge>
                )
              )}
            </div>

            {/* Dog Size Selector */}
            {service.id === "dogcleanup" && isDogCleanupSelected && onDogSizeChange && (
              <div className="ml-10 lg:ml-14 mt-2">
                <DogSizeSelector value={dogSize} onChange={onDogSizeChange} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
