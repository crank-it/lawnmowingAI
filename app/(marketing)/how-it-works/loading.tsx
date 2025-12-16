import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HowItWorksLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <Skeleton className="h-10 lg:h-14 w-56 mx-auto mb-3 lg:mb-4" />
        <Skeleton className="h-5 lg:h-6 w-72 max-w-full mx-auto" />
      </div>

      {/* Steps Timeline */}
      <div className="max-w-3xl mx-auto mb-12 lg:mb-16">
        <div className="space-y-6 lg:space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 lg:gap-6">
              {/* Step Number */}
              <div className="flex-shrink-0">
                <Skeleton className="h-12 w-12 lg:h-14 lg:w-14 rounded-full" />
              </div>

              {/* Content */}
              <Card className="flex-1 border-0 bg-card rounded-2xl shadow-beefy-sm p-4 lg:p-6">
                <Skeleton className="h-6 lg:h-7 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-8 w-56 mx-auto mb-6 lg:mb-8" />
        <div className="space-y-3 lg:space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 bg-card rounded-2xl shadow-beefy-sm p-4 lg:p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-64 max-w-[80%]" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
