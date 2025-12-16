import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    id: "mowing",
    name: "Lawn Mowing",
    icon: "🌿",
    description: "Professional lawn cutting with our quality equipment. We'll leave your lawn looking crisp and healthy.",
    price: "Included",
    priceNote: "in all packages",
    included: [
      "Full lawn cut to your preferred height",
      "Clippings collected & removed",
      "Blow clean of paths & driveways",
      "Edge trimming along fences",
    ],
    highlight: true,
  },
  {
    id: "edging",
    name: "Edge Trimming",
    icon: "✂️",
    description: "Clean, defined edges along your paths, gardens, and driveways for that professional finish.",
    price: "+$15",
    priceNote: "per visit",
    included: [
      "Crisp edges along all paths",
      "Garden bed borders",
      "Driveway edges",
      "Around fence lines",
    ],
  },
  {
    id: "hedges",
    name: "Hedge Trimming",
    icon: "🌳",
    description: "Keep your hedges neat, tidy, and healthy with regular trimming and shaping.",
    price: "From $25",
    priceNote: "based on length",
    included: [
      "Shape & trim to your preference",
      "Clean up all clippings",
      "Healthy pruning practices",
      "Box hedges & feature shrubs",
    ],
  },
  {
    id: "weedspray",
    name: "Weed Spray",
    icon: "🧪",
    description: "Target those pesky weeds in your lawn, paths, and garden borders.",
    price: "+$20",
    priceNote: "per treatment",
    included: [
      "Lawn weed treatment",
      "Path & driveway cracks",
      "Garden border edges",
      "Safe for pets after drying",
    ],
  },
  {
    id: "dogcleanup",
    name: "Dog Cleanup",
    icon: "🐕",
    description: "Pre-mow cleanup of dog waste so your lawn stays fresh and clean.",
    price: "From $10",
    priceNote: "based on dog size",
    included: [
      "Full yard sweep before mowing",
      "Waste bagged & removed",
      "Small dog: $10",
      "Medium dog: $15",
      "Large dog: $20",
    ],
  },
  {
    id: "leaves",
    name: "Leaf Cleanup",
    icon: "🍂",
    description: "Seasonal leaf blowing and collection to keep your property tidy through autumn.",
    price: "+$20",
    priceNote: "per visit",
    included: [
      "Blow & rake all leaves",
      "Clear from lawn & gardens",
      "Clean gutters (ground level)",
      "Leaves bagged & removed",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <Badge
          variant="secondary"
          className="mb-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full"
        >
          ✨ Complete Lawn Care
        </Badge>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          Our Services
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to keep your Dunedin property looking its best.
          Mix and match to build your perfect lawn care package.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`border-0 bg-card rounded-2xl shadow-beefy-sm transition-all hover:-translate-y-1 hover:shadow-beefy-lg ${
              service.highlight ? "ring-2 ring-beefy-green" : ""
            }`}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                {service.highlight && (
                  <Badge className="bg-beefy-green text-white">Core Service</Badge>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="font-heading text-xl font-semibold mb-2">
                {service.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {service.description}
              </p>

              {/* Price */}
              <div className="mb-4">
                <span className="font-mono text-2xl font-bold text-beefy-green">
                  {service.price}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {service.priceNote}
                </span>
              </div>

              {/* What's Included */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  What&apos;s Included
                </p>
                <ul className="space-y-1.5">
                  {service.included.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-beefy-green mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center max-w-2xl mx-auto">
        <Card className="border-0 bg-gradient-to-br from-beefy-green to-beefy-green-light rounded-2xl p-8 text-white">
          <h2 className="font-heading text-2xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="opacity-90 mb-6">
            Get an instant quote in seconds. Just enter your address and we&apos;ll
            analyze your property with our smart AI system.
          </p>
          <Link href="/">
            <Button className="bg-white text-beefy-green hover:bg-white/90 font-heading font-bold rounded-xl px-8 py-6 text-lg">
              Get Your Free Quote →
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
