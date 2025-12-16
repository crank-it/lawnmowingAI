"use client";

import Link from "next/link";
import { useState } from "react";
import { BeefyLogo } from "@/components/shared/beefy-logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-lawn-cream/90 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        {/* Centered Logo */}
        <div className="flex justify-center py-4">
          <Link href="/">
            <BeefyLogo size="lg" variant="light" />
          </Link>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-4">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/account">
              <Button
                variant="outline"
                className="border-2 border-lawn-teal text-lawn-teal hover:bg-lawn-teal hover:text-white font-heading font-semibold rounded-xl"
              >
                My Account
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden mx-auto">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <span className="text-2xl">☰</span>
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-lawn-cream">
              <div className="flex flex-col gap-6 mt-8">
                <BeefyLogo size="lg" variant="light" />
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-lawn-teal transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="pt-4 border-t border-border">
                  <Link href="/account" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-br from-lawn-orange to-lawn-orange-dark text-white font-heading font-bold rounded-xl">
                      My Account
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
