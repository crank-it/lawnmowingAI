# BEEFY CUTS DESIGN SYSTEM
# Paste this into Section 2 of your .cursorrules file

## Project Overview

**Brand**: Beefy Cuts Dunedin  
**Tagline**: Making Dunedin lawns look their best, one cut at a time  
**Business**: Smart lawn service with address-based quoting and property analysis

### Brand Personality
- Friendly and approachable (not corporate)
- Local Dunedin business feel
- Smart/modern (AI property analysis)
- Reliable and trustworthy
- Playful but professional

---

## Typography

### Fonts

| Purpose | Font Family | Category | Style |
|---------|-------------|----------|-------|
| Headings & Brand | Fredoka | display | Rounded, bold, friendly |
| Body Text | Nunito | sans-serif | Warm, readable, modern |
| Monospace (prices) | JetBrains Mono | monospace | Clean price display |

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

### Tailwind Config Addition

```ts
// tailwind.config.ts
theme: {
  extend: {
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
  },
}
```

### Typography Classes

| Element | Classes |
|---------|---------|
| Brand title | `font-heading text-2xl font-bold text-beefy-green` |
| Hero title | `font-heading text-5xl md:text-7xl font-bold text-foreground leading-tight` |
| Section title | `font-heading text-2xl font-semibold text-foreground` |
| Card title | `font-heading text-xl font-semibold text-foreground` |
| Body text | `text-base text-muted-foreground leading-relaxed` |
| Price display | `font-mono text-3xl font-bold text-beefy-green` |
| Small/muted | `text-sm text-muted-foreground` |
| Badge text | `text-xs font-semibold uppercase tracking-wide` |

---

## Colour Palette

### CSS Variables (globals.css)

```css
@layer base {
  :root {
    /* Beefy Cuts Brand Colours */
    --background: 30 33% 96%;          /* #FDF8F3 - warm cream */
    --foreground: 0 0% 10%;            /* #1a1a1a - near black */
    
    --card: 0 0% 100%;                 /* #FFFFFF */
    --card-foreground: 0 0% 10%;
    
    --primary: 130 45% 25%;            /* #2D5A27 - forest green */
    --primary-foreground: 0 0% 100%;
    
    --secondary: 120 30% 94%;          /* #E8F5E9 - light green tint */
    --secondary-foreground: 130 45% 25%;
    
    --muted: 30 20% 92%;               /* #F0EBE3 - warm grey */
    --muted-foreground: 0 0% 40%;      /* #666666 */
    
    --accent: 0 84% 47%;               /* #DC2626 - beefy red (CTA) */
    --accent-foreground: 0 0% 100%;
    
    --destructive: 0 84% 47%;
    --destructive-foreground: 0 0% 100%;
    
    --border: 0 0% 88%;                /* #E0E0E0 */
    --input: 0 0% 88%;
    --ring: 130 45% 25%;               /* forest green focus */
    
    --radius: 1rem;
    
    /* Beefy Cuts Custom Tokens */
    --beefy-green: 130 45% 25%;        /* #2D5A27 - primary brand */
    --beefy-green-light: 122 39% 49%;  /* #4CAF50 - accent green */
    --beefy-red: 0 84% 47%;            /* #DC2626 - CTA red */
    --beefy-red-dark: 0 74% 42%;       /* #B91C1C - hover red */
    --beefy-cream: 30 33% 96%;         /* #FDF8F3 - background */
    --beefy-warm-grey: 30 20% 92%;     /* #F0EBE3 */
  }

  .dark {
    /* Admin Dashboard Dark Theme */
    --background: 0 0% 10%;            /* #1a1a1a */
    --foreground: 0 0% 100%;
    
    --card: 0 0% 13%;                  /* #222222 */
    --card-foreground: 0 0% 100%;
    
    --primary: 122 39% 49%;            /* #4CAF50 */
    --primary-foreground: 0 0% 100%;
    
    --secondary: 0 0% 17%;             /* #2a2a2a */
    --secondary-foreground: 0 0% 67%;
    
    --muted: 0 0% 17%;
    --muted-foreground: 0 0% 53%;      /* #888888 */
    
    --border: 0 0% 20%;                /* #333333 */
    --input: 0 0% 20%;
    --ring: 122 39% 49%;
  }
}
```

