# Beefy Cuts Development Prompt Library

Use with Paste app. Number prefix for quick access.

---

## Project Setup

### BC01 - Initialize Beefy Cuts Project

```
I'm starting the Beefy Cuts Dunedin project using our standard stack:
- Next.js 14+ (App Router)
- Tailwind CSS (no custom CSS)
- shadcn/ui components
- Supabase for database
- Deploying to Vercel

This is a lawn mowing service with:
1. Customer-facing site (quote builder, services, portal)
2. Admin dashboard (job management, routes, customers, earnings)

Please set up:
1. File structure with route groups: (marketing), (portal), (admin)
2. Fonts: Fredoka (headings), Nunito (body), JetBrains Mono (prices)
3. CSS variables for both light (customer) and dark (admin) themes
4. shadcn/ui components installed
5. Tailwind config with custom shadows and colours

Follow the .cursorrules file for all styling and patterns.
```

### BC02 - Install Dependencies

```
Set up the Beefy Cuts project dependencies.

Install shadcn/ui components:
npx shadcn@latest add button card input textarea form label select dialog sheet skeleton sonner tabs badge progress separator checkbox radio-group avatar table

Additional packages needed:
- zod (form validation)
- react-hook-form
- framer-motion (optional, for property analysis animation)

Configure fonts in layout.tsx:
- Fredoka for headings
- Nunito for body
- JetBrains Mono for prices/numbers

Use Tailwind only — no custom CSS.
```

---

## Customer Site Pages

### BC10 - Homepage with Quote Builder

```
Create the Beefy Cuts homepage at app/(marketing)/page.tsx

Sections:
1. Hero section
   - Badge: "🌱 Serving Dunedin's finest lawns since 2025"
   - Title: "Your lawn deserves the royal treatment" (second line in green)
   - Subtitle about smart AI-powered quotes
   - Address input with 📍 icon and "Get Quote →" CTA button
   - Popular suburb pills below input

2. Features grid (3 columns)
   - 🛰️ Smart Property Analysis
   - 📅 Efficient Scheduling  
   - 💬 No Surprises

Requirements:
- Use warm cream gradient background
- Use Fredoka for headings
- CTA button uses red gradient (beefy-red)
- Mobile responsive
- Tailwind only — no custom CSS
```

### BC11 - Property Analysis Modal

```
Create a property analysis loading modal component.

When user clicks "Get Quote →":
1. Show modal overlay with animation
2. Display simulated satellite view with scanning line animation
3. Show progress steps:
   - Detecting property boundaries ✓
   - Measuring lawn area ✓
   - Checking slope gradient ✓
   - Calculating access routes ✓
4. After ~2.5s, dismiss and show results

Use Dialog from shadcn/ui.
Animation using Tailwind keyframes (add to config if needed).
No custom CSS — Tailwind only.
```

### BC12 - Quote Builder Page

```
Create the quote builder view that appears after property analysis.

Layout: Two columns on desktop (services left, quote summary right)

Left column:
1. Property Analysis card
   - Address with "AI Detected" badge
   - Stats grid: Total Property, Lawn Area, Gradient, Edging Required, Access, Hedge Length
   - Each stat has emoji icon

2. Service Selection card
   - Title: "Build Your Service Package"
   - List of services with checkboxes
   - Mowing marked as "INCLUDED"
   - Others show prices (+$15, +$3/m, etc.)
   - If "Dog Cleanup" selected, show dog size selector

Right column (sticky):
1. Quote Summary card
   - Frequency selector (Weekly/Fortnightly/Monthly tabs)
   - Large price display in green gradient box
   - Selected services as badges
   - "Book Free Assessment →" CTA
   - Trust badges below

Use shadcn/ui Card, Badge, Checkbox components.
Tailwind only — no custom CSS.
```

### BC13 - Booking Confirmation Modal

```
Create the booking confirmation modal.

Triggered when user clicks "Book Free Assessment →"

Content:
1. Success icon (🎉 in circle)
2. Title: "Awesome!"
3. Message about William confirming in person
4. Form fields:
   - Name input
   - Phone input
   - Email (optional)
5. Buttons: "Back" (outline) and "Request Visit ✓" (red CTA)

Use Dialog from shadcn/ui.
Animate in with fade-in-up.
Tailwind only.
```

### BC14 - Client Portal Page

