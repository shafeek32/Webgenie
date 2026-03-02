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

const suggestions = [
  "A SaaS landing page with pricing and testimonials",
  "An e-commerce store for handmade jewelry",
  "A portfolio website for a photographer",
  "A blog platform with dark mode support",
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
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl space-y-8">
        {/* Hero Text */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Website Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Describe your website.
            <br />
            <span className="text-muted-foreground">We'll build it.</span>
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

        {/* Suggestions */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Try these examples:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
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