### Colour Reference

| Token | Light Hex | Dark Hex | Usage |
|-------|-----------|----------|-------|
| --beefy-green | #2D5A27 | #4CAF50 | Brand identity, headings |
| --beefy-green-light | #4CAF50 | #81C784 | Success states, progress |
| --beefy-red | #DC2626 | #DC2626 | CTA buttons, emphasis |
| --beefy-cream | #FDF8F3 | #1a1a1a | Page backgrounds |
| --foreground | #1a1a1a | #ffffff | Primary text |
| --muted-foreground | #666666 | #888888 | Secondary text |
| --card | #FFFFFF | #222222 | Cards, panels |
| --border | #E0E0E0 | #333333 | Borders, dividers |
| --secondary | #E8F5E9 | #2a2a2a | Subtle backgrounds |

### Gradient Definitions

```tsx
// Customer site background
className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F0EBE3]"

// Primary CTA button gradient
className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C]"

// Green accent gradient (quote display, success)
className="bg-gradient-to-br from-[#2D5A27] to-[#4CAF50]"

// Admin sidebar progress bar
className="bg-gradient-to-r from-[#4CAF50] to-[#81C784]"
```

---

## Components (shadcn/ui)

### Install Command

```bash
npx shadcn@latest add button card input textarea form label select dialog sheet skeleton sonner tabs badge progress separator checkbox radio-group avatar table
```

### Beefy Button Variants

```tsx
// Primary CTA (Red)
<Button className="bg-gradient-to-br from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white font-heading font-bold rounded-xl px-8 py-6 text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg">
  Get Quote →
</Button>

// Secondary (Green outline)
<Button variant="outline" className="border-2 border-beefy-green text-beefy-green hover:bg-beefy-green hover:text-white font-heading font-semibold rounded-xl">
  My Account
</Button>

// Ghost (for navigation)
<Button variant="ghost" className="font-semibold text-muted-foreground hover:text-beefy-green">
  Services
</Button>
```

### Beefy Card Pattern

```tsx
// Standard content card
<Card className="border-0 bg-card rounded-2xl shadow-beefy-sm">
  <CardHeader>
    <CardTitle className="font-heading text-xl font-semibold flex items-center gap-3">
      <span className="text-2xl">🌿</span>
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// Feature card with hover
<Card className="border-0 bg-card rounded-2xl shadow-beefy-sm transition-all hover:-translate-y-1 hover:shadow-beefy-lg">
```

### Beefy Input Pattern

```tsx
<div className="relative">
  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📍</span>
  <Input 
    className="pl-12 py-6 rounded-xl border-0 bg-muted text-lg focus:ring-2 focus:ring-beefy-green/20"
    placeholder="Enter your Dunedin address..."
  />
</div>
```

### Beefy Badge Pattern

```tsx
// Service tag
<Badge className="bg-secondary text-beefy-green font-semibold rounded-full px-3">
  🌿 Mow
</Badge>

// Status: Included
<Badge className="bg-beefy-green text-white text-xs font-bold uppercase">
  Included
</Badge>

// Status: New customer
<Badge className="bg-blue-100 text-blue-700 text-xs font-bold uppercase">
  New
</Badge>

// Status: Next job
<Badge className="bg-orange-100 text-orange-700 text-xs font-bold uppercase">
  Up Next
</Badge>
```

---

## Page-Specific Patterns

### Customer Site Pages

**Layout**: Warm cream gradient, centered content, max-w-6xl container

```tsx
// Marketing layout wrapper
<div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F0EBE3]">
  <nav className="container py-5">...</nav>
  <main className="container py-12">...</main>
  <footer className="border-t border-border/50 py-12">...</footer>
</div>
```

### Admin Dashboard Pages

**Layout**: Dark theme, sidebar + main content, full height

```tsx
// Admin layout wrapper
<div className="min-h-screen bg-background text-foreground dark">
  <header className="border-b border-border px-8 py-5">...</header>
  <div className="flex">
    <aside className="w-60 border-r border-border min-h-[calc(100vh-89px)] p-6">
      ...
    </aside>
    <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-89px)]">
      ...
    </main>
  </div>
</div>
```

---

## Animation Patterns

### Tailwind Animations (add to config)

