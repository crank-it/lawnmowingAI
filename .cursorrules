# ============================================================================
# BEEFY CUTS DUNEDIN .cursorrules
# Smart lawn service - Customer site + Admin dashboard
# ============================================================================

# SECTION 1: CORE RULES
# ============================================================================

## Stack
- Framework: Next.js 14+ (App Router)
- Styling: Tailwind CSS ONLY
- Components: shadcn/ui
- Database: Supabase
- Deployment: Vercel

## Critical Rules

### Styling (Non-negotiable)
1. TAILWIND ONLY — No custom CSS files, no CSS modules, no inline style={{}}
2. USE shadcn/ui — Don't recreate buttons, inputs, cards, dialogs, etc.
3. USE cn() HELPER — For conditional classes
4. USE CSS VARIABLES — bg-background, text-foreground, text-primary, etc.

### File Structure
```
app/
├── (marketing)/              # Customer-facing pages
│   ├── layout.tsx            # Cream gradient, nav, footer
│   ├── page.tsx              # Homepage with quote builder
│   ├── services/page.tsx     # Services detail
│   ├── how-it-works/page.tsx
│   └── about/page.tsx
├── (portal)/                 # Customer portal (authenticated)
│   ├── layout.tsx
│   └── account/page.tsx      # Upcoming visits, history, details
├── (admin)/                  # Admin dashboard (William)
│   ├── layout.tsx            # Dark theme, sidebar
│   ├── page.tsx              # Today's jobs/route
│   ├── customers/page.tsx    # Customer management
│   ├── schedule/page.tsx     # This week view
│   ├── earnings/page.tsx     # Earnings tracking
│   └── settings/page.tsx
├── api/
│   ├── analyze-property/     # Property analysis endpoint
│   ├── quotes/               # Quote generation
│   └── bookings/             # Booking management
├── globals.css               # Tailwind + CSS variables ONLY
└── layout.tsx                # Root layout with fonts
components/
├── ui/                       # shadcn/ui (don't edit)
├── marketing/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── address-input.tsx
│   ├── feature-grid.tsx
│   └── suburb-pills.tsx
├── quote/
│   ├── property-analysis.tsx
│   ├── service-selector.tsx
│   ├── frequency-picker.tsx
│   ├── quote-summary.tsx
│   ├── dog-size-selector.tsx
│   └── booking-modal.tsx
├── portal/
│   ├── upcoming-visits.tsx
│   ├── service-history.tsx
│   ├── quick-actions.tsx
│   └── account-details.tsx
├── admin/
│   ├── sidebar.tsx
│   ├── stats-card.tsx
│   ├── job-card.tsx
│   ├── route-progress.tsx
│   ├── customer-table.tsx
│   ├── earnings-grid.tsx
│   └── job-detail-sheet.tsx
└── shared/
    ├── beefy-logo.tsx
    ├── service-badge.tsx
    └── status-badge.tsx
lib/
├── supabase/
├── utils.ts                  # cn() helper
└── data/
    ├── services.ts           # Service definitions
    ├── suburbs.ts            # Dunedin suburbs
    └── pricing.ts            # Pricing logic
types/
├── property.ts               # Property analysis types
├── quote.ts                  # Quote/booking types
├── customer.ts               # Customer types
└── job.ts                    # Job/schedule types
```

# ============================================================================
# SECTION 2: BEEFY CUTS DESIGN SYSTEM
# ============================================================================

## Typography

### Fonts

| Purpose | Font Family | Category |
|---------|-------------|----------|
| Headings & Brand | Fredoka | display |
| Body Text | Nunito | sans-serif |
| Prices/Numbers | JetBrains Mono | monospace |

### Font Setup (layout.tsx)

```tsx
import { Fredoka, Nunito, JetBrains_Mono } from "next/font/google"

const fredoka = Fredoka({ 
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"]
})

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
})

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"]
})

// In <body>:
<body className={`${fredoka.variable} ${nunito.variable} ${jetbrains.variable} font-body antialiased`}>
```

### Tailwind Config