```
Create the client portal at app/(portal)/account/page.tsx

This is for existing customers to view their account.

Layout: 2x2 grid of cards

Cards:
1. Upcoming Visits
   - Next visit highlighted (date, time slot, CONFIRMED badge)
   - Message: "You're all set for your next visit! 🌿"

2. Recent History
   - List of past visits (date, services, price)
   - 3 most recent entries

3. Quick Actions
   - 📅 Reschedule next visit
   - ➕ Add extra service
   - 💬 Message William
   - ⏸️ Pause my subscription

4. My Details
   - Address
   - Schedule (Fortnightly - Thursdays)
   - Rate ($65/visit)

Use shadcn/ui Card, Button, Badge.
Light theme (same as marketing site).
Tailwind only.
```

### BC15 - Services Detail Page

```
Create a services page at app/(marketing)/services/page.tsx

Content:
1. Hero with title "Our Services"
2. Service cards in grid:
   - Lawn Mowing (included in all packages)
   - Edge Trimming
   - Hedge Trimming
   - Weed Spray
   - Leaf Blowing
   - Dog Cleanup

Each card:
- Large emoji icon
- Service name
- Description
- Price indicator
- "What's included" bullet points

3. CTA section at bottom: "Ready to get started?"

Use warm cream background, Card components.
Tailwind only — no custom CSS.
```

---

## Admin Dashboard Pages

### BC20 - Admin Dashboard Layout

```
Create the admin dashboard layout at app/(admin)/layout.tsx

Requirements:
1. Dark theme (apply .dark class to wrapper)
2. Header with:
   - Beefy Cuts logo (green on dark)
   - Weather widget (emoji + temp)
   - Profile avatar with "William" and online status

3. Sidebar with:
   - Today's Earnings display (large number, progress bar)
   - Navigation tabs with icons and counts:
     - 📋 Today's Jobs (count)
     - 👥 Customers (count)
     - 📅 This Week
     - 💰 Earnings
     - ⚙️ Settings
   - Week summary box (jobs done, earned, month total)

4. Main content area (scrollable)

Use dark theme CSS variables.
JetBrains Mono for numbers/prices.
Tailwind only — no custom CSS.
```

### BC21 - Today's Jobs Page

```
Create the today's jobs view at app/(admin)/page.tsx

Content:
1. Header: "Today's Route" with date, job count, completed count
2. Action buttons: "🗺️ View Map" and "🧭 Start Navigation"

3. Route progress indicator
   - Horizontal dots connected by lines
   - Completed jobs show ✓
   - Current job highlighted orange
   - Future jobs greyed

4. Job cards list:
   - Left: Route number (large, coloured by status)
   - Middle: Customer name, address, service tags
   - Right: Price (green, mono font), scheduled time
   - Status badges: UP NEXT (orange), SCHEDULED (grey), DONE (green)
   - NEW badge for first-time customers

Each card clickable to open detail sheet.

Use dark theme, Card components.
Tailwind only — no custom CSS.
```

### BC22 - Job Detail Sheet

```
Create a slide-out job detail panel.

Opens when clicking a job card. Slides in from right.

Content:
1. Header: "Job Details" with close button
2. Customer info card:
   - Name (large)
   - Address with 📍
   - Scheduled time with ⏱️

3. Services card:
   - Green badges for each service

4. Property Info card (2-col grid):
   - Lawn size
   - Last visit
   - Dog size (if applicable)

5. Notes card:
   - Customer notes text

6. Price display:
   - Green gradient box
   - Large price in JetBrains Mono

7. Action buttons:
   - "✓ Mark as Complete" (green gradient, full width)
   - Row of: 📞 Call, 💬 Message, 🗺️ Navigate

Use Sheet from shadcn/ui.
Animate with slide-in-right.
Dark theme styling.
Tailwind only.
```

### BC23 - Customers Page

```
Create the customers list at app/(admin)/customers/page.tsx

Content:
1. Header: "Customers" with count and "➕ Add Customer" button

2. Customer table:
   - Columns: Customer, Address, Frequency, Rate, Since, Next Visit
   - Frequency as coloured badges (Weekly=blue, Fortnightly=green, Monthly=orange)
   - Rate in green mono font
   - Next Visit: "Today" highlighted green

Table rows hover state.
Dark theme styling.

Use Table component from shadcn/ui.
Tailwind only — no custom CSS.
```

### BC24 - Earnings Page

