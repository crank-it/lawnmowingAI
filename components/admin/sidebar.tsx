"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SidebarProps {
  todayEarnings: number;
  todayTarget: number;
  weekStats: {
    jobsDone: number;
    earned: number;
    monthTotal: number;
  };
}

const navItems = [
  { href: "/admin", label: "Today's Jobs", icon: "📋", count: 5 },
  { href: "/admin/customers", label: "Customers", icon: "👥", count: 12 },
  { href: "/admin/schedule", label: "This Week", icon: "📅" },
  { href: "/admin/earnings", label: "Earnings", icon: "💰" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar({ todayEarnings, todayTarget, weekStats }: SidebarProps) {
  const pathname = usePathname();
  const earningsProgress = Math.min((todayEarnings / todayTarget) * 100, 100);

  return (
    <aside className="w-64 bg-card border-r border-border p-4 flex flex-col h-[calc(100vh-73px)]">
      {/* Today's Earnings */}
      <div className="bg-secondary rounded-xl p-4 mb-6" data-tour="earnings">
        <p className="text-sm text-muted-foreground mb-1">Today&apos;s Earnings</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-mono text-3xl font-bold text-primary">
            ${todayEarnings}
          </span>
          <span className="text-sm text-muted-foreground">of ${todayTarget}</span>
        </div>
        <Progress value={earningsProgress} className="h-2" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1" data-tour="nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                isActive
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.count && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    isActive ? "bg-primary text-primary-foreground" : "bg-secondary"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Week Summary */}
      <div className="bg-secondary rounded-xl p-4 mt-4" data-tour="week-summary">
        <p className="text-sm font-medium text-foreground mb-3">This Week</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jobs done</span>
            <span className="font-mono font-semibold">{weekStats.jobsDone}</span>
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
    </aside>
  );
}
