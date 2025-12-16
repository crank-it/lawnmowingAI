import { PropertyData, GradientLevel, AccessDifficulty } from "@/types/property";
import { Frequency, DogSize } from "@/types/quote";
import { services, getServiceById } from "./services";
import { getSuburbByName } from "./suburbs";

// Size multipliers based on lawn area
const SIZE_MULTIPLIERS: Record<string, number> = {
  small: 1.0, // < 150m²
  medium: 1.3, // 150-300m²
  large: 1.6, // 300-500m²
  xlarge: 2.0, // > 500m²
};

// Gradient multipliers
const GRADIENT_MULTIPLIERS: Record<GradientLevel, number> = {
  Flat: 1.0,
  "Gentle slope": 1.1,
  "Moderate slope": 1.2,
  Steep: 1.4,
};

// Access difficulty multipliers
const ACCESS_MULTIPLIERS: Record<AccessDifficulty, number> = {
  Easy: 1.0,
  Standard: 1.05,
  Tricky: 1.15,
};

// Frequency discounts
const FREQUENCY_DISCOUNTS: Record<Frequency, number> = {
  weekly: 0.15, // 15% discount
  fortnightly: 0.1, // 10% discount
  monthly: 0.0, // no discount
};

// Dog cleanup pricing by size
const DOG_CLEANUP_PRICING: Record<DogSize, number> = {
  small: 10,
  medium: 15,
  large: 20,
};

function getSizeCategory(lawnArea: number): string {
  if (lawnArea < 150) return "small";
  if (lawnArea < 300) return "medium";
  if (lawnArea < 500) return "large";
  return "xlarge";
}

export interface PriceBreakdown {
  basePrice: number;
  sizeAdjustment: number;
  gradientAdjustment: number;
  accessAdjustment: number;
  travelAdjustment: number;
  servicesTotal: number;
  subtotal: number;
  frequencyDiscount: number;
  finalPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export function calculatePrice(
  propertyData: PropertyData,
  selectedServices: string[],
  frequency: Frequency,
  suburb?: string,
  dogSize?: DogSize
): PriceBreakdown {
  // Get base mowing price
  const mowingService = getServiceById("mowing");
  const basePrice = mowingService?.basePrice ?? 40;

  // Calculate size multiplier
  const sizeCategory = getSizeCategory(propertyData.lawnArea);
  const sizeMultiplier = SIZE_MULTIPLIERS[sizeCategory];
  const sizeAdjustment = basePrice * (sizeMultiplier - 1);

  // Calculate gradient multiplier
  const gradientMultiplier = GRADIENT_MULTIPLIERS[propertyData.gradient];
  const gradientAdjustment = basePrice * (gradientMultiplier - 1);

  // Calculate access multiplier
  const accessMultiplier = ACCESS_MULTIPLIERS[propertyData.accessDifficulty];
  const accessAdjustment = basePrice * (accessMultiplier - 1);

  // Calculate travel adjustment based on suburb
  let travelMultiplier = 1.0;
  if (suburb) {
    const suburbData = getSuburbByName(suburb);
    if (suburbData) {
      travelMultiplier = suburbData.travelMultiplier;
    }
  }
  const travelAdjustment = basePrice * (travelMultiplier - 1);

  // Calculate add-on services
  let servicesTotal = 0;
  for (const serviceId of selectedServices) {
    if (serviceId === "mowing") continue; // already counted in base

    const service = getServiceById(serviceId);
    if (!service) continue;

    if (serviceId === "dogcleanup" && dogSize) {
      servicesTotal += DOG_CLEANUP_PRICING[dogSize];
    } else if (serviceId === "hedges") {
      // Hedge pricing based on estimated length
      const hedgePrice = Math.max(25, propertyData.hedgeLength * 2);
      servicesTotal += hedgePrice;
    } else if (serviceId === "edging") {
      // Edging based on estimated length
      const edgingPrice = Math.max(15, propertyData.estimatedEdging * 0.5);
      servicesTotal += edgingPrice;
    } else {
      servicesTotal += service.basePrice;
    }
  }

  // Calculate subtotal before discount
  const subtotal =
    basePrice +
    sizeAdjustment +
    gradientAdjustment +
    accessAdjustment +
    travelAdjustment +
    servicesTotal;

  // Apply frequency discount
  const discount = FREQUENCY_DISCOUNTS[frequency];
  const frequencyDiscount = subtotal * discount;
  const finalPrice = Math.round(subtotal - frequencyDiscount);

  // Calculate price range (±10%)
  const priceRange = {
    min: Math.round(finalPrice * 0.9),
    max: Math.round(finalPrice * 1.1),
  };

  return {
    basePrice,
    sizeAdjustment: Math.round(sizeAdjustment),
    gradientAdjustment: Math.round(gradientAdjustment),
    accessAdjustment: Math.round(accessAdjustment),
    travelAdjustment: Math.round(travelAdjustment),
    servicesTotal: Math.round(servicesTotal),
    subtotal: Math.round(subtotal),
    frequencyDiscount: Math.round(frequencyDiscount),
    finalPrice,
    priceRange,
  };
}

export function getFrequencyLabel(frequency: Frequency): string {
  const labels: Record<Frequency, string> = {
    weekly: "Weekly",
    fortnightly: "Fortnightly",
    monthly: "Monthly",
  };
  return labels[frequency];
}

export function getFrequencyDiscount(frequency: Frequency): string {
  const discounts: Record<Frequency, string> = {
    weekly: "15% off",
    fortnightly: "10% off",
    monthly: "",
  };
  return discounts[frequency];
}
