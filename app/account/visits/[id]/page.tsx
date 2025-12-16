import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - in production this would come from Supabase based on the ID
const upcomingVisits: Record<string, {
  id: string;
  date: string;
  dayOfWeek: string;
  time: string;
  timeWindow: string;
  address: string;
  services: { name: string; price: number }[];
  estimatedTotal: number;
  status: "confirmed" | "scheduled" | "pending";
  technician: string;
  frequency: string;
  specialInstructions: string;
  contactPhone: string;
}> = {
  "1": {
    id: "1",
    date: "20 December 2024",
    dayOfWeek: "Friday",
    time: "9:00 AM",
    timeWindow: "9:00 AM - 11:00 AM",
    address: "123 Example Street, Dunedin",
    services: [
      { name: "Lawn Mowing", price: 55 },
      { name: "Edging", price: 20 },
    ],
    estimatedTotal: 75,
    status: "confirmed",
    technician: "William",
    frequency: "Fortnightly",
    specialInstructions: "Gate code: 1234. Please close gate after entry.",
    contactPhone: "021 123 4567",
  },
  "2": {
    id: "2",
    date: "3 January 2025",
    dayOfWeek: "Friday",
    time: "9:00 AM",
    timeWindow: "9:00 AM - 11:00 AM",
    address: "123 Example Street, Dunedin",
    services: [
      { name: "Lawn Mowing", price: 55 },
      { name: "Edging", price: 20 },
    ],
    estimatedTotal: 75,
    status: "scheduled",
    technician: "William",
    frequency: "Fortnightly",
    specialInstructions: "Gate code: 1234. Please close gate after entry.",
    contactPhone: "021 123 4567",
  },
};

const statusConfig = {
  confirmed: {
    label: "Confirmed",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    dotColor: "bg-green-500",
    description: "Your visit is confirmed and scheduled.",
  },
  scheduled: {
    label: "Scheduled",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-500",
    description: "Your visit is scheduled. We'll confirm closer to the date.",
  },
  pending: {
    label: "Pending",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    dotColor: "bg-gray-500",
    description: "Awaiting confirmation.",
  },
};

export default async function UpcomingVisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const visit = upcomingVisits[id];

  if (!visit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="font-heading text-2xl font-bold mb-4">Visit Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find this scheduled visit.
          </p>
          <Link href="/account">
            <Button>Back to Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[visit.status];

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
            Upcoming Visit
          </h1>
          <p className="text-muted-foreground">
            Booking #{visit.id}
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 ${status.bgColor} ${status.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
          <span className={`h-2 w-2 rounded-full ${status.dotColor}`} />
          {status.label}
        </span>
      </div>

      <div className="space-y-6">
        {/* Date & Time Hero Card */}
        <Card className="border-0 bg-gradient-to-br from-beefy-green to-beefy-green-light text-white rounded-2xl shadow-beefy-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl">📅</span>
              </div>
              <div>
                <p className="text-white/80 text-sm">{visit.dayOfWeek}</p>
                <p className="font-heading font-bold text-2xl">{visit.date}</p>
                <p className="text-white/90">{visit.timeWindow}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Info */}
        <div className={`p-4 rounded-xl ${status.bgColor} ${status.textColor}`}>
          <p className="text-sm font-medium">{status.description}</p>
        </div>

        {/* Location & Details Card */}
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold">{visit.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(visit.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-beefy-green hover:underline inline-flex items-center gap-1 mt-1"
                >
                  View on Map →
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Technician</p>
                <p className="font-semibold">{visit.technician}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Service Frequency</p>
                <p className="font-semibold">{visit.frequency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contact</p>
                <a href={`tel:${visit.contactPhone}`} className="font-semibold text-beefy-green hover:underline">
                  {visit.contactPhone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Scheduled Services</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3">
              {visit.services.map((item, index) => (
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
                <span className="font-heading font-bold text-lg">Estimated Total</span>
                <span className="font-mono font-bold text-2xl text-beefy-green">
                  ${visit.estimatedTotal}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Final price may vary based on lawn condition
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        {visit.specialInstructions && (
          <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Special Instructions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-muted-foreground leading-relaxed">
                {visit.specialInstructions}
              </p>
              <Link
                href="/account/settings"
                className="text-sm text-beefy-green hover:underline inline-flex items-center gap-1 mt-3"
              >
                Edit instructions →
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-2"
          >
            Reschedule Visit
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
          >
            Add Services
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Cancel Visit
          </Button>
        </div>

        {/* Help Section */}
        <Card className="border-0 bg-secondary/50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold mb-1">Need to make changes?</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Contact us at least 24 hours before your scheduled visit to reschedule or cancel without charge.
                </p>
                <a
                  href="tel:0211234567"
                  className="text-sm text-beefy-green hover:underline font-medium"
                >
                  Call 021 123 4567
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
