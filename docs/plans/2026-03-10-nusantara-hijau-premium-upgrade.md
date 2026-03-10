# NusantaraHijau Premium Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform NusantaraHijau into a premium, professional biodiversity atlas with comprehensive real Indonesian species data, fully responsive design (mobile to 4K), realistic 3D-styled interactive map, and modern UI/UX.

**Architecture:**
- Research-based data expansion using verified sources (IUCN Red List, KLHK, LIPI)
- Mobile-first responsive design with container queries and Tailwind breakpoints
- Enhanced D3 map with orthographic projection for 3D globe effect and realistic styling
- Premium UI with glassmorphism, micro-interactions, and professional typography

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, Framer Motion, D3.js (d3-geo, d3-zoom), GSAP

---

## Phase 1: Data Research & Expansion

### Task 1: Research Indonesian Endemic Species

**Research Sources (MUST USE REAL DATA ONLY):**
- IUCN Red List (https://www.iucnredlist.org) - Official conservation status
- KLHK (Kementerian Lingkungan Hidup dan Kehutanan) - Indonesia government data
- LIPI (Lembaga Ilmu Pengetahuan Indonesia) - Scientific references
- CITES database - Protected species list

**Files to Create:**
- `docs/research/species-sources.md` - Document all research sources with URLs
- `docs/research/species-checklist.md` - Checklist of species to add

**Data Requirements (per species):**
```typescript
interface Species {
  id: string;                    // URL-friendly ID
  name: string;                  // Nama umum Indonesia
  latinName: string;             // Nama latin (scientific)
  region: string;                // sumatera | kalimantan | jawa | sulawesi | papua | bali-nusra | maluku
  province: string[];            // Provinsi where found (uppercase, official names)
  provinceMain: string;          // Primary province
  type: "fauna" | "flora";
  status: "kritis" | "terancam" | "rentan";  // IUCN category
  statusEN: "CR" | "EN" | "VU";              // IUCN code
  population: string;            // Population estimate with source
  habitat: string;               // Habitat description
  threat: string;                // Main threats
  description: string;           // Detailed description
  image: string;                 // Path to image
  action: string;                // Conservation action users can take
  funFact: string;               // Interesting fact
  source: string;                // Reference source
  color: string;                 // Brand color for species
}
```

**Species Categories to Research:**

**Mamalia Endemik (Minimum 15 species):**
- Harimau Sumatera (CR)
- Orangutan Sumatera (CR)
- Orangutan Kalimantan (CR)
- Bekantan (EN)
- Lutung Budeng/Popolon (CR)
- Kucing Batu Sumatera (EN)
- Badak Jawa (CR)
- Badak Sumatera (CR)
- Gajah Sumatera (CR)
- Anoa (EN)
- Babirusa (EN)
- Cendrawasih spp. (various)
- Burung Maleo (EN)
- Elang Flores (CR)
- Tarsius spp.

**Flora Endemik (Minimum 15 species):**
- Rafflesia arnoldii (CR)
- Rafflesia patma
- Amorphophallus titanum (EN)
- Pohon Ulin/Eusideroxylon zwageri (VU)
- Damar mata kucing (VU)
- Anggrek bulan (Phalaenopsis amabilis)
- Anggrek hitam (Coelogyne pandurata)
- Kantong semar (Nepenthes spp.)
- Pohon Gaharu (Aquilaria malaccensis) (CR)
- Merbau (Intsia bijuga)
- Ebony (Diospyros spp.)
- Kayu Hitam (Ebenaceae)
- Bunga Bangkai (Amorphophallus titanum)
- Pinang Merah (Cyrtostachys renda)
- Pohon Padus (Prunus padus)

**Step 1: Create research document**

Create `docs/research/species-sources.md`:
```markdown
# Species Data Sources

## Official Sources
1. IUCN Red List - https://www.iucnredlist.org
   - Search by region: Indonesia
   - Filter by: CR, EN, VU status

2. KLHK - https://www.menlhk.go.id
   - Peraturan perlindungan species
   - Statistik keanekaragaman hayati

3. CITES - https://cites.org/eng/resources/species.html
   - Appendix I and II species for Indonesia

## Academic Sources
- LIPI Research Papers
- Indonesian Biodiversity Journal

## Data Verification Required
- [ ] All conservation status must match IUCN 2024
- [ ] Population numbers must have year reference
- [ ] Images must be from Wikimedia Commons or similar open license
```

**Step 2: Search and compile species data**

Run: `npm run research:species` (we'll create this script)
Expected: Compile data from verified sources only

**Step 3: Validate all data has real sources**

Check: Every species entry must have:
- Valid IUCN status with year
- Source URL in `source` field
- Real provinces from official list

**Commit:**
```bash
git add docs/research/
git commit -m "docs: add species research sources and verification checklist"
```

---

### Task 2: Expand species.json with Complete Data

**Files:**
- Modify: `data/species.json`
- Create: `data/species.schema.json` - JSON Schema for validation

**Step 1: Create JSON Schema**

Create `data/species.schema.json`:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "name", "latinName", "region", "province", "type", "status", "statusEN", "description", "image", "source"],
    "properties": {
      "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
      "name": { "type": "string" },
      "latinName": { "type": "string" },
      "region": { "enum": ["sumatera", "kalimantan", "jawa", "sulawesi", "papua", "bali-nusra", "maluku"] },
      "province": { "type": "array", "items": { "type": "string" } },
      "provinceMain": { "type": "string" },
      "type": { "enum": ["fauna", "flora"] },
      "status": { "enum": ["kritis", "terancam", "rentan"] },
      "statusEN": { "enum": ["CR", "EN", "VU"] },
      "population": { "type": "string" },
      "habitat": { "type": "string" },
      "threat": { "type": "string" },
      "description": { "type": "string", "minLength": 100 },
      "image": { "type": "string", "pattern": "^/images/species/" },
      "action": { "type": "string" },
      "funFact": { "type": "string" },
      "source": { "type": "string" },
      "color": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" }
    }
  }
}
```

**Step 2: Expand species data**

Current: ~10 species
Target: Minimum 60 species (30 fauna, 30 flora)

Structure by region:
- Sumatera: 12 species
- Kalimantan: 12 species
- Jawa: 10 species
- Sulawesi: 10 species
- Papua: 10 species
- Bali & Nusa Tenggara: 6 species

**Step 3: Validate JSON against schema**

Install: `npm install -D ajv-cli`
Run: `npx ajv validate -s data/species.schema.json -d data/species.json`
Expected: VALID

**Commit:**
```bash
git add data/species.json data/species.schema.json
git commit -m "data: expand to 60+ species with verified IUCN data and schema validation"
```

---

## Phase 2: Responsive Design System

### Task 3: Create Mobile-First Responsive Breakpoints

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts` (create if doesn't exist)

**Step 1: Add responsive breakpoints to CSS**

Add to `app/globals.css`:
```css
/* ============================================
   RESPONSIVE BREAKPOINTS
   ============================================ */
:root {
  /* Breakpoint reference (Tailwind v4 compatible) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  --breakpoint-3xl: 1920px;
  --breakpoint-4k: 2560px;
}

/* Container queries for component-level responsiveness */
@supports (container-type: inline-size) {
  .container-query {
    container-type: inline-size;
  }
}

/* Mobile-first responsive font sizes */
html {
  font-size: 14px;
}

@media (min-width: 640px) {
  html { font-size: 15px; }
}

@media (min-width: 1024px) {
  html { font-size: 16px; }
}

@media (min-width: 1536px) {
  html { font-size: 17px; }
}

@media (min-width: 2560px) {
  html { font-size: 20px; }
}
```

**Step 2: Create responsive container utilities**

Add to `app/globals.css`:
```css
/* Responsive container padding */
.container-responsive {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container-responsive { padding: 0 1.5rem; max-width: 640px; }
}

@media (min-width: 768px) {
  .container-responsive { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container-responsive { padding: 0 2rem; max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container-responsive { max-width: 1280px; }
}

@media (min-width: 1536px) {
  .container-responsive { max-width: 1440px; }
}

@media (min-width: 1920px) {
  .container-responsive { padding: 0 3rem; max-width: 1600px; }
}

@media (min-width: 2560px) {
  .container-responsive { max-width: 1920px; }
}
```

**Commit:**
```bash
git add app/globals.css
git commit -m "style: add mobile-first responsive breakpoints and fluid typography"
```

---

### Task 4: Responsive Navigation Component

**Files:**
- Modify: `components/Navbar.tsx`

**Step 1: Add mobile hamburger menu**

Implement responsive navbar:
```typescript
// Mobile: Hamburger menu with slide-out drawer
// Tablet: Collapsed menu items
// Desktop: Full horizontal menu
// 4K+: Larger touch targets and spacing
```

**Breakpoints:**
- `< 768px`: Mobile hamburger menu
- `768px - 1024px`: Tablet condensed menu
- `> 1024px`: Full desktop navigation

**Step 2: Add touch-friendly sizes**

```css
/* Mobile touch targets minimum 44x44px */
.nav-link-mobile {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
}
```

**Commit:**
```bash
git add components/Navbar.tsx
git commit -m "feat: implement fully responsive navbar with mobile hamburger menu"
```

---

### Task 5: Responsive Homepage Layout

**Files:**
- Modify: `app/page.tsx`

**Step 1: Hero section responsive**

Mobile (`< 640px`):
- Stack vertically
- Single column
- Smaller typography (text-3xl)
- Full-width CTAs
- Hide decorative elements

Tablet (`640px - 1024px`):
- Two-column where applicable
- Medium typography (text-4xl)
- Side-by-side CTAs

Desktop (`> 1024px`):
- Full layout as current
- Large typography (text-5xl+)
- All decorative elements

4K+ (`> 2560px`):
- Max-width container centered
- Larger spacing (gap-12, p-16)
- Premium feel with more whitespace

**Step 2: Stats section responsive**

Mobile: 2x2 grid
Tablet: 4 columns
Desktop: 4 columns with larger numbers

**Step 3: Featured cards responsive**

Mobile: 1 column
Tablet: 2 columns
Desktop: 3 columns
4K: 4 columns or larger cards

**Commit:**
```bash
git add app/page.tsx
git commit -m "feat: make homepage fully responsive from mobile to 4K displays"
```

---

### Task 6: Responsive Species Pages

**Files:**
- Modify: `app/species/page.tsx`
- Modify: `app/species/[id]/page.tsx`

**Step 1: Species catalog responsive**

Mobile:
- Collapsible filter drawer
- 1 column cards
- Sticky search bar
- Full-width filter chips

Tablet:
- 2 column cards
- Side filter panel

Desktop:
- 3-4 column cards
- Expanded filters

**Step 2: Species detail responsive**

Mobile:
- Image stacked above content
- Accordion sections for details
- Sticky CTA button

Desktop:
- Two-column layout
- Sidebar with quick facts

**Commit:**
```bash
git add app/species/page.tsx app/species/[id]/page.tsx
git commit -m "feat: responsive species catalog and detail pages"
```

---

## Phase 3: Premium UI/UX Enhancements

### Task 7: Remove Dark Mode

**Files:**
- Modify: `app/globals.css` - Remove any dark mode media queries or classes
- Modify: `app/layout.tsx` - Remove dark mode logic
- Search all files for `dark:` classes and remove

**Step 1: Audit and remove dark mode**

Run: `grep -r "dark:" --include="*.tsx" --include="*.css" --include="*.ts" .`
Remove all dark mode variants.

**Step 2: Ensure light-only design**

The app should ONLY have the light nature theme (green/earth tones).

**Commit:**
```bash
git add .
git commit -m "style: remove all dark mode, keep light nature theme only"
```

---

### Task 8: Premium Glassmorphism Design

**Files:**
- Modify: `app/globals.css`

**Step 1: Add glassmorphism utilities**

```css
/* Glassmorphism effects */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.glass-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow:
    0 4px 24px rgba(26, 46, 26, 0.08),
    0 1px 2px rgba(26, 46, 26, 0.04),
    inset 0 1px 0 rgba(255,255,255,0.6);
}
```

**Step 2: Add premium shadows**

```css
/* Premium layered shadows */
.shadow-premium {
  box-shadow:
    0 1px 2px rgba(26, 46, 26, 0.02),
    0 2px 4px rgba(26, 46, 26, 0.02),
    0 4px 8px rgba(26, 46, 26, 0.02),
    0 8px 16px rgba(26, 46, 26, 0.03),
    0 16px 32px rgba(26, 46, 26, 0.04);
}

.shadow-premium-hover {
  box-shadow:
    0 2px 4px rgba(26, 46, 26, 0.02),
    0 4px 8px rgba(26, 46, 26, 0.03),
    0 8px 16px rgba(26, 46, 26, 0.04),
    0 16px 32px rgba(26, 46, 26, 0.06),
    0 32px 64px rgba(26, 46, 26, 0.08);
}
```

**Commit:**
```bash
git add app/globals.css
git commit -m "style: add premium glassmorphism and layered shadow effects"
```

---

### Task 9: Professional Typography System

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Add professional font stack**

```css
/* Premium font stack */
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

/* Import fonts in layout.tsx using next/font */
```

**Step 2: Add typography scale**

```css
/* Professional type scale (1.25 ratio) */
.text-display-xl { font-size: 4.768rem; line-height: 1.1; letter-spacing: -0.03em; }
.text-display { font-size: 3.815rem; line-height: 1.15; letter-spacing: -0.02em; }
.text-h1 { font-size: 3.052rem; line-height: 1.2; letter-spacing: -0.02em; }
.text-h2 { font-size: 2.441rem; line-height: 1.25; letter-spacing: -0.015em; }
.text-h3 { font-size: 1.953rem; line-height: 1.3; letter-spacing: -0.01em; }
.text-h4 { font-size: 1.563rem; line-height: 1.35; }
.text-h5 { font-size: 1.25rem; line-height: 1.4; }
.text-body-lg { font-size: 1.125rem; line-height: 1.6; }
.text-body { font-size: 1rem; line-height: 1.6; }
.text-small { font-size: 0.875rem; line-height: 1.5; }
.text-xs { font-size: 0.75rem; line-height: 1.5; letter-spacing: 0.01em; }
```

**Step 3: Implement with next/font**

Modify `app/layout.tsx`:
```typescript
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
```

**Commit:**
```bash
git add app/layout.tsx app/globals.css
git commit -m "style: implement professional typography system with Inter and Playfair Display"
```

---

### Task 10: Premium Micro-interactions

**Files:**
- Modify: `app/globals.css`

**Step 1: Add smooth transitions**

```css
/* Micro-interaction defaults */
.interactive {
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.15s ease;
}

.interactive:hover {
  transform: translateY(-2px);
}

.interactive:active {
  transform: translateY(0) scale(0.98);
}

/* Magnetic button effect base */
.btn-magnetic {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Step 2: Add focus states**

```css
/* Accessible focus states */
.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.3);
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Commit:**
```bash
git add app/globals.css
git commit -m "style: add premium micro-interactions and accessible focus states"
```

