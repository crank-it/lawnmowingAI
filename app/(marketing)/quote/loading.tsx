import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function QuoteLoading() {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <Skeleton className="h-9 lg:h-12 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-56 mx-auto" />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4 lg:space-y-6">
            {/* Property Analysis Card Skeleton */}
            <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
              <CardHeader className="pb-3 lg:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 lg:gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-muted rounded-xl p-2 lg:p-3 text-center">
                      <Skeleton className="h-6 lg:h-8 w-6 lg:w-8 mx-auto mb-1" />
                      <Skeleton className="h-4 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-14 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Selection Skeleton */}
            <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
              <CardHeader className="pb-3 lg:pb-4">
                <Skeleton className="h-6 w-56 mb-2" />
                <Skeleton className="h-4 w-72" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 lg:space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl bg-muted"
                    >
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quote Summary Skeleton */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-0 bg-card rounded-2xl shadow-beefy-md">
              <CardHeader className="pb-3 lg:pb-4">
                <Skeleton className="h-6 w-28" />
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                {/* Frequency Picker */}
                <div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>

                {/* Price Display */}
                <div className="bg-gradient-to-br from-beefy-green to-beefy-green-light rounded-xl p-4 lg:p-6 text-center">
                  <Skeleton className="h-4 w-36 mx-auto mb-2 bg-white/20" />
                  <Skeleton className="h-10 lg:h-12 w-40 mx-auto bg-white/30" />
                </div>

                {/* Selected Services */}
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-24 rounded-full" />
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Skeleton className="h-14 lg:h-16 w-full rounded-xl" />

                {/* Trust Badges */}
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