```ts
// tailwind.config.ts
animation: {
  'fade-in-up': 'fadeInUp 0.6s ease-out',
  'slide-in-right': 'slideInRight 0.3s ease-out',
  'pulse-slow': 'pulse 2s infinite',
  'scan': 'scan 1.5s ease-in-out infinite',
},
keyframes: {
  fadeInUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slideInRight: {
    '0%': { opacity: '0', transform: 'translateX(100%)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  scan: {
    '0%': { top: '0' },
    '100%': { top: '100%' },
  },
}
```

### Usage

```tsx
// Page entrance
<main className="animate-fade-in-up">

// Slide-out panel
<Sheet>
  <SheetContent className="animate-slide-in-right">

// Interactive cards
className="transition-all duration-200 hover:-translate-y-1 hover:shadow-beefy-lg"

// Buttons
className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
```

---

## Icon Usage

Use emojis as primary icons (matches playful brand):

| Context | Emoji |
|---------|-------|
| Brand logo | 🐄 |
| Location | 📍 |
| Lawn/Mowing | 🌿 |
| Edging | ✂️ |
| Hedge | 🌳 |
| Weed spray | 🧪 |
| Leaves | 🍂 |
| Dog cleanup | 🐕 |
| Calendar | 📅 |
| Property | 📐 |
| Gradient/slope | ⛰️ |
| Access | 🚪 |
| Weather | ⛅ |
| Success | 🎉 |
| Satellite/AI | 🛰️ |
| Message | 💬 |
| Phone | 📞 |
| Navigate | 🗺️ |
| Settings | ⚙️ |
| Customers | 👥 |
| Money | 💰 |

For UI controls (close, check, etc.), use Lucide:

```tsx
import { X, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
```

---

## Brand Assets

### Logo Component

```tsx
export function BeefyLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-12 h-12 bg-gradient-to-br from-[#2D5A27] to-[#4CAF50] rounded-xl flex items-center justify-center text-2xl shadow-lg">
        🐄
      </div>
      <div>
        <div className="font-heading text-2xl font-bold text-beefy-green tracking-tight">
          BEEFY CUTS
        </div>
        <div className="text-xs font-semibold text-beefy-green-light tracking-widest">
          DUNEDIN
        </div>
      </div>
    </div>
  )
}
```

---

## Service Data Structure

```ts
interface Service {
  id: string
  name: string
  icon: string
  description: string
  included?: boolean
  priceLabel?: string // e.g., "+$15" or "+$3/m"
}

const services: Service[] = [
  { id: 'mowing', name: 'Lawn Mowing', icon: '🌿', description: 'Full lawn cut to your preferred height', included: true },
  { id: 'edging', name: 'Edge Trimming', icon: '✂️', description: 'Clean edges along paths, gardens & fences', priceLabel: '+$15' },
  { id: 'hedgeTrim', name: 'Hedge Trim', icon: '🌳', description: 'Shape up hedges and shrubs', priceLabel: '+$3/m' },
  { id: 'weedSpray', name: 'Weed Spray', icon: '🧪', description: 'Targeted weed treatment', priceLabel: '+$25' },
  { id: 'leafBlowing', name: 'Leaf Blowing', icon: '🍂', description: 'Clear paths and patio areas', priceLabel: '+$12' },
  { id: 'dogPoo', name: 'Dog Cleanup', icon: '🐕', description: "We'll clear the minefield first", priceLabel: '+$8-18' },
]
```

---

## Do's and Don'ts

### DO ✅
- Use Fredoka for all headings and brand elements
- Use Nunito for body text
- Use emojis as icons for friendly feel
- Use rounded corners everywhere (rounded-xl, rounded-2xl)
- Use the warm cream background for customer pages
- Use dark theme for admin dashboard
- Add hover lift effects on interactive cards
- Keep the CTA button red (stands out from green)
- Use gradient backgrounds for quote displays and success states

### DON'T ❌
- Don't use sharp corners
- Don't use fonts other than Fredoka/Nunito/JetBrains Mono
- Don't use blue for primary actions (green is brand, red is CTA)
- Don't forget hover states
- Don't use generic shadows (use the beefy- shadow tokens)
- Don't mix customer site styling with admin dashboard styling
- Don't use System UI or Inter fonts
