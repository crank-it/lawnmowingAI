# Beefy Cuts Dunedin — Build Guide

## Project Overview

**Business**: Smart lawn mowing service for Dunedin, NZ  
**Operator**: William (Ben's son)  
**Unique Value**: AI-powered property analysis for instant quotes

### What We're Building

1. **Customer Website** (Light theme)
   - Homepage with smart quote builder
   - Address-based property analysis
   - Service selection & pricing
   - Booking request flow
   - Client portal for existing customers

2. **Admin Dashboard** (Dark theme)
   - Today's jobs with route optimisation
   - Customer management
   - Earnings tracking
   - Job detail views

---

## Build Order

### Phase 1: Foundation (2-4 hours)

```
Order of operations:
1. BC01 - Initialize project structure
2. BC02 - Install dependencies
3. Create globals.css with CSS variables
4. Set up fonts in root layout
5. Add Tailwind config customisations
```

**Files created:**
- `app/layout.tsx` (fonts, base styling)
- `app/globals.css` (CSS variables for light/dark)
- `tailwind.config.ts` (custom shadows, colours, animations)
- `lib/utils.ts` (cn helper)

### Phase 2: Shared Components (1-2 hours)

```
Build reusable components first:
1. BC30 - Beefy Logo
2. BC31 - Service Badge
3. BC32 - Status Badge
4. BC33 - Stats Card
```

**Files created:**
- `components/shared/beefy-logo.tsx`
- `components/shared/service-badge.tsx`
- `components/shared/status-badge.tsx`
- `components/admin/stats-card.tsx`

### Phase 3: Data Layer (1-2 hours)

```
Set up data and types:
1. BC40 - Services data
2. BC41 - Suburbs data
3. BC42 - Pricing logic
4. Create TypeScript types
```

**Files created:**
- `lib/data/services.ts`
- `lib/data/suburbs.ts`
- `lib/data/pricing.ts`
- `types/property.ts`
- `types/quote.ts`
- `types/job.ts`
- `types/customer.ts`

### Phase 4: Customer Site (4-6 hours)

```
Build the customer-facing pages:
1. Marketing layout (header, footer, gradient bg)
2. BC10 - Homepage hero + features
3. BC34 - Address input component
4. BC11 - Property analysis modal
5. BC12 - Quote builder (services, summary)
6. BC35 - Frequency picker
7. BC13 - Booking modal
8. BC50, BC51 - Form and server action
```

**Files created:**
- `app/(marketing)/layout.tsx`
- `app/(marketing)/page.tsx`
- `components/marketing/header.tsx`
- `components/marketing/footer.tsx`
- `components/marketing/hero.tsx`
- `components/marketing/address-input.tsx`
- `components/quote/property-analysis.tsx`
- `components/quote/service-selector.tsx`
- `components/quote/frequency-picker.tsx`
- `components/quote/quote-summary.tsx`
- `components/quote/booking-modal.tsx`

### Phase 5: Client Portal (2-3 hours)

```
Build the authenticated customer area:
1. Portal layout
2. BC14 - Account page
3. Components for upcoming visits, history, etc.
```

**Files created:**
- `app/(portal)/layout.tsx`
- `app/(portal)/account/page.tsx`
- `components/portal/upcoming-visits.tsx`
- `components/portal/service-history.tsx`
- `components/portal/quick-actions.tsx`
- `components/portal/account-details.tsx`

### Phase 6: Admin Dashboard (4-6 hours)

```
Build William's command centre:
1. BC20 - Admin layout (dark theme, sidebar)
2. BC21 - Today's jobs page
3. BC22 - Job detail sheet
4. BC23 - Customers page
5. BC24 - Earnings page
```

**Files created:**
- `app/(admin)/layout.tsx`
- `app/(admin)/page.tsx`
- `app/(admin)/customers/page.tsx`
- `app/(admin)/earnings/page.tsx`
- `components/admin/sidebar.tsx`
- `components/admin/job-card.tsx`
- `components/admin/route-progress.tsx`
- `components/admin/customer-table.tsx`
- `components/admin/job-detail-sheet.tsx`
- `components/admin/earnings-grid.tsx`

### Phase 7: Polish (2-3 hours)

```
Mobile responsiveness and animations:
1. BC60 - Mobile navigation
2. BC61 - Quote builder mobile
3. BC62 - Admin mobile layout
4. BC70 - Page transitions
5. BC71 - Hover states
6. BC72 - Loading skeletons
```

### Phase 8: Deployment (1-2 hours)

```
Get it live:
1. BC44 - Set up Supabase schema
2. BC43 - Property analysis API
3. BC80 - Vercel configuration
4. BC81 - SEO and metadata
```

---

## Key Architectural Decisions

### Theming

- **Customer site**: Light theme with warm cream gradient
- **Admin dashboard**: Dark theme with green accents
- CSS variables change between themes
- Use `.dark` class on admin layout wrapper

### Route Groups

```
app/
├── (marketing)/    → Customer public pages
├── (portal)/       → Customer authenticated area
└── (admin)/        → William's dashboard
```

Each has its own `layout.tsx` with appropriate styling.

### State Management

For the quote builder flow:
- Use React state for quote builder (client component)
- Pass data via props, avoid global state
- Server actions for form submissions
- Supabase for persistence

### Component Architecture

```
components/
├── ui/           → shadcn/ui (untouched)
├── shared/       → Cross-cutting (logo, badges)
├── marketing/    → Customer site specific
├── quote/        → Quote builder specific
├── portal/       → Customer portal specific
└── admin/        → Admin dashboard specific
```

---

## Styling Quick Reference

### Customer Site

```tsx
// Page background
className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F0EBE3]"

// Card
className="border-0 bg-card rounded-2xl shadow-beefy-sm"

// CTA Button
className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white font-heading font-bold rounded-xl"

// Heading
className="font-heading text-2xl font-semibold text-foreground"
```

### Admin Dashboard

```tsx
// Wrapper (enables dark theme)
className="min-h-screen bg-background text-foreground dark"

// Card
className="bg-card rounded-2xl border-border"

// Green accent
className="text-primary" // Uses CSS variable, green in dark mode

// Price display
className="font-mono text-2xl font-bold text-primary"
```

---

## Testing Checklist

### Functionality

- [ ] Address input accepts text and triggers analysis
- [ ] Property analysis shows loading modal with animation
- [ ] Service selection toggles work correctly
- [ ] Dog size selector appears when dog cleanup selected
- [ ] Quote updates when services/frequency change
- [ ] Booking modal opens and form submits
- [ ] Admin job cards open detail sheet
- [ ] Mark as complete updates job status
- [ ] Customer table displays correctly
- [ ] Earnings stats calculate properly

### Responsiveness

- [ ] Customer site works on mobile (375px)
- [ ] Quote builder stacks on mobile
- [ ] Admin sidebar collapses on mobile
- [ ] All buttons have adequate touch targets
- [ ] Text remains readable at all sizes

### Visual

- [ ] Fonts load correctly (Fredoka, Nunito, JetBrains)
- [ ] Colours match design system
- [ ] Hover states on all interactive elements
- [ ] Animations are smooth and performant
- [ ] Dark theme applies correctly in admin

---

## Future Enhancements

### Phase 2 Features

1. **Real Property Analysis**
   - Integrate satellite imagery API
   - Machine learning for lawn detection
   - Accurate slope analysis

2. **Route Optimisation**
   - Google Maps integration
   - Automatic route ordering
   - Travel time estimates

3. **Payment Integration**
   - Stripe for online payments
   - Automatic invoicing
   - Subscription billing

4. **Notifications**
   - SMS confirmations (Twilio)
   - Email receipts
   - Reminder system

5. **Customer Acquisition**
   - Referral program
   - Review collection
   - Local SEO

---

## Files Summary

### Documentation (this package)

| File | Purpose |
|------|---------|
| `beefy-cuts-design-system.md` | Complete design system for Section 2 of .cursorrules |
| `beefy-cuts-cursorrules.md` | Full .cursorrules file ready to paste |
| `beefy-cuts-prompt-library.md` | Numbered prompts for building each part |
| `beefy-cuts-build-guide.md` | This file - comprehensive build order |

### Project Files to Create

```
beefy-cuts/
├── .cursorrules                    ← Paste beefy-cuts-cursorrules.md content
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── services/page.tsx
│   │   └── about/page.tsx
│   ├── (portal)/
│   │   ├── layout.tsx
│   │   └── account/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── customers/page.tsx
│   │   ├── earnings/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   └── analyze-property/route.ts
│   ├── actions/
│   │   └── submit-quote.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                         ← shadcn/ui components
│   ├── shared/
│   ├── marketing/
│   ├── quote/
│   ├── portal/
│   └── admin/
├── lib/
│   ├── data/
│   │   ├── services.ts
│   │   ├── suburbs.ts
│   │   └── pricing.ts
│   ├── supabase/
│   └── utils.ts
├── types/
│   ├── property.ts
│   ├── quote.ts
│   ├── job.ts
│   └── customer.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## Getting Started

```bash
# 1. Create new Next.js project
npx create-next-app@latest beefy-cuts --typescript --tailwind --app --src-dir=false

# 2. Install shadcn/ui
npx shadcn@latest init

# 3. Install components
npx shadcn@latest add button card input textarea form label select dialog sheet skeleton sonner tabs badge progress separator checkbox radio-group avatar table

# 4. Copy .cursorrules content into project root

# 5. Start building with prompts from the library
```

Ready to build! 🐄🌿
