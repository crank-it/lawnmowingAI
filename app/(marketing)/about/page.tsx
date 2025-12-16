import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const values = [
  {
    icon: "💪",
    title: "Reliability",
    description:
      "When I say I'll be there, I'll be there. No ghosting, no excuses. Your lawn will always be taken care of on schedule.",
  },
  {
    icon: "💰",
    title: "Fair Pricing",
    description:
      "Our AI quotes mean you pay for what you actually have, not a guess. No surprise fees, ever.",
  },
  {
    icon: "🌿",
    title: "Quality Work",
    description:
      "I take pride in every lawn. Neat edges, clean cuts, tidy finish. Your neighbours will notice.",
  },
  {
    icon: "💬",
    title: "Easy Communication",
    description:
      "Need to reschedule? Have a question? Just text me. No call centers, no waiting on hold.",
  },
];

const stats = [
  { value: "12+", label: "Happy Customers" },
  { value: "100+", label: "Lawns Mowed" },
  { value: "4.9", label: "Star Rating" },
  { value: "24hr", label: "Response Time" },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <Badge
          variant="secondary"
          className="mb-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full"
        >
          👋 Meet the Team
        </Badge>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          About LawnMowing.ai
        </h1>
        <p className="text-xl text-muted-foreground">
          Local, reliable lawn care with a smart twist.
          Run by a Dunedin teenager who cares about doing a great job.
        </p>
      </section>

      {/* About William */}
      <section className="max-w-4xl mx-auto mb-20">
        <Card className="border-0 bg-card rounded-2xl shadow-beefy-md overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* William Image */}
              <div className="bg-gradient-to-br from-lawn-teal/10 to-lawn-grass/10 p-6 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/william.png"
                      alt="William - Founder of LawnMowing.ai"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <p className="font-heading font-semibold text-xl">William</p>
                  <p className="text-muted-foreground">Founder & Head Mower</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <h2 className="font-heading text-2xl font-semibold mb-4">
                  Hey, I&apos;m William! 👋
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    I&apos;m a 14-year-old from Dunedin who started LawnMowing.ai to earn
                    some money doing something I&apos;m good at - making lawns look
                    awesome.
                  </p>
                  <p>
                    My Dad (Ben) helped me build this website with some pretty cool
                    AI tech that can look at your property from satellite images
                    and give you an instant quote. Pretty neat, right?
                  </p>
                  <p>
                    When I&apos;m not mowing, I&apos;m at school, hanging with mates, or
                    playing sports. But when I&apos;m on the job, I give it 100%. I
                    want every customer to be stoked with their lawn.
                  </p>
                  <p className="font-medium text-foreground">
                    Give me a shot - I promise you won&apos;t be disappointed! 🌿
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-0 bg-card rounded-2xl shadow-beefy-sm text-center"
            >
              <CardContent className="p-6">
                <p className="font-mono text-4xl font-bold text-beefy-green mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-center mb-10">
          What I Stand For
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value) => (
            <Card
              key={value.title}
              className="border-0 bg-card rounded-2xl shadow-beefy-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{value.icon}</span>
                  <h3 className="font-heading text-xl font-semibold">
                    {value.title}
                  </h3>
                </div>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The Tech */}
      <section className="max-w-3xl mx-auto mb-20">
        <Card className="border-0 bg-secondary rounded-2xl p-8">
          <div className="text-center mb-6">
            <span className="text-4xl">🛰️</span>
          </div>
          <h2 className="font-heading text-xl font-semibold text-center mb-4">
            The Smart Bit
          </h2>
          <p className="text-muted-foreground text-center">
            Our AI property analysis uses satellite imagery to measure your lawn
            area, check the slope, and figure out access. This means we can give
            you an accurate quote in seconds without needing to visit first. The
            tech was built by my dad who works in software, and it means we can
            price your lawn fairly based on what&apos;s actually there - not just a
            rough guess.
          </p>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center max-w-2xl mx-auto">
        <Card className="border-0 bg-gradient-to-br from-beefy-green to-beefy-green-light rounded-2xl p-8 text-white">
          <h2 className="font-heading text-2xl font-bold mb-4">
            Let&apos;s Make Your Lawn Look Great
          </h2>
          <p className="opacity-90 mb-6">
            Get your instant quote and see the LawnMowing.ai difference.
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
