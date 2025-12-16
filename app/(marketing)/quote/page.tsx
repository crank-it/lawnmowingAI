"use client";

import { Suspense } from "react";
import { QuoteContent } from "./quote-content";
import { Skeleton } from "@/components/ui/skeleton";

function QuoteLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-2 rounded-xl" />
          <Skeleton className="h-5 w-48 mx-auto rounded-xl" />
        </div>
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
          <Skeleton className="h-[500px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<QuoteLoading />}>
      <QuoteContent />
    </Suspense>
  );
}
