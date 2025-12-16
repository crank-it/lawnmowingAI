import { PropertyData } from "./property";

export type Frequency = "weekly" | "fortnightly" | "monthly";
export type DogSize = "small" | "medium" | "large";

export interface QuoteRequest {
  name: string;
  phone: string;
  email?: string;
  address: string;
  services: string[];
  frequency: Frequency;
  dogSize?: DogSize;
  notes?: string;
}

export interface Quote {
  id: string;
  address: string;
  suburb: string;
  services: string[];
  frequency: Frequency;
  priceMin: number;
  priceMax: number;
  propertyData: PropertyData;
  dogSize?: DogSize;
  createdAt: Date;
}

export interface Booking {
  id: string;
  quoteId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  suburb: string;
  services: string[];
  frequency: Frequency;
  preferredStartDate?: Date;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}