---

## Phase 4: Realistic 3D Map Enhancement

### Task 11: Enhanced D3 Map with 3D Effect

**Files:**
- Modify: `components/InteractiveMap.tsx`
- Modify: `app/globals.css`

**Step 1: Implement orthographic projection for globe effect**

```typescript
// Use orthographic projection for 3D globe appearance
const projection = d3.geoOrthographic()
  .scale(width / 2.5)
  .translate([width / 2, height / 2])
  .center([120, -2]) // Center on Indonesia
  .rotate([-120, 2, 0])
  .clipAngle(90)
```

**Step 2: Add realistic map styling**

```css
/* 3D Map styles */
.map-container {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
  box-shadow:
    inset 0 0 60px rgba(0,0,0,0.1),
    0 20px 60px rgba(26, 46, 26, 0.15);
}

/* Ocean gradient */
.map-ocean {
  fill: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

/* Land with realistic texture */
.map-province {
  fill: url(#landGradient);
  stroke: rgba(255,255,255,0.6);
  stroke-width: 0.5;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.map-province:hover {
  fill: url(#landGradientHover);
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
  transform: translateZ(10px);
}

.map-province.active {
  fill: url(#landGradientActive);
  filter: drop-shadow(0 0 20px rgba(76, 175, 80, 0.4));
}
```

