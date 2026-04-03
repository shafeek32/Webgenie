"use client"

import { Sparkles, ArrowRight, Zap, Layers, Wand2, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { GenerationState } from "@/lib/types"

interface PromptPanelProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onGenerate: () => void
  generationState: GenerationState
}

const suggestions: { category: string; items: { label: string; prompt: string }[] }[] = [
  {
    category: "💼 Portfolios",
    items: [
      { label: "💻 Software Engineer", prompt: "A portfolio for a senior software engineer specializing in React and cloud infrastructure" },
      { label: "🎨 UI/UX Designer", prompt: "A stunning portfolio for a UI/UX designer with case studies and animations" },
      { label: "📊 Data Scientist", prompt: "A portfolio for a machine learning engineer with research publications and GitHub projects" },
      { label: "🩺 Doctor", prompt: "A professional medical portfolio for a board-certified cardiologist accepting new patients" },
      { label: "🏛️ Architect", prompt: "A minimalist portfolio for an architect with a full-bleed project gallery and philosophy section" },
      { label: "📸 Photographer", prompt: "A dark, editorial photography portfolio for a documentary and portrait photographer" },
      { label: "⚖️ Lawyer", prompt: "An authoritative legal portfolio for a King's Counsel barrister specialising in commercial litigation" },
      { label: "📈 Finance Analyst", prompt: "A finance portfolio for an investment analyst with track record and published research" },
      { label: "📚 Educator", prompt: "A warm portfolio for a secondary school teacher of mathematics and computer science" },
      { label: "🚀 Marketer", prompt: "A bold marketing portfolio for a brand strategist who has generated $100M+ in revenue" },
      { label: "📄 Resume", prompt: "A printable professional resume with sidebar layout, skills, and dark mode support" },
    ],
  },
  {
    category: "🏢 Business & Services",
    items: [
      { label: "⚡ SaaS Landing", prompt: "A modern SaaS landing page with hero section, pricing tiers, and customer testimonials" },
      { label: "🤖 AI Product", prompt: "A cutting-edge AI product landing page with neural network animation and pricing table" },
      { label: "📦 Startup", prompt: "A bold startup landing page for a new fintech venture seeking seed funding" },
      { label: "📊 Admin Dashboard", prompt: "A sleek admin dashboard with charts, analytics, and data management UI" },
      { label: "🏗️ Construction", prompt: "A professional construction company website with project portfolio and quote request" },
      { label: "🏛️ Law Firm", prompt: "A professional law firm website for a commercial litigation and M&A practice" },
      { label: "💰 Financial Consulting", prompt: "A financial consulting firm website with services, team profiles, and client portal" },
      { label: "📣 Marketing Agency", prompt: "A bold digital marketing agency website with case studies and results" },
      { label: "☁️ Cloud Hosting", prompt: "An enterprise cloud hosting and DevOps platform with pricing and tech stack" },
      { label: "🔒 Cybersecurity", prompt: "A green-on-black cybersecurity firm website with terminal animation and services" },
      { label: "🌱 Digital Agency", prompt: "A sleek black digital creative agency with custom cursor and client work grid" },
    ],
  },
  {
    category: "🍽️ Food & Lifestyle",
    items: [
      { label: "🍷 Fine Dining", prompt: "An elegant fine dining restaurant website with menu, reservations, and gallery" },
      { label: "☕ Coffee Shop", prompt: "A vibrant coffee shop and roastery website with menu and loyalty program" },
      { label: "🥐 Bakery", prompt: "A warm, rustic bakery website with pastry showcase and online order form" },
      { label: "🚗 Food Delivery", prompt: "A food delivery startup app landing page with categories and phone mockup" },
      { label: "🌹 Florist", prompt: "A romantic florist website with floating petal animations and bespoke order form" },
      { label: "🍷 Wine Cellar", prompt: "A sophisticated wine cellar and fine dining site with membership club and dark theme" },
      { label: "💆 Spa & Wellness", prompt: "A relaxing spa and massage therapy website with service menu and booking" },
      { label: "🧘 Yoga Studio", prompt: "A calm and serene yoga studio website with class schedule and membership plans" },
    ],
  },
  {
    category: "🛒 Shopping & Style",
    items: [
      { label: "👗 Fashion Store", prompt: "A stylish online fashion store for premium clothing and accessories" },
      { label: "💎 Jewelry Store", prompt: "A luxury e-commerce store for handmade artisan jewelry with product gallery" },
      { label: "🖥️ Electronics Store", prompt: "A clean electronics e-commerce store for gadgets and consumer tech" },
      { label: "⌚ Luxury Watches", prompt: "An elegant dark luxury watch brand website with animated clock and gold accents" },
      { label: "🛋️ Interior Design", prompt: "A portfolio and service website for a high-end interior design studio" },
      { label: "👒 Fashion Magazine", prompt: "A high-end editorial fashion magazine with animated ticker and luxury typography" },
    ],
  },
  {
    category: "🏥 Health & Education",
    items: [
      { label: "🦷 Dental Practice", prompt: "A clean and trustworthy dental practice website with services and appointment booking" },
      { label: "🏥 Medical Clinic", prompt: "A professional medical clinic website with doctor profiles and online appointments" },
      { label: "🐾 Vet Clinic", prompt: "A friendly veterinary clinic website with pet health services and booking" },
      { label: "🧠 Mental Health", prompt: "A calm mental health and therapy website with breathing animation and counsellor profiles" },
      { label: "📖 Online Course", prompt: "An online learning platform for selling and previewing video courses" },
      { label: "🎓 Kids Learning", prompt: "A fun, colorful kids education platform with subject cards and animated mascot" },
      { label: "🏋️ Gym & Fitness", prompt: "An action-oriented gym and fitness website with class schedule and membership tiers" },
    ],
  },
  {
    category: "🎨 Creative & Culture",
    items: [
      { label: "🎵 Music Artist", prompt: "A media-rich music artist website with tour dates, discography, and merch store" },
      { label: "🎬 Film Studio", prompt: "A cinematic film production studio website with dark hero reel and award showcase" },
      { label: "🖼️ Art Gallery", prompt: "A minimalist contemporary art gallery website with exhibition calendar and full-bleed artworks" },
      { label: "🎙️ Podcast", prompt: "An audio-focused podcast landing page with episodes list and Spotify embed" },
      { label: "✍️ Book Author", prompt: "An elegant author website with animated book cover, event listings, and newsletter" },
      { label: "🎮 Esports Team", prompt: "A high-energy esports team website with neon glow, glitch animation, and match schedule" },
      { label: "🃏 NFT Marketplace", prompt: "A futuristic NFT and digital collectibles marketplace with dark theme and Web3 vibes" },
      { label: "💇 Tattoo Studio", prompt: "A bold tattoo studio website with dark industrial aesthetic and artist portfolios" },
    ],
  },
  {
    category: "🌍 Travel & Real Estate",
    items: [
      { label: "✈️ Travel Agency", prompt: "A travel agency website with destination cards, tour packages, and booking" },
      { label: "🏖️ Luxury Travel", prompt: "An ultra-premium luxury travel concierge website with cinematic hero and exclusive destinations" },
      { label: "🏨 Hotel & Resort", prompt: "A luxury hotel and resort website with room showcase and availability bookings" },
      { label: "🏠 Real Estate", prompt: "A real estate agency website with property listings and agent profiles" },
      { label: "🏢 Luxury Real Estate", prompt: "A prestigious luxury real estate website with gold accents and property search" },
      { label: "🌳 Solar Energy", prompt: "A bright solar energy company website with animated sun and savings calculator" },
    ],
  },
  {
    category: "🔧 Trades & Community",
    items: [
      { label: "🔌 Electrician", prompt: "A professional electrician service website with services, emergency call, and quote form" },
      { label: "🔧 Auto Repair", prompt: "A functional auto repair shop website with service menu and appointment booking" },
      { label: "🤝 Coworking Space", prompt: "A modern coworking space website with desk plans, amenities, and virtual tour" },
      { label: "💼 Job Board", prompt: "A clean job listings platform with filters, company profiles, and apply functionality" },
      { label: "💖 Nonprofit", prompt: "A cause-driven nonprofit website with donation form and impact statistics" },
      { label: "🎉 Event & Conference", prompt: "An event conference website with schedule, speakers, and ticket registration" },
      { label: "💍 Wedding", prompt: "A beautiful wedding invitation website with RSVP, gallery, and venue details" },
      { label: "🐳 Crypto / Web3", prompt: "A modern cryptocurrency and Web3 product site with tokenomics and roadmap" },
    ],
  },
]

