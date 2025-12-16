"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/admin/job-card";
import { RouteProgress } from "@/components/admin/route-progress";
import { JobDetailSheet } from "@/components/admin/job-detail-sheet";
import { getTodaysJobs, updateJobStatus } from "@/lib/supabase/queries";
import { Job } from "@/types/job";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch jobs on mount
  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getTodaysJobs();
        // Transform Supabase data to Job type
        const transformedJobs: Job[] = data.map((job) => ({
          id: job.id,
          customerId: job.customer_id || "",
          customer: job.beefy_customers?.name || "Unknown",
          address: job.beefy_customers?.address || "",
          suburb: "",
          scheduledDate: new Date(job.scheduled_date),
          scheduledTime: job.scheduled_time || "",
          services: Array.isArray(job.services) ? (job.services as string[]) : [],
          price: job.price,
          status: job.status || "scheduled",
          notes: job.notes || "",
          lawnSize: 400, // Default
          routeOrder: job.route_order || 1,
          isNew: false,
        }));
        setJobs(transformedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const completedCount = jobs.filter((j) => j.status === "completed").length;
  const today = new Date().toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsSheetOpen(true);
  };

  const handleMarkComplete = async (jobId: string) => {
    try {
      await updateJobStatus(jobId, "completed");

      setJobs((prev) => {
        const newJobs = prev.map((job, index) => {
          if (job.id === jobId) {
            return { ...job, status: "completed" as const };
          }
          return job;
        });

        // Find the next scheduled job and mark it as "next"
        const completedIndex = newJobs.findIndex((j) => j.id === jobId);
        const nextScheduled = newJobs.find(
          (j, i) => i > completedIndex && j.status === "scheduled"
        );
        if (nextScheduled) {
          return newJobs.map((j) =>
            j.id === nextScheduled.id ? { ...j, status: "next" as const } : j
          );
        }
        return newJobs;
      });
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div data-tour="route-header">
          <h1 className="font-heading text-xl lg:text-2xl font-bold">
            Today&apos;s Route
          </h1>
          <p className="text-sm text-muted-foreground">
            {today} • {jobs.length} jobs • {completedCount} done
          </p>
        </div>
        <div className="flex gap-2" data-tour="action-buttons">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl flex-1 sm:flex-none"
          >
            🗺️ Map
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-br from-beefy-green to-beefy-green-light text-white rounded-xl flex-1 sm:flex-none"
          >
            🧭 Navigate
          </Button>
        </div>
      </div>

      {/* Route Progress - Hidden on mobile, shown on larger screens */}
      <div className="hidden sm:block">
        <RouteProgress jobs={jobs} />
      </div>

      {/* Mobile Progress Indicator */}
      <div className="sm:hidden bg-secondary rounded-xl p-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Progress</span>
        <span className="font-mono font-semibold text-primary">
          {completedCount}/{jobs.length} done
        </span>
      </div>

      {/* Job Cards */}
      <div className="space-y-3" data-tour="job-cards">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No jobs scheduled for today
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
          ))
        )}
      </div>

      {/* Job Detail Sheet */}
      <JobDetailSheet
        job={selectedJob}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onMarkComplete={handleMarkComplete}
      />
    </div>
  );
}