**Step 3: Add SVG gradients for 3D effect**

```typescript
// Add to SVG defs
<defs>
  {/* Land gradient - gives 3D appearance */}
  <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#81c784" />
    <stop offset="50%" stopColor="#66bb6a" />
    <stop offset="100%" stopColor="#4caf50" />
  </linearGradient>

  <linearGradient id="landGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#a5d6a7" />
    <stop offset="50%" stopColor="#81c784" />
    <stop offset="100%" stopColor="#66bb6a" />
  </linearGradient>

  {/* Shadow filter for depth */}
  <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
    <feOffset dx="2" dy="2" result="offsetblur"/>
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.3"/>
    </feComponentTransfer>
    <feMerge>
      <feMergeNode/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
```

**Step 4: Add zoom and pan controls**

```typescript
// Enhanced zoom behavior
const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", (event) => {
    g.attr("transform", event.transform)
  })

// Add zoom controls UI
// + and - buttons
// Reset view button
// Smooth zoom transitions
```

**Commit:**
```bash
git add components/InteractiveMap.tsx app/globals.css
git commit -m "feat: implement realistic 3D-styled interactive map with orthographic projection"
```

---

### Task 12: Map Region Tooltips and Interactions

**Files:**
- Modify: `components/InteractiveMap.tsx`

