import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - in production this would come from Supabase
const upcomingVisits = [
  {
    id: "1",
    date: "Friday, 20 Dec 2024",
    time: "9:00 AM - 11:00 AM",
    services: ["Lawn Mowing", "Edging"],
    status: "confirmed",
  },
  {
    id: "2",
    date: "Friday, 3 Jan 2025",
    time: "9:00 AM - 11:00 AM",
    services: ["Lawn Mowing", "Edging"],
    status: "scheduled",
  },
];

const serviceHistory = [
  {
    id: "101",
    date: "Friday, 6 Dec 2024",
    services: ["Lawn Mowing", "Edging", "Hedge Trim"],
    price: 95,
    status: "completed",
  },
  {
    id: "102",
    date: "Friday, 22 Nov 2024",
    services: ["Lawn Mowing", "Edging"],
    price: 75,
    status: "completed",
  },
  {
    id: "103",
    date: "Friday, 8 Nov 2024",
    services: ["Lawn Mowing", "Edging"],
    price: 75,
    status: "completed",
  },
];

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Your Account</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Visits */}
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-xl">
              Upcoming Visits
            </CardTitle>
            <Link href="/quote">
              <Button variant="outline" size="sm" className="text-xs">
                + Book New
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingVisits.length === 0 ? (
              <p className="text-muted-foreground">
                No upcoming visits scheduled.{" "}
                <Link href="/quote" className="text-beefy-green hover:underline">
                  Book one now
                </Link>
              </p>
            ) : (
              upcomingVisits.map((visit) => (
                <Link
                  key={visit.id}
                  href={`/account/visits/${visit.id}`}
                  className="block p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{visit.date}</p>
                      <p className="text-sm text-muted-foreground">{visit.time}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        visit.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {visit.status === "confirmed" ? "Confirmed" : "Scheduled"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {visit.services.map((service) => (
                      <span
                        key={service}
                        className="text-xs bg-beefy-green/10 text-beefy-green px-2 py-0.5 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Service History */}
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-xl">
              Service History
            </CardTitle>
            <Link href="/account/history">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View All →
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceHistory.length === 0 ? (
              <p className="text-muted-foreground">
                No service history yet.
              </p>
            ) : (
              serviceHistory.map((service) => (
                <Link
                  key={service.id}
                  href={`/account/history/${service.id}`}
                  className="block p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{service.date}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.services.map((s) => (
                          <span
                            key={s}
                            className="text-xs text-muted-foreground"
                          >
                            {s}
                            {service.services.indexOf(s) < service.services.length - 1 && " •"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-beefy-green">
                      ${service.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Completed
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Link href="/quote">
          <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold">Get a Quote</p>
                <p className="text-sm text-muted-foreground">Book a new service</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/account/settings">
          <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-semibold">Account Settings</p>
                <p className="text-sm text-muted-foreground">Update your details</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/account/billing">
          <Card className="border-0 bg-card rounded-2xl shadow-beefy-sm p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-semibold">Billing</p>
                <p className="text-sm text-muted-foreground">View invoices & payments</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
