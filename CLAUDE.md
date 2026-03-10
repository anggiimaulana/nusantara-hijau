# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NusantaraHijau is a Next.js application that serves as an interactive digital atlas of Indonesia's biodiversity. It features an interactive map of Indonesia and a catalog of endemic flora and fauna species with their conservation status.

## Common Commands

```bash
# Development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Animation**: Framer Motion, GSAP
- **Map**: D3-geo (SVG-based interactive map of Indonesia)
- **Icons**: Lucide React

### Directory Structure

```
app/                    # Next.js App Router
├── page.tsx            # Homepage with hero, stats, map preview, featured species
├── layout.tsx          # Root layout with Navbar and Footer
├── globals.css         # Design tokens, utility classes, custom animations
├── species/
│   ├── page.tsx        # Species catalog with filtering/search
│   └── [id]/
│       └── page.tsx    # Dynamic species detail page
├── about/
│   └── page.tsx        # About page
├── contact/
│   └── page.tsx        # Contact page
└── not-found.tsx       # 404 page

components/             # React components
├── Navbar.tsx
├── Footer.tsx
├── InteractiveMap.tsx  # D3-based interactive SVG map of Indonesia
└── ImageWithFallback.tsx

data/
└── species.json        # Static data: array of species with fields:
                       # id, name, latinName, region, province[], type,
                       # status, statusEN, population, habitat, threat,
                       # description, image, action, funFact, source, color

public/
└── images/species/     # Species images referenced in data
└── indonesiaHigh.svg   # SVG map data for provinces
```

### Key Patterns

**Design System (globals.css)**
The app uses CSS custom properties for a consistent green/nature-themed design:
- Background colors: `--bg-base`, `--bg-surface`, `--bg-muted`
- Green palette: `--green-500` (primary) through `--green-700`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`
- Status colors for conservation: `--status-cr`, `--status-en`, `--status-vu`
- Utility classes: `.container-main`, `.card`, `.btn-primary`, `.btn-outline`, `.text-gradient`

**Client Components**
Components using browser APIs or React hooks must use `"use client"` directive:
- `app/page.tsx` - Uses `useState`, `useEffect`, `useRef`, dynamic imports
- `app/species/page.tsx` - Search/filter UI with `useSearchParams`
- `components/InteractiveMap.tsx` - D3 SVG manipulation requiring `window`

**Data Flow**
- Species data is loaded from `data/species.json` via static imports
- No database or API - all data is bundled at build time
- Images are stored in `public/images/species/` and referenced by path in JSON

**Map Implementation**
- `InteractiveMap.tsx` renders an SVG map using D3-geo for projection
- Province data comes from `public/indonesiaHigh.svg`
- Clicking a province filters to show species from that region
- Map must be loaded with `dynamic(() => import(...), { ssr: false })` to avoid server-side rendering issues

**Routing**
- `/` - Homepage
- `/species` - Catalog with search/filter
- `/species/[id]` - Individual species detail (e.g., `/species/harimau-sumatera`)
- `/about` - About page
- `/contact` - Contact page

### TypeScript Configuration
- Path alias `@/*` maps to `./*` for clean imports
- Strict mode enabled
- React 19 types

### Build Configuration
- `next.config.ts`: Configured for Turbopack with `root: __dirname`
- Images: WebP/AVIF formats enabled with custom device sizes
