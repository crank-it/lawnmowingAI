"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  className?: string;
}

const statusColors = {
  next: "bg-orange-500",
  scheduled: "bg-muted",
  in_progress: "bg-blue-500",
  completed: "bg-beefy-green-light",
  cancelled: "bg-red-500",
};

export function JobCard({ job, onClick, className }: JobCardProps) {
  const statusColor = statusColors[job.status] || "bg-muted";

  return (
    <Card
      onClick={onClick}
      className={cn(
        "bg-card border-border rounded-2xl p-3 lg:p-4 cursor-pointer transition-all",
        "hover:bg-secondary/50 hover:border-primary/30 active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start lg:items-center gap-3 lg:gap-4">
        {/* Route Number */}
        <div
          className={cn(
            "h-10 w-10 lg:h-12 lg:w-12 rounded-xl flex-shrink-0 flex items-center justify-center",
            "font-mono text-lg lg:text-xl font-bold text-white",
            statusColor
          )}
        >
          {job.routeOrder}
        </div>

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
            <h3 className="font-semibold text-sm lg:text-base text-foreground truncate">
              {job.customer}
            </h3>
            {job.isNew && <StatusBadge status="new" />}
          </div>
          <p className="text-xs lg:text-sm text-muted-foreground truncate">
            {job.address}
          </p>

          {/* Services - Hidden on mobile, shown inline on desktop */}
          <div className="hidden lg:flex flex-wrap gap-1.5 mt-2">
            {job.services.map((service) => (
              <span
                key={service}
                className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Status */}
        <div className="text-right flex-shrink-0">
          <p className="font-mono text-lg lg:text-xl font-bold text-primary">
            ${job.price}
          </p>
          <p className="text-xs lg:text-sm text-muted-foreground mb-1 lg:mb-2">
            {job.scheduledTime}
          </p>
          <StatusBadge
            status={
              job.status === "next"
                ? "next"
                : job.status === "completed"
                  ? "done"
                  : "scheduled"
            }
          />
        </div>
      </div>

      {/* Services - Mobile only, shown below */}
      <div className="flex flex-wrap gap-1.5 mt-2 lg:hidden">
        {job.services.map((service) => (
          <span
            key={service}
            className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full"
          >
            {service}
          </span>
        ))}
      </div>
    </Card>
  );
}
