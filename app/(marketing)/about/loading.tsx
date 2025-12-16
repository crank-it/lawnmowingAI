import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <Skeleton className="h-10 lg:h-14 w-48 mx-auto mb-3 lg:mb-4" />
        <Skeleton className="h-5 lg:h-6 w-64 max-w-full mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-md mb-8 lg:mb-12 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Photo Placeholder */}
            <div className="bg-muted p-8 lg:p-12 flex items-center justify-center">
              <Skeleton className="h-48 w-48 lg:h-64 lg:w-64 rounded-full" />
            </div>

            {/* Bio */}
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <Skeleton className="h-8 w-36 mb-3" />
              <Skeleton className="h-5 w-24 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Card>

        {/* Values Grid */}
        <div className="mb-8 lg:mb-12">
          <Skeleton className="h-8 w-36 mx-auto mb-6 lg:mb-8" />
          <div className="grid gap-4 lg:gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 bg-card rounded-2xl shadow-beefy-sm p-5 lg:p-6 text-center">
                <Skeleton className="h-12 w-12 mx-auto mb-3 rounded-full" />
                <Skeleton className="h-6 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-0 bg-card rounded-2xl shadow-beefy-sm p-4 lg:p-6 text-center">
              <Skeleton className="h-10 lg:h-12 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
