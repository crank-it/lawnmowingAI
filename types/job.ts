import { DogSize } from "./quote";

export type JobStatus = "next" | "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Job {
  id: string;
  customerId: string;
  customer: string;
  address: string;
  suburb: string;
  scheduledDate: Date;
  scheduledTime: string;
  services: string[];
  price: number;
  status: JobStatus;
  notes: string;
  lawnSize: number; // m²
  lastVisit?: Date;
  routeOrder: number;
  isNew?: boolean;
  dogSize?: DogSize;
  completedAt?: Date;
  duration?: number; // minutes
}

export interface DailyRoute {
  date: Date;
  jobs: Job[];
  totalJobs: number;
  completedJobs: number;
  totalEarnings: number;
  estimatedDuration: number; // minutes
}