const features = [
  { icon: Zap, title: "Instant Generation", desc: "Full-stack in seconds" },
  { icon: Layers, title: "Complete Stack", desc: "Frontend + Backend + DB" },
  { icon: Wand2, title: "AI-Powered", desc: "Smart component design" },
  { icon: Code2, title: "Clean Code", desc: "Production-ready output" },
]

export function PromptPanel({ prompt, setPrompt, onGenerate, generationState }: PromptPanelProps) {
  const isGenerating = generationState === "generating"

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-8 py-12 overflow-y-auto">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Text */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Website Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Describe your website.
            <br />
            <span className="text-muted-foreground">We&apos;ll build it.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty">
            Generate a complete full-stack website from a single text prompt. Customize with drag-and-drop editing.
          </p>
        </div>

        {/* Prompt Input */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative bg-card border border-border rounded-2xl p-2 shadow-2xl shadow-accent/5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-32 bg-transparent resize-none p-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) {
                  onGenerate()
                }
              }}
              suppressHydrationWarning
            />
            <div className="flex items-center justify-between p-2 border-t border-border">
              <span className="text-xs text-muted-foreground px-2">Press ⌘ + Enter to generate</span>
              <Button
                onClick={onGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-6"
              >
                {isGenerating ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Website
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions — grouped by category */}
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground text-center">✨ Pick a category or type your own idea:</p>
          {suggestions.map(({ category, items }) => (
            <div key={category} className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{category}</p>
              <div className="flex flex-wrap gap-2">
                {items.map(({ label, prompt: suggestion }) => (
                  <button
                    key={label}
                    onClick={() => setPrompt(suggestion)}
                    className="px-3 py-1.5 text-sm bg-secondary hover:bg-accent hover:text-accent-foreground text-secondary-foreground rounded-full transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 pb-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center space-y-2 p-4 rounded-xl bg-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-medium text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
