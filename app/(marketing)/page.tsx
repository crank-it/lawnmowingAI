"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddressInput } from "@/components/marketing/address-input";
import { SuburbPills } from "@/components/marketing/suburb-pills";
import { PropertyAnalysis } from "@/components/quote/property-analysis";
import { popularSuburbs } from "@/lib/data/suburbs";

const features = [
  {
    icon: "🛰️",
    title: "Smart Property Analysis",
    description:
      "AI analyzes your property from satellite imagery for accurate, fair pricing in seconds.",
  },
  {
    icon: "📅",
    title: "Flexible Scheduling",
    description:
      "Weekly, fortnightly, or monthly visits. Save up to 15% with regular service.",
  },
  {
    icon: "💬",
    title: "No Surprises",
    description:
      "Know your price upfront. What we quote is what you pay, guaranteed.",
  },
];

const services = [
  { icon: "🌿", name: "Lawn Mowing" },
  { icon: "✂️", name: "Edging" },
  { icon: "🌳", name: "Hedge Trimming" },
  { icon: "🧪", name: "Weed Spray" },
  { icon: "🐕", name: "Dog Cleanup" },
  { icon: "🍂", name: "Leaf Cleanup" },
];

export default function HomePage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const addressIdRef = useRef<string | null>(null);
  const sourceRef = useRef<string | null>(null);

  const handleSubmit = (addressId?: string, source?: string) => {
    if (address.trim()) {
      addressIdRef.current = addressId || null;
      sourceRef.current = source || null;
      setShowAnalysis(true);
    }
  };

  const handleAnalysisComplete = () => {
    setShowAnalysis(false);
    let url = `/quote?address=${encodeURIComponent(address)}`;
    if (addressIdRef.current) {
      url += `&addressId=${encodeURIComponent(addressIdRef.current)}`;
    }
    if (sourceRef.current) {
      url += `&source=${encodeURIComponent(sourceRef.current)}`;
    }
    router.push(url);
  };

  const handleSuburbSelect = (suburb: string) => {
    setAddress(`${suburb}, Dunedin`);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 lg:py-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-4 lg:mb-6 bg-secondary text-secondary-foreground px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-full"
          >
            🌱 Serving Dunedin&apos;s finest lawns since 2025
          </Badge>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 lg:mb-6">
            Your lawn deserves
            <span className="block text-lawn-teal">the royal treatment</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base lg:text-xl text-muted-foreground mb-6 lg:mb-10 max-w-2xl mx-auto px-2">
            Get an instant quote powered by smart AI property analysis. Fair
            pricing, reliable service, no surprises.
          </p>

          {/* Address Input */}
          <div className="max-w-2xl mx-auto mb-4">
            <AddressInput
              value={address}
              onChange={setAddress}
              onSubmit={handleSubmit}
              isLoading={isAnalyzing}
              placeholder="Enter your Dunedin address..."
            />
          </div>

          {/* Popular Suburbs */}
          <SuburbPills suburbs={popularSuburbs} onSelect={handleSuburbSelect} />
        </section>

        {/* Features Grid */}
        <section className="mb-12 lg:mb-20">
          <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-6 lg:mb-10">
            Why Dunedin loves LawnMowing.ai
          </h2>
          <div className="grid gap-4 lg:gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-0 bg-card rounded-2xl shadow-beefy-sm transition-all hover:-translate-y-1 hover:shadow-beefy-lg"
              >
                <CardContent className="p-4 lg:p-6 text-center">
                  <span className="text-3xl lg:text-4xl mb-3 lg:mb-4 block">{feature.icon}</span>
                  <h3 className="font-heading text-lg lg:text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services Preview */}
        <section className="mb-12 lg:mb-20">
          <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-6 lg:mb-8">
            Our Services
          </h2>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3 max-w-3xl mx-auto">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-1.5 lg:gap-2 bg-card px-3 lg:px-5 py-2 lg:py-3 rounded-full text-sm lg:text-base font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-lg lg:text-xl">{service.icon}</span>
                <span>{service.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12 lg:mb-20">
          <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-6 lg:mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                icon: "📍",
                title: "Enter Address",
                desc: "Pop in your Dunedin address",
              },
              {
                step: "2",
                icon: "🛰️",
                title: "AI Analysis",
                desc: "We scan your property",
              },
              {
                step: "3",
                icon: "💰",
                title: "Get Quote",
                desc: "Instant fair pricing",
              },
              {
                step: "4",
                icon: "✂️",
                title: "Book & Relax",
                desc: "William handles the rest",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-3 lg:mb-4 inline-block">
                  <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-2xl lg:text-3xl">{item.icon}</span>
                  </div>
                  <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 h-6 w-6 lg:h-7 lg:w-7 rounded-full bg-beefy-green text-white text-xs lg:text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading text-sm lg:text-base font-semibold mb-1">{item.title}</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-3xl mx-auto text-center">
          <Card className="border-0 bg-card rounded-2xl shadow-beefy-md p-5 lg:p-8">
            <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-3 lg:mb-4 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/william.png"
                alt="William - Founder of LawnMowing.ai"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="font-heading text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">
              Meet William
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
              Hey! I&apos;m William, a 14-year-old Dunedin local with a passion
              for great lawns. I started LawnMowing.ai to help busy families keep
              their properties looking sharp. When I&apos;m not mowing, you&apos;ll
              find me at school or hanging with mates. Let me take lawn care off
              your plate!
            </p>
          </Card>
        </section>
      </div>

      {/* Property Analysis Modal */}
      <PropertyAnalysis
        isOpen={showAnalysis}
        onComplete={handleAnalysisComplete}
        address={address}
      />
    </>
  );
}
