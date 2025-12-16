"use client";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/types/job";

interface JobDetailSheetProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkComplete?: (jobId: string) => void;
}

export function JobDetailSheet({
  job,
  isOpen,
  onClose,
  onMarkComplete,
}: JobDetailSheetProps) {
  if (!job) return null;

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete(job.id);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] bg-card border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-xl">Job Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <Card className="bg-secondary border-0 rounded-xl">
            <CardContent className="p-4">
              <h3 className="font-heading text-lg font-semibold mb-2">
                {job.customer}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>📍</span>
                  <span className="text-muted-foreground">{job.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span className="text-muted-foreground">
                    {job.scheduledTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="bg-secondary border-0 rounded-xl">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.services.map((service) => (
                  <Badge
                    key={service}
                    variant="secondary"
                    className="bg-primary/20 text-primary"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Property Info */}
          <Card className="bg-secondary border-0 rounded-xl">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Property Info
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Lawn Size</p>
                  <p className="font-mono font-semibold">{job.lawnSize}m²</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="font-mono font-semibold">
                    {job.lastVisit
                      ? new Date(job.lastVisit).toLocaleDateString("en-NZ", {
                          day: "numeric",
                          month: "short",
                        })
                      : "First visit"}
                  </p>
                </div>
                {job.dogSize && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Dog Size</p>
                    <p className="font-semibold capitalize">
                      🐕 {job.dogSize} dog
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {job.notes && (
            <Card className="bg-secondary border-0 rounded-xl">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Notes
                </h4>
                <p className="text-sm">{job.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Price */}
          <div className="bg-gradient-to-br from-beefy-green to-beefy-green-light rounded-xl p-4 text-center text-white">
            <p className="text-sm opacity-90 mb-1">Job Price</p>
            <p className="font-mono text-3xl font-bold">${job.price}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {job.status !== "completed" && (
              <Button
                onClick={handleMarkComplete}
                className={cn(
                  "w-full bg-gradient-to-br from-beefy-green to-beefy-green-light",
                  "text-white font-heading font-semibold rounded-xl py-6",
                  "transition-all hover:-translate-y-0.5 hover:shadow-lg"
                )}
              >
                ✓ Mark as Complete
              </Button>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                className="rounded-xl flex flex-col h-auto py-3"
              >
                <span className="text-lg mb-1">📞</span>
                <span className="text-xs">Call</span>
              </Button>
              <Button
                variant="secondary"
                className="rounded-xl flex flex-col h-auto py-3"
              >
                <span className="text-lg mb-1">💬</span>
                <span className="text-xs">Message</span>
              </Button>
              <Button
                variant="secondary"
                className="rounded-xl flex flex-col h-auto py-3"
              >
                <span className="text-lg mb-1">🗺️</span>
                <span className="text-xs">Navigate</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
