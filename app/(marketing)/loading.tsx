import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function MarketingLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-20">
      {/* Hero Section Skeleton */}
      <section className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
        {/* Badge */}
        <Skeleton className="h-8 w-56 mx-auto mb-4 lg:mb-6 rounded-full" />

        {/* Title */}
        <Skeleton className="h-10 lg:h-16 w-full max-w-lg mx-auto mb-3" />
        <Skeleton className="h-10 lg:h-16 w-3/4 max-w-md mx-auto mb-4 lg:mb-6" />

        {/* Subtitle */}
        <Skeleton className="h-5 w-full max-w-xl mx-auto mb-2" />
        <Skeleton className="h-5 w-2/3 max-w-md mx-auto mb-6 lg:mb-10" />

        {/* Address Input */}
        <Skeleton className="h-16 lg:h-20 w-full max-w-2xl mx-auto rounded-2xl mb-4" />

        {/* Suburb Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </section>

      {/* Features Grid Skeleton */}
      <section className="mb-12 lg:mb-20">
        <Skeleton className="h-8 w-64 mx-auto mb-6 lg:mb-10" />
        <div className="grid gap-4 lg:gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 bg-card rounded-2xl shadow-beefy-sm">
              <div className="p-4 lg:p-6 text-center">
                <Skeleton className="h-12 w-12 mx-auto mb-3 lg:mb-4 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Skeleton */}
      <section className="mb-12 lg:mb-20">
        <Skeleton className="h-8 w-40 mx-auto mb-6 lg:mb-8" />
        <div className="flex flex-wrap justify-center gap-2 lg:gap-3 max-w-3xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 lg:w-36 rounded-full" />
          ))}
        </div>
      </section>

      {/* How It Works Skeleton */}
      <section className="mb-12 lg:mb-20">
        <Skeleton className="h-8 w-44 mx-auto mb-6 lg:mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-14 w-14 lg:h-16 lg:w-16 mx-auto mb-3 lg:mb-4 rounded-full" />
              <Skeleton className="h-5 w-24 mx-auto mb-1" />
              <Skeleton className="h-4 w-28 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* About Skeleton */}
      <section className="max-w-3xl mx-auto">
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-md p-5 lg:p-8">
          <Skeleton className="h-12 w-12 mx-auto mb-3 lg:mb-4 rounded-full" />
          <Skeleton className="h-7 w-36 mx-auto mb-3 lg:mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </Card>
      </section>
    </div>
  );
}
