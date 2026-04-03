# 🚀 BuildAI – AI-Powered Website Builder

An intelligent, full-stack website builder that generates complete, styled, and interactive websites from plain-English prompts using Groq AI. Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [How It Works – End to End](#how-it-works)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Root Files](#root-files)
6. [app/ – Next.js Routes & Pages](#app--nextjs-routes--pages)
7. [components/ – UI Components](#components--ui-components)
8. [lib/ – Shared Logic & Data](#lib--shared-logic--data)
9. [hooks/ – Custom React Hooks](#hooks--custom-react-hooks)
10. [public/ – Static Assets & Templates](#public--static-assets--templates)
11. [scripts/ – Developer Utilities](#scripts--developer-utilities)
12. [styles/ – Global Styles](#styles--global-styles)
13. [Template Library (80 Templates)](#template-library)
14. [Environment Variables](#environment-variables)
15. [Getting Started](#getting-started)
16. [API Reference](#api-reference)

---

## Overview

BuildAI lets any user describe a website in natural language (e.g., *"Create a website for my Italian restaurant in London"*) and instantly generates a fully functional, beautifully styled HTML web page — complete with custom CSS, animations, and vanilla JavaScript.

### Key Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Generation | Groq `llama-3.1-8b-instant` classifies and generates websites |
| 🎨 80+ Templates | Professionally designed templates for every industry |
| ✏️ Live Editing | Click any element to edit text directly in the preview |
| 🔄 Iterative Updates | Describe changes and the AI updates only what you asked |
| 📥 Export | Download the complete project as a ZIP (HTML + CSS + JS) |
| 💻 Code View | Monaco editor shows the generated HTML code |
| 🌙 Dark Mode | Full dark/light theme support |

---

## How It Works

```
User types prompt → POST /api/generate
         │
         ├──[New generation]──────────────────────────────────────────────┐
         │   Step 1: CLASSIFIER                                           │
         │   ├── Reads lib/categories.json               │
         │   ├── Sends prompt to Groq (llama-3.1-8b-instant)            │
         │   └── Returns a category ID (e.g. "restaurant-fine")         │
         │                                                                │
         │   Step 2: TEMPLATE LOADING                                     │
         │   └── Reads {categoryId}/{categoryId}.html   │
         │                                                                │
         ├──[Update existing]─────────────────────────────────────────────┤
         │   Skips steps 1 & 2, uses currentHtml from request body       │
         │                                                                │
         │   Step 3: AUGMENTATION (both paths)                           │
         │   ├── Sends base template + user prompt to Groq AI            │
         │   ├── AI returns JSON: { html, schema, api }                  │
         │   └── Post-processing:                                         │
         │       ├── Force correct CSS/JS filenames (no 404s)            │
         │       ├── Remove duplicate <base> tags                        │
         │       └── Inject <base href="{id}/"> tag           │
         │                                                                │
         └── Returns { code, schema, api } → rendered in <iframe>
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript + JavaScript |
| Styling | Tailwind CSS v4 |
| AI | Groq SDK (`llama-3.1-8b-instant`) |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| UI Primitives | Radix UI (shadcn/ui) |
| Icons | Lucide React |
| Export | JSZip + FileSaver.js |
| State | React hooks (no external state library) |
| Fonts | Google Fonts (per-template) |

---

## Project Structure

```
website-builder-ui/
├── app/                    # Next.js App Router (pages + API)
│   ├── api/
│   │   └── generate/
│   │       └── route.js    # Core AI generation API endpoint
│   ├── globals.css         # Global Tailwind base styles
│   ├── layout.tsx          # Root HTML layout with theme provider
│   └── page.tsx            # Entry page (renders WebsiteBuilder)
│
├── components/             # All React components
│   ├── website-builder.tsx # 🏠 Main orchestrator component
│   ├── theme-provider.tsx  # Dark/light mode context
│   ├── builder/            # Builder-specific panels
│   │   ├── header.tsx
│   │   ├── prompt-panel.tsx
│   │   ├── preview-panel.tsx
│   │   ├── properties-panel.tsx
│   │   ├── components-sidebar.tsx
│   │   └── render-element.tsx
│   └── ui/                 # shadcn/ui primitives (57 components)
│
├── lib/                    # Shared utilities and data
│   ├── categories.json     # 📋 All 80 template category definitions
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions (cn, etc.)
│
├── hooks/                  # Custom React hooks
│   ├── use-toast.ts        # Toast notification hook
│   └── use-mobile.ts       # Mobile breakpoint detection hook
│
├── public/                 # Static files served at /
│   ├── builder/            # Builder UI assets
│   ├── scripts/            # Public utility scripts
│   └── *.png/svg/jpg       # Placeholder images & icons
│
├── scripts/                # Developer/build utility scripts
│   ├── generate-templates.mjs
│   ├── fix-tailwind-tags.mjs
│   └── organize_templates.ps1
│
├── styles/                 # Additional global styles
│   └── globals.css
│
├── .env.local              # Environment variables (GROQ_API_KEY)
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── components.json         # shadcn/ui component config
```

---

## Root Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies and scripts (`dev`, `build`, `start`, `lint`) |
| `next.config.mjs` | Next.js config (image domains, etc.) |
| `tsconfig.json` | TypeScript project config with path aliases (`@/*`) |
| `postcss.config.mjs` | PostCSS config for Tailwind CSS |
| `components.json` | shadcn/ui configuration (baseColor, cssVariables, etc.) |
| `.env.local` | Local environment variables — never committed. Contains `GROQ_API_KEY` |
| `.gitignore` | Files/folders excluded from git (node_modules, .env.local, .next) |
| `next-env.d.ts` | Auto-generated Next.js TypeScript declarations |
| `example.mjs` | Example/reference script |
| `server.log` | Dev server stdout log |
| `server_debug.log` | Debug-level server log |

---

## `app/` – Next.js Routes & Pages

### `app/layout.tsx`
Root layout. Wraps the entire app in HTML shell, applies global fonts/styles, mounts `ThemeProvider` for dark/light mode.

### `app/page.tsx`
The home route (`/`). Simply renders `<WebsiteBuilder />` — the top-level application component.

### `app/globals.css`
Global CSS with Tailwind base/component/utilities layers, CSS custom properties for theming, and base element resets.

### `app/api/generate/route.js` ⭐ Core API

This is the **brain** of the application. Handles all `POST /api/generate` requests.

**Request body:**
```json
{
  "prompt": "Create a website for my Italian restaurant",
  "currentHtml": "<html>...existing generated HTML...</html>"
}
```
`currentHtml` is optional. If provided, the AI updates the existing website instead of generating from scratch.

**3-Phase Pipeline:**

#### Phase 1 – Classification (skipped if `currentHtml` provided)
- Reads `lib/categories.json` to get all 80 category descriptions
- Sends the user prompt + category list to `llama-3.1-8b-instant` via Groq
- Gets back a category ID string (e.g. `"restaurant-fine"`)

#### Phase 2 – Template Loading (skipped if `currentHtml` provided)
- Reads `public/templates/{categoryId}/{categoryId}.html`
- Falls back to `saas-landing` if the category HTML file doesn't exist

#### Phase 3 – AI Augmentation
- Sends the template HTML + user prompt to Groq with `AUGMENTER_PROMPT`
- Forces `response_format: { type: "json_object" }` to guarantee valid JSON
- AI returns: `{ html, schema, api }`

**Post-processing:**
```
1. Strip markdown code fences if AI wraps JSON in ```json...```
2. Force CSS link: href="*.css" → href="{categoryId}.css"
3. Force JS link:  src="*.js"  → src="{categoryId}.js"
4. Remove duplicate <base> tags
5. Inject: <base href="/templates/{categoryId}/"> after <head>
```

**Response:**
```json
{
  "code": "<complete HTML string>",
  "schema": "Prisma schema definition",
  "api": "Next.js API route code"
}
```

**Prompts used:**

- `CLASSIFIER_PROMPT` – Zero-temperature classification; returns exactly one category ID.
- `AUGMENTER_PROMPT` – Instructs the AI to modify only what the user asked, keep all CSS/JS filenames unchanged, output only JSON, not include any builder UI elements.

---

## `components/` – UI Components

### `components/website-builder.tsx` ⭐ Main Component

The root React component that orchestrates the entire builder UI. Manages all state.

**Key state:**
| State | Type | Purpose |
|-------|------|---------|
| `prompt` | string | Current text in prompt input |
| `generatedHtml` | string | The live HTML being previewed |
| `hasGenerated` | boolean | Whether the first generation happened |
| `isLoading` | boolean | Shows spinner during API call |
| `activePanel` | string | Which panel is active (preview/code/chat) |
| `editableElements` | array | List of text elements in the preview |
| `selectedElement` | object | Currently selected editable element |

**Key functions:**
- `handleGenerate()` – Calls `POST /api/generate`. Sends `currentHtml` if already generated (for updates).
- `handleElementUpdate()` – Updates a specific text element in the live HTML.
- `handleDownload()` – Zips the HTML + CSS + JS (from the template folder) and triggers download.

**Layout:** Three-panel layout:
1. Left sidebar (components/elements)
2. Center (preview iframe or Monaco code editor)
3. Right panel (properties of selected element)

### `components/builder/prompt-panel.tsx`
The initial hero screen shown before the first generation. Contains:
- Large prompt `<textarea>` with suggestions
- Feature highlights (AI Generation, Templates, etc.)
- "Generate Website" button

### `components/builder/preview-panel.tsx`
Renders the generated website inside a sandboxed `<iframe>`. Also:
- Extracts all text nodes from the generated HTML into `editableElements` state
- Injects a click-detection script into the iframe so users can select elements
- Handles incoming `postMessage` events from the iframe to know which element was clicked

### `components/builder/header.tsx`
Top navigation bar of the builder. Shows:
- App logo/name
- Action buttons: Preview/Code view toggle, Download, Share
- Theme toggle (dark/light)

### `components/builder/properties-panel.tsx`
Right-side panel that shows properties of the currently selected element. Allows:
- Editing text content inline
- Changing font size / color (if applicable)

### `components/builder/components-sidebar.tsx`
Left sidebar showing available component categories (Hero, Navbar, Features, etc.). These are currently illustrative/reference items.

### `components/builder/render-element.tsx`
Helper component that renders a single editable element in the properties panel or sidebar.

### `components/theme-provider.tsx`
Wraps the app in `next-themes`'s `ThemeProvider`. Enables system/dark/light mode switching.

### `components/ui/` – 57 shadcn/ui Primitives
Auto-generated Radix UI + Tailwind component library. Includes:
`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`, and more.

---

## `lib/` – Shared Logic & Data

### `lib/categories.json` ⭐ Template Registry

The master list of **80 template categories**. Each entry:
```json
{
  "id": "restaurant-fine",
  "name": "Fine Dining Restaurant",
  "description": "Elegant upscale restaurant website with warm aesthetic..."
}
```
- The `id` must exactly match the folder name in `public/templates/{id}/`
- The `description` is sent to the AI classifier to help it pick the right template
- This file is read every time a new website is generated

**All 80 categories include:**
admin-dashboard, ai-product, architecture, art-gallery, auto-repair, bakery, barber-shop, blog-food, blog-tech, blog-travel, book-author, cleaning-service, cloud-hosting, coffee-shop, community-forum, construction, coworking-space, creative-portfolio, crypto-wallet, cybersecurity, dental-practice, designer-portfolio, developer-portfolio, digital-agency, ecommerce-electronics, ecommerce-fashion, ecommerce-groceries, education-tutor, electrician, environmental, esports-team, event-conference, fashion-magazine, film-studio, financial-consulting, florist, food-delivery, gaming-community, gym-fitness, hotel-booking, hr-recruitment, insurance-agency, interior-design, job-board, kids-education, law-firm, logistic-service, luxury-watches, marketing-agency, medical-clinic, mental-health, mobile-app, music-artist, news-magazine, nft-marketplace, nonprofit, online-course, pet-grooming, photography, plumbing-service, podcast, real-estate, real-estate-luxury, restaurant-fine, saas-landing, solar-energy, spa-wellness, sports, startup-landing, tattoo-studio, tech-portfolio, travel, travel-agency, travel-luxury, vet-clinic, video-portfolio, webapp-dashboard, wedding, wine-cellar, yoga-studio.

### `lib/types.ts`
TypeScript interfaces and type definitions shared across the app (e.g., `EditableElement`, `GeneratedSite`, etc.).

### `lib/utils.ts`
Utility functions. Primarily exports `cn()` — the Tailwind class merge helper using `clsx` + `tailwind-merge`.

---

## `hooks/` – Custom React Hooks

### `hooks/use-toast.ts`
Toast notification system. Manages a queue of toast messages. Used by components to show success/error feedback (e.g., "Website generated!", "Download complete").

### `hooks/use-mobile.ts`
Returns `true` if the current viewport width is below the mobile breakpoint (768px). Used to conditionally render mobile layouts.

---

## `public/` – Static Assets & Templates

### `public/templates/` ⭐ The Template Library

Contains **80 subdirectories**, one per template. Each subdirectory has exactly 3 files:

```
public/templates/{category-id}/
├── {category-id}.html    # Full HTML page (self-contained)
├── {category-id}.css     # All styles for this template
└── {category-id}.js      # All interactivity for this template
```

**How templates are served:**
- Next.js serves the `public/` folder statically at root `/`
- The `<base href="/templates/{id}/">` tag injected by the API makes all relative links like `href="law-firm.css"` resolve to `/templates/law-firm/law-firm.css`
- The iframe in `preview-panel.tsx` renders the final HTML with correct asset paths

**Template quality standards:**
Each template is built with:
- Google Fonts via CDN
- CSS custom properties (no Tailwind inside templates — pure vanilla CSS)
- Vanilla JavaScript (no frameworks inside templates)
- Responsive design
- Animations and micro-interactions (scroll reveal, hover effects, etc.)
- No dependencies on the builder app itself

### `public/builder/`
Assets used in the builder application itself (not templates).

### `public/scripts/`
Public-facing utility JavaScript files.

### Placeholder assets
| File | Use |
|------|-----|
| `placeholder.svg` / `.jpg` | Generic placeholder image |
| `placeholder-image.png` | Larger placeholder image |
| `placeholder-logo.png` / `.svg` | Logo placeholder |
| `placeholder-user.jpg` | User avatar placeholder |
| `icon.svg` | App favicon |
| `apple-icon.png` | iOS home screen icon |
| `icon-dark-32x32.png` | Dark mode favicon |
| `icon-light-32x32.png` | Light mode favicon |

---

## `scripts/` – Developer Utilities

### `scripts/generate-templates.mjs`
Node.js script to batch-generate template stubs. Useful for rapidly scaffolding new template folders with boilerplate HTML/CSS/JS files.

### `scripts/fix-tailwind-tags.mjs`
Utility to scan template HTML files and remove or fix errant Tailwind CDN references. Templates should use vanilla CSS, not Tailwind CDN.

### `scripts/organize_templates.ps1`
PowerShell script to reorganize template files — moves loose HTML files into properly named subdirectories.

---

## `styles/`

### `styles/globals.css`
Additional global styles. Supplements `app/globals.css` where needed.

---

## Template Library

All 80 templates follow the same file structure and design philosophy. Below are the **20 premium templates** added in the latest update, showcasing advanced animation and design techniques:

| Template ID | Name | Unique Features |
|-------------|------|----------------|
| `fashion-magazine` | Fashion Magazine | Custom cursor, animated news ticker, editorial layout |
| `nft-marketplace` | NFT Marketplace | Animated orbs, card stack parallax, stat counters |
| `ai-product` | AI / SaaS Product | Neural network canvas animation, typewriter, pricing |
| `luxury-watches` | Luxury Watch Brand | Live ticking clock hands, parallax hero, gold accents |
| `food-delivery` | Food Delivery App | Phone UI mockup, animated delivery status, category grid |
| `mental-health` | Mental Health & Wellness | Breathing ring animation, wave backgrounds, soft design |
| `film-studio` | Film & Cinema Studio | Film grain texture, filter tabs for projects, award scroll |
| `florist` | Florist & Floral Design | Mouse-parallax petals, bespoke order form, pastel tones |
| `tattoo-studio` | Tattoo Studio | Industrial dark aesthetic, large display type |
| `wine-cellar` | Wine & Fine Dining | Wine bottle cards, burgundy dark theme, member club |
| `esports-team` | Esports Team | Scanline overlay, neon glow, glitch animation, roster |
| `cybersecurity` | Cybersecurity Firm | Matrix rain canvas, live terminal typer, green-on-black |
| `travel-luxury` | Luxury Travel Agency | Cinematic full-bleed hero, exclusive destination cards |
| `solar-energy` | Solar Energy Company | Animated sun & rays canvas, interactive savings calculator |
| `digital-agency` | Digital Creative Agency | Custom cursor, marquee text, counter animation, typewriter |
| `kids-education` | Kids Education Platform | Bouncing mascot, bubble animations, confetti on click |
| `real-estate-luxury` | Luxury Real Estate | Property search widget, dark gold aesthetic, agent bios |
| `book-author` | Book Author / Writer | 3D flipping book cover, event listings, serif typography |
| `cloud-hosting` | Cloud Hosting / DevOps | Animated server rack, particle field, pricing table |
| `art-gallery` | Contemporary Art Gallery | Film noise texture, full-bleed hero artwork, parallax |

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Required: Groq API Key for AI generation
# Get yours free at: https://console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Never commit `.env.local` to version control.** It is already in `.gitignore`.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd website-builder-ui

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create an optimised production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint checks |

---

## API Reference

### `POST /api/generate`

Generates or updates a website.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "string (required) — describe the website you want",
  "currentHtml": "string (optional) — pass the current HTML to update instead of regenerate"
}
```

**Success Response (200):**
```json
{
  "code": "<!DOCTYPE html>...",
  "schema": "model User { id Int @id ... }",
  "api": "export async function GET(req) { ... }"
}
```

**Error Responses:**
| Status | Cause |
|--------|-------|
| 400 | No prompt provided |
| 500 | Missing `GROQ_API_KEY` or server crash |
| 502 | Groq returned empty response |

---

## Architecture Decisions

### Why vanilla CSS/JS in templates?
Templates intentionally avoid frameworks like React or Tailwind inside them. This means:
1. The generated HTML is portable — it works when downloaded and opened directly in a browser
2. The AI can modify it without needing to understand build toolchains
3. Download/export produces a single self-contained project

### Why Groq instead of OpenAI?
Groq's `llama-3.1-8b-instant` model provides extremely fast inference (tokens/second) which is critical for a real-time generation UX. The free tier is generous enough for development.

### Why `<base>` tag injection?
The iframe renders the HTML as a string. Template HTML files use relative paths like `href="law-firm.css"`. Without the `<base>` tag, those paths would resolve against `localhost:3000/` instead of `localhost:3000/templates/law-firm/`. The base tag makes everything resolve correctly.

### Why force CSS/JS filenames post-generation?
The AI sometimes "hallucinates" CSS/JS filenames (e.g., it might reference `sports.css` when the template is `law-firm`). The regex replacements in the API guarantee no 404 errors regardless of what filename the AI emits.

---

*Built with ❤️ using Next.js, Groq AI, and a love for beautiful web design.*