**Step 1: Add rich tooltips**

```typescript
// Tooltip showing:
// - Region name
// - Number of species in region
// - Preview of endemic species
// - Conservation status summary
```

**Step 2: Add click interactions**

```typescript
// Click province to:
// - Navigate to species page with filter
// - Show detail panel with region info
// - Highlight related species
```

**Commit:**
```bash
git add components/InteractiveMap.tsx
git commit -m "feat: add rich tooltips and province click interactions to map"
```

---

## Phase 5: Animation & Motion

### Task 13: Framer Motion Page Transitions

**Files:**
- Create: `components/PageTransition.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create page transition wrapper**

```typescript
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

**Commit:**
```bash
git add components/PageTransition.tsx app/layout.tsx
git commit -m "feat: add smooth page transition animations with Framer Motion"
```

---

### Task 14: Scroll-Triggered Animations

**Files:**
- Create: `components/ScrollReveal.tsx`
- Modify: `app/page.tsx`

**Step 1: Create scroll reveal component**

```typescript
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up"
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        x: 0
      } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  )
}
```

**Step 2: Apply to homepage sections**

```typescript
<ScrollReveal>
  <StatsSection />
</ScrollReveal>

<ScrollReveal delay={0.1}>
  <MapSection />
</ScrollReveal>
```