```
Create the earnings page at app/(admin)/earnings/page.tsx

Content:
1. Header: "Earnings"

2. Stats grid (4 columns):
   - Today ($X of $Y)
   - This Week ($X, Y jobs)
   - This Month ($X, Y jobs)
   - All Time ($X, since date)
   Each with different green shade

3. Recent Payments card:
   - List of payments with:
     - Customer name
     - Date + payment method
     - Amount (+$X in green)
   - Dividers between rows

Use JetBrains Mono for all numbers.
Dark theme styling.
Card and Badge components.
Tailwind only.
```

---

## Components

### BC30 - Beefy Logo Component

```
Create a reusable logo component at components/shared/beefy-logo.tsx

Props:
- size?: 'sm' | 'md' | 'lg'
- variant?: 'light' | 'dark'

Structure:
- Icon box with 🐄 emoji
- Text: "BEEFY CUTS" in Fredoka bold
- Subtitle: "DUNEDIN" in small caps

Light variant: Green text on transparent
Dark variant: Green icon, white text

Export for use in both customer site and admin.
Tailwind only.
```

### BC31 - Service Badge Component

```
Create a service badge component at components/shared/service-badge.tsx

Props:
- service: { id: string, name: string, icon: string }
- variant?: 'selected' | 'default' | 'compact'

Variants:
- default: Light green bg, dark green text, rounded-full
- selected: Green border, lighter bg
- compact: Smaller padding, for admin dashboard

Example: <ServiceBadge service={mowing} />
Output: 🌿 Lawn Mowing (as badge)

Tailwind only — no custom CSS.
```

### BC32 - Status Badge Component

```
Create a status badge component at components/shared/status-badge.tsx

Props:
- status: 'next' | 'scheduled' | 'done' | 'new'

Styling:
- next: Orange bg, white text, "UP NEXT"
- scheduled: Grey bg, grey text, "SCHEDULED"
- done: Green bg, white text, "DONE"
- new: Blue bg, blue text, "NEW"

Use Badge from shadcn/ui as base.
Tailwind only.
```

### BC33 - Stats Card Component

```
Create a stats card for the admin dashboard at components/admin/stats-card.tsx

Props:
- label: string (e.g., "Today")
- value: string (e.g., "$245")
- subtitle: string (e.g., "of $381")
- color?: string (defaults to beefy-green)

Structure:
- Dark card background
- Small muted label
- Large value in JetBrains Mono (coloured)
- Small subtitle text

Use on earnings page and sidebar.
Tailwind only.
```

### BC34 - Address Input Component

```
Create the address input component at components/marketing/address-input.tsx

Features:
- White container with shadow
- 📍 emoji prefix
- Large input field
- "Get Quote →" button (red gradient)
- Button disabled when empty
- Loading state when analyzing

Props:
- value: string
- onChange: (value: string) => void
- onSubmit: () => void
- isLoading: boolean

Use Input and Button from shadcn/ui.
Tailwind only — no custom CSS.
```

### BC35 - Frequency Picker Component

```
Create a frequency picker at components/quote/frequency-picker.tsx

Props:
- value: 'weekly' | 'fortnightly' | 'monthly'
- onChange: (value) => void

Structure:
- Container with muted background
- Three buttons in row
- Selected button has white bg and shadow
- Weekly shows "15% off" label
- Fortnightly shows "5% off" label

Use Tailwind for all styling.
Consider using shadcn Tabs or custom buttons.
```

---

## Data & API

### BC40 - Services Data

```
Create the services data file at lib/data/services.ts

Export:
1. Service interface
2. services array with all lawn services
3. Helper functions:
   - getServiceById(id: string)
   - getServicePrice(id: string, propertyData: PropertyData)

Services:
- mowing: Lawn Mowing, 🌿, included
- edging: Edge Trimming, ✂️, +$15
- hedgeTrim: Hedge Trim, 🌳, +$3/m
- weedSpray: Weed Spray, 🧪, +$25
- leafBlowing: Leaf Blowing, 🍂, +$12
- dogPoo: Dog Cleanup, 🐕, +$8-18

TypeScript with proper types.
```

### BC41 - Suburbs Data

