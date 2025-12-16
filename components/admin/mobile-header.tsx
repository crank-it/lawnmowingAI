"use client";

import { useState } from "react";
import Link from "next/link";
import { BeefyLogo } from "@/components/shared/beefy-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { useTourStore } from "@/stores/tour-store";

interface MobileHeaderProps {
  todayEarnings: number;
  todayTarget: number;
  weekStats: {
    jobsDone: number;
    earned: number;
    monthTotal: number;
  };
}

export function MobileHeader({
  todayEarnings,
  todayTarget,
  weekStats,
}: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const earningsProgress = Math.min((todayEarnings / todayTarget) * 100, 100);
  const { startTour, resetTour } = useTourStore();

  const handleRestartTour = () => {
    setIsOpen(false);
    resetTour();
    startTour();
  };

  return (
    <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between lg:hidden">
      <Link href="/admin">
        <BeefyLogo size="sm" variant="dark" />
      </Link>

      <div className="flex items-center gap-3">
        {/* Quick Earnings Display */}
        <div className="text-right">
          <p className="font-mono text-sm font-bold text-primary">
            ${todayEarnings}
          </p>
          <p className="text-[10px] text-muted-foreground">today</p>
        </div>

        {/* Menu Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <span className="text-xl">☰</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-card border-border">
            <div className="py-4 space-y-6">
              {/* Today's Earnings */}
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Today&apos;s Earnings
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-mono text-2xl font-bold text-primary">
                    ${todayEarnings}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    of ${todayTarget}
                  </span>
                </div>
                <Progress value={earningsProgress} className="h-2" />
              </div>

              {/* Week Summary */}
              <div className="bg-secondary rounded-xl p-4">
                <p className="text-sm font-medium text-foreground mb-3">
                  This Week
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs done</span>
                    <span className="font-mono font-semibold">
                      {weekStats.jobsDone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Earned</span>
                    <span className="font-mono font-semibold text-primary">
                      ${weekStats.earned}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Month total</span>
                    <span className="font-mono font-semibold text-primary">
                      ${weekStats.monthTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  W
                </div>
                <div>
                  <p className="font-medium">William</p>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>

              {/* Tour Restart Button */}
              <Button
                variant="outline"
                onClick={handleRestartTour}
                className="w-full justify-start gap-3"
                data-tour="restart-tour"
              >
                <span className="text-xl">🎓</span>
                <span>Restart Guided Tour</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
