import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function EarningsLoading() {
  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <Skeleton className="h-8 lg:h-10 w-32 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 bg-card rounded-2xl shadow-beefy-sm p-4 lg:p-6">
            <div className="flex items-start justify-between mb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 lg:h-10 w-24 mb-1" />
            <Skeleton className="h-4 w-20" />
          </Card>
        ))}
      </div>

      {/* Recent Payments */}
      <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
        <div className="p-4 lg:p-6 border-b border-border">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 lg:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <Skeleton className="h-10 w-10 lg:h-12 lg:w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-6 w-16 mb-1 ml-auto" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