**Commit:**
```bash
git add components/ScrollReveal.tsx app/page.tsx
git commit -m "feat: add scroll-triggered reveal animations"
```

---

### Task 15: Staggered Card Animations

**Files:**
- Modify: `app/page.tsx` (Featured Cards)
- Modify: `app/species/page.tsx` (Species Grid)

**Step 1: Add stagger animation to card grids**

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// Usage
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {species.map((s) => (
    <motion.div key={s.id} variants={cardVariants}>
      <SpeciesCard species={s} />
    </motion.div>
  ))}
</motion.div>
```

**Commit:**
```bash
git add app/page.tsx app/species/page.tsx
git commit -m "feat: add staggered card entrance animations"
```

---

## Phase 6: Image Optimization

### Task 16: Responsive Image Component

**Files:**
- Modify: `components/ImageWithFallback.tsx`

**Step 1: Enhance image component with responsive sizes**

```typescript
interface ResponsiveImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
}

// Default sizes for different contexts
const SIZES = {
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  hero: "100vw",
  thumbnail: "(max-width: 640px) 33vw, 96px",
  full: "(max-width: 1920px) 100vw, 1920px",
}
```

**Step 2: Add blur placeholder**

```typescript
// Generate blur data URL or use static placeholder
placeholder="blur"
blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
```

**Commit:**
```bash
git add components/ImageWithFallback.tsx
git commit -m "feat: enhance image component with responsive sizes and blur placeholders"
```

---

### Task 17: Optimize Species Images

**Files:**
- Add: `public/images/species/` - All species images

**Step 1: Image requirements**

- Format: WebP with JPEG fallback
- Sizes: 400x300 (thumbnail), 800x600 (detail), 1200x800 (hero)
- Compression: 80% quality
- Source: Wikimedia Commons (Creative Commons licensed)

**Step 2: Image naming convention**

```
/images/species/
  ├── harimau-sumatera.webp
  ├── harimau-sumatera.jpg (fallback)
  ├── orangutan-sumatera.webp
  └── ...
