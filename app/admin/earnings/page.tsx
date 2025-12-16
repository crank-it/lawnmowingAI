"use client";

import { useState, useEffect } from "react";
import { EarningsGrid } from "@/components/admin/earnings-grid";
import { getEarningsStats } from "@/lib/supabase/queries";

interface EarningsData {
  today: { earned: number; target: number; jobs: number };
  week: { earned: number; jobs: number };
  month: { earned: number; jobs: number };
  allTime: { earned: number; since: Date };
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData>({
    today: { earned: 0, target: 300, jobs: 0 },
    week: { earned: 0, jobs: 0 },
    month: { earned: 0, jobs: 0 },
    allTime: { earned: 0, since: new Date() },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const stats = await getEarningsStats();
        setEarnings({
          today: { earned: stats.today, target: 300, jobs: 2 },
          week: { earned: stats.week, jobs: stats.jobCount },
          month: { earned: stats.month, jobs: stats.jobCount },
          allTime: { earned: stats.allTime, since: new Date("2025-01-01") },
        });
      } catch (error) {
        console.error("Failed to fetch earnings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  // Recent payments from completed jobs
  const recentPayments = [
    {
      id: "1",
      customer: "Sarah Mitchell",
      amount: 85,
      date: new Date(),
      method: "Cash",
    },
    {
      id: "2",
      customer: "Dave Thompson",
      amount: 95,
      date: new Date(),
      method: "Bank Transfer",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">
          {isLoading ? "Loading..." : "Track your income and payments"}
        </p>
      </div>

      {/* Earnings Grid */}
      <EarningsGrid earnings={earnings} recentPayments={recentPayments} />
    </div>
  );
}
