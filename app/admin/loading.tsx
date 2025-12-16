import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminLoading() {
  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <Skeleton className="h-8 lg:h-10 w-40 mb-2" />
          <Skeleton className="h-5 w-56" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-xl" />
      </div>

      {/* Route Progress - Desktop only */}
      <div className="hidden sm:block mb-6 lg:mb-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <Skeleton className="h-8 lg:h-10 w-8 lg:w-10 rounded-full mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Mobile Progress */}
      <div className="sm:hidden mb-4">
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Job Cards */}
      <div className="space-y-3 lg:space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-card border-border rounded-2xl p-3 lg:p-4">
            <div className="flex items-start lg:items-center gap-3 lg:gap-4">
              {/* Route Number */}
              <Skeleton className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl flex-shrink-0" />

              {/* Customer Info */}
              <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-36 mb-1" />
                <Skeleton className="h-4 w-48" />
                {/* Desktop Services */}
                <div className="hidden lg:flex flex-wrap gap-1.5 mt-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-16 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Price & Status */}
              <div className="text-right flex-shrink-0">
                <Skeleton className="h-6 lg:h-7 w-14 mb-1 ml-auto" />
                <Skeleton className="h-4 w-16 mb-1 lg:mb-2 ml-auto" />
                <Skeleton className="h-5 w-20 rounded-full ml-auto" />
              </div>
            </div>

            {/* Mobile Services */}
            <div className="flex flex-wrap gap-1.5 mt-2 lg:hidden">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-5 w-16 rounded-full" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
