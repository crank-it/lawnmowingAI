import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Status = "next" | "scheduled" | "done" | "new" | "confirmed" | "pending";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; className: string }
> = {
  next: {
    label: "UP NEXT",
    className: "bg-orange-500 text-white border-orange-500",
  },
  scheduled: {
    label: "SCHEDULED",
    className: "bg-muted text-muted-foreground border-muted",
  },
  done: {
    label: "DONE",
    className: "bg-beefy-green-light text-white border-beefy-green-light",
  },
  new: {
    label: "NEW",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  confirmed: {
    label: "CONFIRMED",
    className: "bg-beefy-green-light/20 text-beefy-green-light border-beefy-green-light/30",
  },
  pending: {
    label: "PENDING",
    className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-semibold uppercase tracking-wide px-2 py-0.5",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