```ts
// tailwind.config.ts
fontFamily: {
  heading: ["var(--font-heading)", "sans-serif"],
  body: ["var(--font-body)", "sans-serif"],
  mono: ["var(--font-mono)", "monospace"],
},
boxShadow: {
  'beefy-sm': '0 4px 20px rgba(0,0,0,0.04)',
  'beefy-md': '0 8px 40px rgba(0,0,0,0.08)',
  'beefy-lg': '0 12px 40px rgba(45,90,39,0.15)',
},
colors: {
  'beefy-green': '#2D5A27',
  'beefy-green-light': '#4CAF50',
  'beefy-red': '#DC2626',
  'beefy-cream': '#FDF8F3',
},
```

### Typography Usage

| Element | Classes |
|---------|---------|
| Brand title | `font-heading text-2xl font-bold text-beefy-green` |
| Hero title | `font-heading text-5xl md:text-7xl font-bold leading-tight` |
| Section title | `font-heading text-2xl font-semibold` |
| Card title | `font-heading text-xl font-semibold` |
| Body text | `text-base text-muted-foreground leading-relaxed` |
| Price display | `font-mono text-3xl font-bold text-beefy-green` |
| Badge text | `text-xs font-semibold uppercase tracking-wide` |

---

## Colour Palette

### CSS Variables (globals.css)

```css
@layer base {
  :root {
    --background: 30 33% 96%;          /* #FDF8F3 */
    --foreground: 0 0% 10%;            /* #1a1a1a */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 10%;
    --primary: 130 45% 25%;            /* #2D5A27 */
    --primary-foreground: 0 0% 100%;
    --secondary: 120 30% 94%;          /* #E8F5E9 */
    --secondary-foreground: 130 45% 25%;
    --muted: 30 20% 92%;               /* #F0EBE3 */
    --muted-foreground: 0 0% 40%;
    --accent: 0 84% 47%;               /* #DC2626 */
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 47%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 88%;
    --input: 0 0% 88%;
    --ring: 130 45% 25%;
    --radius: 1rem;
  }

  .dark {
    --background: 0 0% 10%;            /* #1a1a1a */
    --foreground: 0 0% 100%;
    --card: 0 0% 13%;                  /* #222222 */
    --card-foreground: 0 0% 100%;
    --primary: 122 39% 49%;            /* #4CAF50 */
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 17%;             /* #2a2a2a */
    --secondary-foreground: 0 0% 67%;
    --muted: 0 0% 17%;
    --muted-foreground: 0 0% 53%;
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 122 39% 49%;
  }
}
```

### Key Colours

| Colour | Hex | Usage |
|--------|-----|-------|
| Beefy Green | #2D5A27 | Brand, headings, success |
| Beefy Green Light | #4CAF50 | Progress, accents |
| Beefy Red | #DC2626 | CTA buttons |
| Beefy Cream | #FDF8F3 | Customer site background |
| Dark BG | #1a1a1a | Admin dashboard |

### Gradients

```tsx
// Customer background
className="bg-gradient-to-b from-[#FDF8F3] to-[#F0EBE3]"

// CTA Button
className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C]"

// Quote/Success display
className="bg-gradient-to-br from-[#2D5A27] to-[#4CAF50]"
```

---

## Components

### Install Command

```bash
npx shadcn@latest add button card input textarea form label select dialog sheet skeleton sonner tabs badge progress separator checkbox radio-group avatar table
```

### Beefy Button

```tsx
// Primary CTA
<Button className="bg-gradient-to-br from-beefy-red to-[#B91C1C] text-white font-heading font-bold rounded-xl px-8 py-6 text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg">

// Secondary
<Button variant="outline" className="border-2 border-beefy-green text-beefy-green hover:bg-beefy-green hover:text-white font-heading font-semibold rounded-xl">
```

### Beefy Card

```tsx
<Card className="border-0 bg-card rounded-2xl shadow-beefy-sm transition-all hover:-translate-y-1 hover:shadow-beefy-lg">
```

### Beefy Input

```tsx
<Input className="rounded-xl border-0 bg-muted py-6 text-lg focus:ring-2 focus:ring-beefy-green/20" />
```

---

