export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number; // base price per visit
  priceLabel?: string;
  isAddon: boolean;
  requiresSize?: boolean; // for dog cleanup
}

export const services: Service[] = [
  {
    id: "mowing",
    name: "Lawn Mowing",
    description: "Full lawn cut with clippings collected",
    icon: "🌿",
    basePrice: 40,
    isAddon: false,
  },
  {
    id: "edging",
    name: "Edging",
    description: "Clean edges along paths and gardens",
    icon: "✂️",
    basePrice: 15,
    priceLabel: "+$15",
    isAddon: true,
  },
  {
    id: "hedges",
    name: "Hedge Trimming",
    description: "Keep your hedges neat and tidy",
    icon: "🌳",
    basePrice: 25,
    priceLabel: "From $25",
    isAddon: true,
  },
  {
    id: "weedspray",
    name: "Weed Spray",
    description: "Target weeds in lawn and paths",
    icon: "🧪",
    basePrice: 20,
    priceLabel: "+$20",
    isAddon: true,
  },
  {
    id: "dogcleanup",
    name: "Dog Cleanup",
    description: "Pre-mow cleanup of dog waste",
    icon: "🐕",
    basePrice: 10,
    priceLabel: "From $10",
    isAddon: true,
    requiresSize: true,
  },
  {
    id: "leaves",
    name: "Leaf Cleanup",
    description: "Seasonal leaf removal",
    icon: "🍂",
    basePrice: 20,
    priceLabel: "+$20",
    isAddon: true,
  },
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find((s) => s.id === id);
};

export const getServicesByIds = (ids: string[]): Service[] => {
  return services.filter((s) => ids.includes(s.id));
};
