import Image from "next/image";
import { cn } from "@/lib/utils";

interface BeefyLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  className?: string;
}

const sizeConfig = {
  sm: { width: 100, height: 78 },   // For tight spaces
  md: { width: 140, height: 109 },  // Standard
  lg: { width: 200, height: 156 },  // Header
  xl: { width: 280, height: 218 },  // Large displays
};

export function BeefyLogo({
  size = "md",
  variant = "light",
  className,
}: BeefyLogoProps) {
  const { width, height } = sizeConfig[size];

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="LawnMowing.ai"
        width={width}
        height={height}
        className={cn(
          "object-contain",
          variant === "dark" && "brightness-110"
        )}
        priority
      />
    </div>
  );
}
