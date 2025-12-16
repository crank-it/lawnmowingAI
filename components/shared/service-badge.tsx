import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ServiceBadgeProps {
  service: {
    id: string;
    name: string;
    icon: string;
  };
  variant?: "default" | "selected" | "compact";
  className?: string;
}

export function ServiceBadge({
  service,
  variant = "default",
  className,
}: ServiceBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium",
        variant === "default" &&
          "bg-secondary text-secondary-foreground px-3 py-1.5 text-sm rounded-full",
        variant === "selected" &&
          "bg-secondary border-2 border-beefy-green text-beefy-green px-3 py-1.5 text-sm rounded-full",
        variant === "compact" &&
          "bg-primary/20 text-primary px-2 py-1 text-xs rounded-full",
        className
      )}
    >
      <span className="mr-1.5">{service.icon}</span>
      {service.name}
    </Badge>
  );
}
