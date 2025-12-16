import { Frequency, DogSize } from "./quote";
import { PropertyData } from "./property";

export type CustomerStatus = "active" | "paused" | "inactive";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  suburb: string;
  frequency: Frequency;
  rate: number; // per visit
  services: string[];
  propertyData?: PropertyData;
  dogSize?: DogSize;
  since: Date;
  nextVisit?: Date;
  lastVisit?: Date;
  totalVisits: number;
  totalSpent: number;
  notes?: string;
  status: CustomerStatus;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  averageRate: number;
}
