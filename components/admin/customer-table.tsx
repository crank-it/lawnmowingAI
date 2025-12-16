"use client";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
  onRowClick?: (customer: Customer) => void;
  className?: string;
}

const frequencyColors = {
  weekly: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  fortnightly: "bg-green-500/20 text-green-400 border-green-500/30",
  monthly: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export function CustomerTable({
  customers,
  onRowClick,
  className,
}: CustomerTableProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    if (isToday) {
      return <span className="text-primary font-semibold">Today</span>;
    }

    return d.toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className={cn("rounded-xl border border-border overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Address</TableHead>
            <TableHead className="font-semibold">Frequency</TableHead>
            <TableHead className="font-semibold text-right">Rate</TableHead>
            <TableHead className="font-semibold">Since</TableHead>
            <TableHead className="font-semibold">Next Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              onClick={() => onRowClick?.(customer)}
              className={cn(
                "cursor-pointer transition-colors",
                "hover:bg-secondary/30"
              )}
            >
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {customer.address}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    frequencyColors[customer.frequency]
                  )}
                >
                  {customer.frequency}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono font-semibold text-primary">
                  ${customer.rate}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(customer.since).toLocaleDateString("en-NZ", {
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{formatDate(customer.nextVisit)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