```

**Commit:**
```bash
git add public/images/species/
git commit -m "assets: add optimized species images in multiple formats"
```

---

## Phase 7: Performance & Testing

### Task 18: Performance Optimization

**Files:**
- Modify: `next.config.ts`

**Step 1: Add performance optimizations**

```typescript
const nextConfig: NextConfig = {
  // ... existing config

  // Enable compression
  compress: true,

  // Optimize fonts
  optimizeFonts: true,

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

**Commit:**
```bash
git add next.config.ts
git commit -m "perf: add performance optimizations and caching headers"
```

---

### Task 19: Add Loading States

**Files:**
- Create: `components/LoadingSpinner.tsx`
- Create: `components/SkeletonCard.tsx`
- Create: `app/loading.tsx`

**Step 1: Create loading components**

```typescript
// Loading spinner with nature theme
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-green-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  )
}

// Skeleton card for species
export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  )
}
```

**Step 2: Add route loading states**

Create `app/loading.tsx`:
```typescript
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
```

**Commit:**
```bash
git add components/LoadingSpinner.tsx components/SkeletonCard.tsx app/loading.tsx
git commit -m "feat: add loading states and skeleton screens"
```

---

## Phase 8: Final Review & Polish

### Task 20: Responsive Testing Checklist

**Test on these viewports:**
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X/11/12)
- [ ] 414px (iPhone Plus/Max)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro / small laptop)
- [ ] 1280px (Desktop)
- [ ] 1440px (Large desktop)
- [ ] 1920px (Full HD)
- [ ] 2560px (4K)

**Checklist per viewport:**
- [ ] Navigation works
- [ ] Text is readable
- [ ] Images scale properly
- [ ] Map is usable
- [ ] Cards layout correctly
- [ ] No horizontal scroll
- [ ] Touch targets > 44px (mobile)

**Commit:**
```bash
git commit -m "test: verify responsive design across all viewports"
```

---

### Task 21: Final Quality Assurance

**Files:**
- All modified files

**Step 1: Run linting**

```bash
npm run lint
```
Expected: No errors

**Step 2: Build check**

```bash
npm run build
```
Expected: Build successful, no TypeScript errors

**Step 3: Lighthouse audit targets**

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

**Commit:**
```bash
git commit -m "chore: final QA, linting and build verification"
```

---

## Summary of Changes

### Data
- Expanded from 10 to 60+ species
- All data verified with real IUCN/KLHK sources
- JSON schema validation added

### Design
- Premium glassmorphism UI
- Professional typography (Inter + Playfair Display)
- Micro-interactions and smooth animations
- Dark mode completely removed

### Responsive
- Mobile-first approach
- 9 breakpoint coverage (320px to 4K)
- Container queries for component flexibility

### Map
- 3D orthographic projection
- Realistic gradients and shadows
- Enhanced zoom and pan controls
- Rich province tooltips

### Performance
- Optimized images with Next.js Image
- Lazy loading and blur placeholders
- Caching headers
- Loading states and skeletons

---

**Next Steps:**
Execute this plan using `superpowers:executing-plans` skill for task-by-task implementation.
