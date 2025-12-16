import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CustomersLoading() {
  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <Skeleton className="h-8 lg:h-10 w-36 mb-2" />
          <Skeleton className="h-5 w-44" />
        </div>
        <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
      </div>

      {/* Customer Table Card */}
      <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-5 gap-4 p-4 bg-muted/50 border-b">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4">
              {/* Desktop Row */}
              <div className="hidden lg:grid grid-cols-5 gap-4 items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Mobile Row */}
              <div className="lg:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
