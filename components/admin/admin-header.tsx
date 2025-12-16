"use client";

import Link from "next/link";
import { BeefyLogo } from "@/components/shared/beefy-logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/stores/tour-store";

interface AdminHeaderProps {
  weather?: {
    temp: number;
    condition: string;
    emoji: string;
  };
}

export function AdminHeader({ weather }: AdminHeaderProps) {
  const defaultWeather = weather || { temp: 14, condition: "Cloudy", emoji: "⛅" };
  const { startTour, resetTour } = useTourStore();

  const handleRestartTour = () => {
    resetTour();
    startTour();
  };

  return (
    <header className="h-[73px] bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Logo */}
      <Link href="/admin">
        <BeefyLogo size="md" variant="dark" />
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Tour Restart Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRestartTour}
          className="h-9 w-9 hover:bg-secondary"
          title="Restart guided tour"
          data-tour="restart-tour"
        >
          <span className="text-xl">🎓</span>
        </Button>

        {/* Weather */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">{defaultWeather.emoji}</span>
          <div>
            <p className="font-mono font-semibold">{defaultWeather.temp}°C</p>
            <p className="text-xs text-muted-foreground">{defaultWeather.condition}</p>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              W
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">William</p>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