```
Create Dunedin suburbs list at lib/data/suburbs.ts

Export:
1. suburbs array with all Dunedin suburbs
2. popularSuburbs array (top 5 for quick select)

Suburbs to include:
Helensburgh, Maori Hill, Roslyn, Mornington, Kenmure, Halfway Bush,
Wakari, Brockville, St Clair, St Kilda, South Dunedin, Caversham,
Corstorphine, Concord, Andersons Bay, Musselburgh, Vauxhall, Shiel Hill,
Company Bay, Macandrew Bay, Broad Bay, Portobello, North East Valley,
Pine Hill, Dalmore, Opoho, Normanby, North Dunedin, Port Chalmers

TypeScript with proper types.
```

### BC42 - Pricing Logic

```
Create pricing calculation at lib/data/pricing.ts

Export:
1. calculateQuote function

Inputs:
- propertyData: PropertyData
- selectedServices: string[]
- frequency: 'weekly' | 'fortnightly' | 'monthly'
- dogSize?: 'small' | 'medium' | 'large'

Logic:
- Base rate: $35
- Lawn area: $12 per 100m²
- Gradient: +$10 moderate, +$20 steep
- Access difficulty: +$8 if tricky
- Edging: +$15
- Hedge trim: $3 per metre
- Weed spray: +$25
- Leaf blowing: +$12
- Dog cleanup: $8 small, $12 medium, $18 large

Frequency discounts:
- Weekly: 15% off
- Fortnightly: 5% off
- Monthly: full price

Return { min, max } (±$10-15 range for estimate)
```

### BC43 - Property Analysis API

```
Create property analysis endpoint at app/api/analyze-property/route.ts

POST endpoint that receives:
- address: string

Returns (simulated for now):
- totalArea: number (650-950 m²)
- lawnArea: number (280-430 m²)
- gradient: string
- estimatedEdging: number (45-75 m)
- accessDifficulty: string
- hedgeLength: number (0-20 m)

Add 2.5s delay to simulate analysis.
In production, this would call satellite/GIS APIs.

Use Next.js App Router API conventions.
```

### BC44 - Supabase Schema

```
Create Supabase database schema for Beefy Cuts.

Tables:

1. customers
   - id (uuid, pk)
   - name (text)
   - email (text, nullable)
   - phone (text)
   - address (text)
   - suburb (text)
   - frequency (text) -- 'weekly', 'fortnightly', 'monthly'
   - rate (integer) -- price per visit
   - notes (text, nullable)
   - property_data (jsonb, nullable)
   - created_at (timestamp)

2. jobs
   - id (uuid, pk)
   - customer_id (uuid, fk → customers)
   - scheduled_date (date)
   - scheduled_time (text)
   - services (text[])
   - price (integer)
   - status (text) -- 'scheduled', 'completed', 'cancelled'
   - route_order (integer, nullable)
   - notes (text, nullable)
   - completed_at (timestamp, nullable)
   - created_at (timestamp)

3. quotes
   - id (uuid, pk)
   - name (text)
   - phone (text)
   - email (text, nullable)
   - address (text)
   - property_data (jsonb)
   - services (text[])
   - frequency (text)
   - price_min (integer)
   - price_max (integer)
   - status (text) -- 'pending', 'converted', 'declined'
   - created_at (timestamp)

Include RLS policies for authenticated access.
```

---

## Forms & Validation

### BC50 - Quote Request Form

```
Create the quote request form at components/quote/booking-form.tsx

Using react-hook-form + zod:

Schema:
- name: string, min 2 chars, required
- phone: string, min 8 chars, required
- email: string, email format, optional

Form fields:
- Name input
- Phone input
- Email input (optional label)

Submit button: "Request Visit ✓"
Loading state with spinner

On submit, call server action to save to Supabase.
Show toast on success.

Use shadcn/ui Form components.
Tailwind only.
```

### BC51 - Contact Form Server Action

```
Create server action at app/actions/submit-quote.ts

"use server"

Input validation with zod.
Save to Supabase quotes table.
Return { success: boolean, error?: string }

Revalidate path after submission.
Handle errors gracefully.
```

---

## Mobile Responsiveness

### BC60 - Mobile Navigation

```
Update the marketing header for mobile.

Requirements:
- Logo visible on all sizes
- Desktop: horizontal nav links + "My Account" button
- Mobile: hamburger menu button
- Sheet slides in from right with nav items

Use Sheet from shadcn/ui.
Use Menu icon from lucide-react.

Breakpoint: lg (1024px) for desktop nav.
Tailwind only — no custom CSS.
```

### BC61 - Quote Builder Mobile