## Icons

Use emojis as primary icons for friendly brand feel:

| Context | Emoji |
|---------|-------|
| Brand | 🐄 |
| Location | 📍 |
| Lawn | 🌿 |
| Edging | ✂️ |
| Hedge | 🌳 |
| Spray | 🧪 |
| Leaves | 🍂 |
| Dog | 🐕 |
| Calendar | 📅 |
| Property | 📐 |
| Gradient | ⛰️ |
| Success | 🎉 |
| AI/Satellite | 🛰️ |

# ============================================================================
# SECTION 3: PAGE PATTERNS
# ============================================================================

## Customer Site Layout (Light Theme)

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F0EBE3]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

## Admin Dashboard Layout (Dark Theme)

```tsx
// app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-89px)]">
          {children}
        </main>
      </div>
    </div>
  )
}
```

## Loading States

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8 space-y-8 animate-pulse">
      <Skeleton className="h-12 w-64 rounded-xl" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
```

# ============================================================================
# SECTION 4: FORMS
# ============================================================================

## Quote Request Form

```tsx
const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone required"),
  email: z.string().email().optional(),
  address: z.string().min(5, "Address is required"),
  services: z.array(z.string()).min(1),
  frequency: z.enum(["weekly", "fortnightly", "monthly"]),
  notes: z.string().optional(),
})
```

## Service Selection Pattern

```tsx
<div className="space-y-3">
  {services.map(service => (
    <div
      key={service.id}
      onClick={() => toggleService(service.id)}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all",
        selectedServices.includes(service.id)
          ? "bg-secondary border-2 border-beefy-green"
          : "bg-muted border-2 border-transparent hover:bg-muted/80"
      )}
    >
      <Checkbox checked={selectedServices.includes(service.id)} />
      <span className="text-2xl">{service.icon}</span>
      <div className="flex-1">
        <div className="font-semibold">{service.name}</div>
        <div className="text-sm text-muted-foreground">{service.description}</div>
      </div>
      {service.priceLabel && (
        <Badge variant="secondary">{service.priceLabel}</Badge>
      )}
    </div>
  ))}
</div>
```

# ============================================================================
# SECTION 5: DATA TYPES
# ============================================================================

## Core Types

```ts
// types/property.ts
interface PropertyData {
  totalArea: number        // m²
  lawnArea: number         // m²
  gradient: 'Flat' | 'Gentle slope' | 'Moderate slope' | 'Steep'
  estimatedEdging: number  // metres
  accessDifficulty: 'Easy' | 'Standard' | 'Tricky'
  hedgeLength: number      // metres
}

// types/quote.ts
interface Quote {
  id: string
  address: string
  services: string[]
  frequency: 'weekly' | 'fortnightly' | 'monthly'
  priceMin: number
  priceMax: number
  propertyData: PropertyData
  createdAt: Date
}

// types/job.ts
interface Job {
  id: string
  customerId: string
  customer: string
  address: string
  suburb: string
  scheduledTime: string
  services: string[]
  price: number
  status: 'next' | 'scheduled' | 'completed'
  notes: string
  lawnSize: number
  lastVisit: string
  routeOrder: number
  isNew?: boolean
  dogSize?: 'small' | 'medium' | 'large'
}

// types/customer.ts
interface Customer {
  id: string
  name: string
  address: string
  frequency: 'Weekly' | 'Fortnightly' | 'Monthly'
  rate: number
  since: string
  nextVisit: string
  notes?: string
}
```

# ============================================================================
# SECTION 6: STYLE RULES
# ============================================================================

## DO ✅
- Use Fredoka for headings, Nunito for body
- Use emojis as icons
- Use rounded-xl/rounded-2xl everywhere
- Use warm cream gradient for customer site
- Use dark theme for admin
- Add hover lift effects
- Keep CTA buttons red (contrast with green)

## DON'T ❌
- No sharp corners
- No fonts other than Fredoka/Nunito/JetBrains
- No blue primary actions
- No custom CSS files
- No inline style={{}}
- Don't mix customer/admin styling

# ============================================================================
# END OF RULES
# ============================================================================
