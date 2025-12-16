import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - in production this would come from Supabase based on the ID
const serviceHistory: Record<string, {
  id: string;
  date: string;
  time: string;
  address: string;
  services: { name: string; price: number }[];
  subtotal: number;
  total: number;
  status: string;
  technician: string;
  notes: string;
  duration: string;
  photos?: string[];
}> = {
  "101": {
    id: "101",
    date: "Friday, 6 December 2024",
    time: "9:15 AM - 10:45 AM",
    address: "123 Example Street, Dunedin",
    services: [
      { name: "Lawn Mowing", price: 55 },
      { name: "Edging", price: 15 },
      { name: "Hedge Trim", price: 25 },
    ],
    subtotal: 95,
    total: 95,
    status: "completed",
    technician: "William",
    notes: "Front and back lawns completed. Hedges along driveway trimmed to 1.2m height as requested.",
    duration: "1 hour 30 mins",
  },
  "102": {
    id: "102",
    date: "Friday, 22 November 2024",
    time: "10:00 AM - 11:00 AM",
    address: "123 Example Street, Dunedin",
    services: [
      { name: "Lawn Mowing", price: 55 },
      { name: "Edging", price: 20 },
    ],
    subtotal: 75,
    total: 75,
    status: "completed",
    technician: "William",
    notes: "Regular fortnightly service. All areas looking healthy.",
    duration: "1 hour",
  },
  "103": {
    id: "103",
    date: "Friday, 8 November 2024",
    time: "9:30 AM - 10:30 AM",
    address: "123 Example Street, Dunedin",
    services: [
      { name: "Lawn Mowing", price: 55 },
      { name: "Edging", price: 20 },
    ],
    subtotal: 75,
    total: 75,
    status: "completed",
    technician: "William",
    notes: "First service for new customer. Property assessed and regular schedule set up.",
    duration: "1 hour",
  },
};

export default async function ServiceHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = serviceHistory[id];

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="font-heading text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find this service record.
          </p>
          <Link href="/account">
            <Button>Back to Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <span>←</span>
        <span>Back to Account</span>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-1">
            Service Details
          </h1>
          <p className="text-muted-foreground">
            Invoice #{service.id}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Completed
        </span>
      </div>

      <div className="space-y-6">
        {/* Date & Location Card */}
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                <p className="font-semibold">{service.date}</p>
                <p className="text-sm text-muted-foreground">{service.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold">{service.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold">{service.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Technician</p>
                <p className="font-semibold">{service.technician}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Breakdown */}
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Services Performed</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3">
              {service.services.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {item.name === "Lawn Mowing" && "🌿"}
                      {item.name === "Edging" && "✂️"}
                      {item.name === "Hedge Trim" && "🌳"}
                      {item.name === "Dog Cleanup" && "🐕"}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold">${item.price}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t-2 border-border">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-lg">Total</span>
                <span className="font-mono font-bold text-2xl text-beefy-green">
                  ${service.total}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {service.notes && (
          <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Service Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-muted-foreground leading-relaxed">
                {service.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/quote" className="flex-1">
            <Button
              className="w-full bg-gradient-to-br from-beefy-green to-beefy-green-light text-white font-heading font-bold rounded-xl"
            >
              Book Again
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
          >
            Download Invoice
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-xl"
          >
            Report Issue
          </Button>
        </div>
      </div>
    </div>
  );
}