```
Update the quote builder for mobile responsiveness.

Desktop: Two columns (services + summary)
Mobile: Single column, summary card at bottom

Changes:
- Stack columns on mobile
- Quote summary not sticky on mobile
- Service cards full width
- Frequency picker scrollable if needed

Use responsive Tailwind classes:
- grid-cols-1 lg:grid-cols-[1fr_400px]
- lg:sticky lg:top-5

Ensure touch targets are large enough (min 44px).
```

### BC62 - Admin Mobile Layout

```
Update admin dashboard for mobile/tablet.

Desktop: Sidebar + main content
Tablet: Collapsible sidebar
Mobile: Bottom navigation or hamburger

Changes:
- Sidebar hidden on mobile, accessible via sheet
- Header simplified on mobile
- Job cards stack vertically
- Stats grid: 2 columns on tablet, 1 on mobile

Use Sheet for mobile nav.
Tailwind responsive classes only.
```

---

## Polish & Animation

### BC70 - Page Transitions

```
Add subtle page transitions to the customer site.

Using Tailwind animation utilities:

1. Main content fade-in-up on page load
2. Cards stagger-animate on initial view
3. Quote builder sections animate in sequence

Add to tailwind.config.ts:
- fadeInUp keyframes
- Stagger delay utilities

Apply:
- animate-fade-in-up to main content
- animation-delay-100, 200, etc. for stagger

Keep animations subtle and fast (300-500ms max).
Tailwind only — no custom CSS.
```

### BC71 - Interactive Hover States

```
Add hover states to all interactive elements.

Buttons:
- Lift up 2px on hover
- Shadow increase
- Slight scale on active (press)

Cards:
- Lift up 4px on hover
- Shadow increase to beefy-lg
- Cursor pointer

Service selection:
- Border colour change
- Background tint

Use Tailwind transition utilities:
- transition-all duration-200
- hover:-translate-y-1
- hover:shadow-beefy-lg
- active:translate-y-0

No custom CSS.
```

### BC72 - Loading Skeletons

```
Create loading skeletons for all pages.

Files to create:
- app/(marketing)/loading.tsx
- app/(admin)/loading.tsx
- app/(portal)/account/loading.tsx

Pattern:
- Match layout of actual page
- Use Skeleton component from shadcn
- Rounded corners matching design (rounded-2xl)
- Animate with pulse

Customer site: warm background
Admin: dark background

Example skeleton structure for admin:
- Header skeleton
- Sidebar skeleton
- 4 job card skeletons

Tailwind only.
```

---

## Deployment

### BC80 - Vercel Setup

```
Prepare Beefy Cuts for Vercel deployment.

1. Create vercel.json if needed for rewrites

2. Environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

3. Add to .env.local for local development

4. Configure domains:
   - beefycuts.co.nz (production)
   - Preview deployments for PRs

5. Set up Vercel Analytics (optional)

Follow standard Next.js Vercel deployment process.
```

### BC81 - SEO & Metadata

```
Add SEO metadata to all pages.

Root layout:
- Site name: "Beefy Cuts Dunedin"
- Default description
- OpenGraph image
- Twitter card

Per-page metadata:
- Homepage: "Smart Lawn Quotes in Seconds | Beefy Cuts Dunedin"
- Services: "Our Services | Beefy Cuts Dunedin"
- Account: "My Account | Beefy Cuts"

Use generateMetadata for dynamic pages.

Add:
- robots.txt
- sitemap.xml (via next-sitemap or built-in)
- Favicon (cow emoji or branded icon)

Follow Next.js 14 metadata conventions.
```

---

## Quick Reference

| Task | Prompt | Key Components |
|------|--------|----------------|
| Setup project | BC01, BC02 | Fonts, shadcn |
| Homepage | BC10, BC11, BC12 | Hero, Analysis, Quote |
| Booking | BC13 | Modal, Form |
| Client portal | BC14 | Account cards |
| Admin layout | BC20 | Dark theme, sidebar |
| Admin jobs | BC21, BC22 | Job cards, detail sheet |
| Admin customers | BC23 | Table |
| Admin earnings | BC24 | Stats grid |
| Components | BC30-35 | Logo, badges, inputs |
| Data/API | BC40-44 | Services, pricing, Supabase |
| Forms | BC50-51 | Validation, server actions |
| Mobile | BC60-62 | Responsive layouts |
| Polish | BC70-72 | Animations, skeletons |
| Deploy | BC80-81 | Vercel, SEO |
