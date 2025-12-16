import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: string;
  color?: "green" | "green-light" | "orange" | "default";
  className?: string;
}

const colorClasses = {
  green: "text-beefy-green",
  "green-light": "text-beefy-green-light",
  orange: "text-orange-500",
  default: "text-primary",
};

export function StatsCard({
  label,
  value,
  subtitle,
  icon,
  color = "default",
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("bg-card border-border rounded-2xl", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("font-mono text-3xl font-bold", colorClasses[color])}>
          {value}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
