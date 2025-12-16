"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EarningsData {
  today: { earned: number; target: number; jobs: number };
  week: { earned: number; jobs: number };
  month: { earned: number; jobs: number };
  allTime: { earned: number; since: Date };
}

interface Payment {
  id: string;
  customer: string;
  amount: number;
  date: Date;
  method: string;
}

interface EarningsGridProps {
  earnings: EarningsData;
  recentPayments: Payment[];
  className?: string;
}

export function EarningsGrid({
  earnings,
  recentPayments,
  className,
}: EarningsGridProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-primary">
              ${earnings.today.earned}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              of ${earnings.today.target} target
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-beefy-green-light">
              ${earnings.week.earned}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {earnings.week.jobs} jobs completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-emerald-400">
              ${earnings.month.earned}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {earnings.month.jobs} jobs completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              All Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-3xl font-bold text-teal-400">
              ${earnings.allTime.earned.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              since{" "}
              {new Date(earnings.allTime.since).toLocaleDateString("en-NZ", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card className="bg-card border-border rounded-2xl">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayments.map((payment, index) => (
              <div key={payment.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString("en-NZ", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      • {payment.method}
                    </p>
                  </div>
                  <span className="font-mono text-lg font-bold text-primary">
                    +${payment.amount}
                  </span>
                </div>
                {index < recentPayments.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
