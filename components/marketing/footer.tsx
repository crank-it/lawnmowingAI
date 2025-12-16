import Link from "next/link";
import { BeefyLogo } from "@/components/shared/beefy-logo";

const footerLinks = {
  services: [
    { href: "/services#mowing", label: "Lawn Mowing" },
    { href: "/services#edging", label: "Edge Trimming" },
    { href: "/services#hedges", label: "Hedge Trimming" },
    { href: "/services#weedspray", label: "Weed Spray" },
  ],
  company: [
    { href: "/about", label: "About William" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/account", label: "My Account" },
  ],
  areas: [
    { href: "/#suburbs", label: "St Clair" },
    { href: "/#suburbs", label: "South Dunedin" },
    { href: "/#suburbs", label: "Mornington" },
    { href: "/#suburbs", label: "Roslyn" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#F0EBE3] border-t border-border/40 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <BeefyLogo size="md" variant="light" />
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              Smart lawn mowing for busy Dunedin homes. AI-powered quotes,
              reliable service.
            </p>
            <p className="mt-4 text-muted-foreground text-sm">
              Run by William, your local lawn care expert.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-lawn-teal text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-lawn-teal text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas Served */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              Areas Served
            </h4>
            <ul className="space-y-2">
              {footerLinks.areas.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-lawn-teal text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#suburbs"
                  className="text-lawn-teal hover:text-lawn-teal/80 text-sm font-medium transition-colors"
                >
                  + 30 more suburbs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LawnMowing.ai. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
