import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "1",
    icon: "📍",
    title: "Enter Your Address",
    description:
      "Pop in your Dunedin address and we'll instantly locate your property using satellite data.",
    detail:
      "We cover all of Dunedin from St Clair to Mosgiel, North Dunedin to Port Chalmers.",
  },
  {
    number: "2",
    icon: "🛰️",
    title: "AI Property Analysis",
    description:
      "Our smart system analyzes your property in seconds, measuring lawn area, slope, and access.",
    detail:
      "No more guessing! We use actual measurements to give you accurate, fair pricing.",
  },
  {
    number: "3",
    icon: "🛠️",
    title: "Build Your Package",
    description:
      "Choose from mowing, edging, hedge trimming, weed spray, and more. See your price update in real-time.",
    detail:
      "Weekly, fortnightly, or monthly visits with discounts for regular service.",
  },
  {
    number: "4",
    icon: "📋",
    title: "Book Your Assessment",
    description:
      "Request a free on-site visit. William will confirm your quote in person and answer any questions.",
    detail:
      "No obligation to proceed. We'll give you an exact price before you commit.",
  },
  {
    number: "5",
    icon: "✂️",
    title: "Sit Back & Relax",
    description:
      "Once you're happy, we'll schedule regular visits. You'll get reminders and can manage everything online.",
    detail:
      "Pay by bank transfer or cash. Reschedule or pause anytime through your account.",
  },
];

const faqs = [
  {
    question: "How accurate is the AI property analysis?",
    answer:
      "Very accurate! We use satellite imagery combined with local data to measure your lawn. During your free assessment, William will confirm everything on-site.",
  },
  {
    question: "What if my property is different to what the AI detected?",
    answer:
      "No problem! The on-site assessment catches any differences. If your lawn is bigger or smaller, we'll adjust the quote accordingly.",
  },
  {
    question: "Can I change my service package later?",
    answer:
      "Absolutely. You can add or remove services anytime through your account portal, or just ask William on his next visit.",
  },
  {
    question: "What happens if it rains on my scheduled day?",
    answer:
      "We'll reach out to reschedule to the next available day. Light rain is usually fine, but we won't mow if it damages your lawn.",
  },
  {
    question: "How do I pay?",
    answer:
      "We accept bank transfer or cash. You'll receive an invoice after each visit. Regular customers can set up automatic payments.",
  },
  {
    question: "Is there a contract or minimum commitment?",
    answer:
      "Nope! Pay as you go. You can pause or cancel anytime with no penalties. We earn your business every visit.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <Badge
          variant="secondary"
          className="mb-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full"
        >
          🤖 Smart & Simple
        </Badge>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          How It Works
        </h1>
        <p className="text-xl text-muted-foreground">
          From quote to pristine lawn in 5 easy steps. No callbacks, no
          waiting around, no surprises.
        </p>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto mb-20">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-6">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-beefy-green text-white flex items-center justify-center font-heading font-bold text-xl">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>

              {/* Content */}
              <Card className="flex-1 border-0 bg-card rounded-2xl shadow-beefy-sm mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{step.icon}</span>
                    <h3 className="font-heading text-xl font-semibold">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-2">{step.description}</p>
                  <p className="text-sm text-muted-foreground/80 italic">
                    {step.detail}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border-0 bg-card rounded-2xl shadow-beefy-sm"
            >
              <CardContent className="p-6">
                <h4 className="font-heading font-semibold mb-2">
                  {faq.question}
                </h4>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center max-w-2xl mx-auto">
        <Card className="border-0 bg-gradient-to-br from-beefy-green to-beefy-green-light rounded-2xl p-8 text-white">
          <h2 className="font-heading text-2xl font-bold mb-4">
            Ready to try it out?
          </h2>
          <p className="opacity-90 mb-6">
            Get your instant quote now. It only takes 30 seconds!
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
