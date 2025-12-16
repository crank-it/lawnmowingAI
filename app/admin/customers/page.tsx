"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomerTable } from "@/components/admin/customer-table";
import { getCustomersWithSchedules } from "@/lib/supabase/queries";
import { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await getCustomersWithSchedules();
        // Transform Supabase data to Customer type
        const transformedCustomers: Customer[] = data.map((customer) => {
          const schedule = customer.beefy_schedules?.[0];
          const freq = schedule?.frequency;
          // Map DB frequency to app Frequency type
          const frequency: "weekly" | "fortnightly" | "monthly" =
            freq === "weekly" ? "weekly" :
            freq === "fortnightly" ? "fortnightly" : "monthly";

          return {
            id: customer.id,
            name: customer.name,
            address: customer.address,
            suburb: customer.suburb || "",
            phone: customer.phone,
            email: customer.email || undefined,
            frequency,
            rate: schedule?.base_price || 0,
            services: Array.isArray(schedule?.services)
              ? (schedule.services as string[])
              : ["mowing"],
            since: new Date(customer.created_at || Date.now()),
            nextVisit: schedule?.next_service_date
              ? new Date(schedule.next_service_date)
              : undefined,
            totalVisits: 0,
            totalSpent: schedule?.base_price || 0,
            status: customer.is_active ? "active" : "inactive",
          };
        });
        setCustomers(transformedCustomers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const activeCount = customers.filter((c) => c.status === "active").length;

  const handleRowClick = (customer: Customer) => {
    console.log("Clicked customer:", customer.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${activeCount} active customers`}
          </p>
        </div>
        <Button className="bg-gradient-to-br from-beefy-green to-beefy-green-light text-white rounded-xl">
          + Add Customer
        </Button>
      </div>

      {/* Customer Table */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading customers...
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No customers yet
        </div>
      ) : (
        <CustomerTable customers={customers} onRowClick={handleRowClick} />
      )}
    </div>
  );
}
