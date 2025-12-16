"use client";

import { cn } from "@/lib/utils";
import { Job } from "@/types/job";

interface RouteProgressProps {
  jobs: Job[];
  className?: string;
}

export function RouteProgress({ jobs, className }: RouteProgressProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {jobs.map((job, index) => {
        const isCompleted = job.status === "completed";
        const isCurrent = job.status === "next" || job.status === "in_progress";
        const isLast = index === jobs.length - 1;

        return (
          <div key={job.id} className="flex items-center">
            {/* Dot */}
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                isCompleted && "bg-beefy-green-light text-white",
                isCurrent && "bg-orange-500 text-white ring-4 ring-orange-500/30",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? "✓" : job.routeOrder}
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 w-8 mx-1",
                  isCompleted ? "bg-beefy-green-light" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
