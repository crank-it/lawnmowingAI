import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ServicesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <Skeleton className="h-10 lg:h-14 w-48 mx-auto mb-3 lg:mb-4" />
        <Skeleton className="h-5 lg:h-6 w-80 max-w-full mx-auto" />
      </div>

      {/* Service Cards Grid */}
      <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-0 bg-card rounded-2xl shadow-beefy-sm overflow-hidden">
            {/* Icon Header */}
            <div className="bg-muted p-6 lg:p-8 text-center">
              <Skeleton className="h-16 w-16 mx-auto rounded-full" />
            </div>

            {/* Content */}
            <div className="p-4 lg:p-6">
              <Skeleton className="h-6 lg:h-7 w-36 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
