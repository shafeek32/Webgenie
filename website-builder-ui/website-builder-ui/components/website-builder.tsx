"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/builder/header"
import { PromptPanel } from "@/components/builder/prompt-panel"
import { PreviewPanel } from "@/components/builder/preview-panel"
import { ComponentsSidebar } from "@/components/builder/components-sidebar"
import { PropertiesPanel } from "@/components/builder/properties-panel"
import type { WebsiteElement, GenerationState } from "@/lib/types"

const initialElements: WebsiteElement[] = [
  {
    id: "hero",
    type: "hero",
    content: {
      title: "Build faster with AI",
      subtitle: "Create stunning websites in seconds",
      buttonText: "Get Started",
    },
    styles: {
      backgroundColor: "bg-card",
      textAlign: "text-center",
      padding: "py-24",
    },
  },
  {
    id: "features",
    type: "features",
    content: {
      title: "Features",
      items: [
        { title: "AI-Powered", description: "Generate complete websites from text" },
        { title: "Real-time Preview", description: "See changes as you make them" },
        { title: "Drag & Drop", description: "Visual editing made easy" },
      ],
    },
    styles: {
      backgroundColor: "bg-background",
      padding: "py-16",
    },
  },
]

export function WebsiteBuilder() {
  const [prompt, setPrompt] = useState("")
  const [elements, setElements] = useState<WebsiteElement[]>([])
  const [selectedElement, setSelectedElement] = useState<WebsiteElement | null>(null)
  const [generationState, setGenerationState] = useState<GenerationState>("idle")
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    const trimmed = prompt.trim()
    if (!trimmed) return

    setGenerationState("generating")
    setHasGenerated(true)
    setError(null)

    try {
      // Call backend API which invokes the AI model server-side
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || `Server returned ${res.status}`)
      }

      const data = await res.json()
      const html = data?.code
      if (!html) throw new Error("No code returned from generator")

      // Set the generated HTML to be shown in an iframe preview
      setGeneratedHtml(html)
      setElements([])
      setGenerationState("complete")
    } catch (err: any) {
      const msg = err?.message || "Unknown error"
      // Show a user-friendly error via toast
      toast({ title: "Generation failed", description: msg, variant: "destructive" })
      setError(msg)
      setGenerationState("idle")
    }
  }

  const handleDownload = async () => {
    if (!generatedHtml) {
      toast({
        title: "No website to download",
        description: "Please generate a website first before downloading",
      })
      return
    }

    try {
      const zip = new JSZip()

      // Add the main HTML file
      zip.file("index.html", generatedHtml)

      // Create a folder for assets
      const assetsFolder = zip.folder("assets")

      // Add a basic CSS file if needed
      if (assetsFolder) {
        assetsFolder.file("style.css", "/* Add your custom styles here */\nbody { font-family: Arial, sans-serif; }\n");

        // Add a basic JS file if needed
        assetsFolder.file("script.js", "// Add your custom JavaScript here\nconsole.log('Website loaded');\n");
      }

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" })

      // Download the zip file
      saveAs(content, "website.zip")

      toast({
        title: "Download started",
        description: "Your website is being downloaded as a zip file",
      })
    } catch (err: any) {
      toast({
        title: "Download failed",
        description: err?.message || "Unknown error occurred while downloading",
      })
    }
  }

  const handleSaveLayout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pages/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "default-project-id", // Hardcoded for single-tenant, or use real
          pageName: "home",
          components: elements
        })
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Layout Saved", description: "Your page layout has been saved." });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id === "canvas") {
      if (active.data.current?.type === "component-palette-item") {
        handleAddElement(active.data.current.componentType);
      }
    }
  }

  const handleElementSelect = (element: WebsiteElement) => {
    setSelectedElement(element)
    setPropertiesOpen(true)
  }

  const handleElementUpdate = (id: string, updates: Partial<WebsiteElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
    if (selectedElement?.id === id) {
      setSelectedElement((prev) => (prev ? { ...prev, ...updates } : null))
    }
  }

  const handleAddElement = (type: string) => {
    const newElement: WebsiteElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
    }
    setElements((prev) => [...prev, newElement])
  }

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedElement?.id === id) {
      setSelectedElement(null)
      setPropertiesOpen(false)
    }
  }

  const handleMoveElement = (dragIndex: number, hoverIndex: number) => {
    setElements((prev) => {
      const newElements = [...prev]
      const [removed] = newElements.splice(dragIndex, 1)
      newElements.splice(hoverIndex, 0, removed)
      return newElements
    })
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} hasGenerated={hasGenerated} onDownload={handleDownload} onSave={handleSaveLayout} />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex overflow-hidden">
          {/* Components Sidebar */}
          <ComponentsSidebar open={sidebarOpen} onAddElement={handleAddElement} hasGenerated={hasGenerated} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {!hasGenerated ? (
              <PromptPanel
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                generationState={generationState}
              />
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Mini Prompt Bar - Centered Command Bar style */}
                <div className="flex justify-center p-4">
                  <div className="w-full max-w-2xl flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-lg ring-1 ring-accent/5 focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe changes (e.g., 'change hero background to blue')..."
                      className="flex-1 bg-transparent border-none py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleGenerate()
                      }}
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={generationState === "generating"}
                      className="px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-xs font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
                    >
                      {generationState === "generating" ? "Updating..." : "Update"}
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <PreviewPanel
                  elements={elements}
                  selectedElement={selectedElement}
                  onElementSelect={handleElementSelect}
                  onElementUpdate={handleElementUpdate}
                  onDeleteElement={handleDeleteElement}
                  onMoveElement={handleMoveElement}
                  generationState={generationState}
                  generatedHtml={generatedHtml}
                  error={error}
                />
              </div>
            )}
          </div>

          {/* Properties Panel */}
          <PropertiesPanel
            open={propertiesOpen && hasGenerated}
            element={selectedElement}
            onClose={() => setPropertiesOpen(false)}
            onUpdate={handleElementUpdate}
          />
        </div>
      </DndContext>
    </div>
  )
}

function getDefaultContent(type: string) {
  switch (type) {
    case "hero":
      return { title: "New Hero Section", subtitle: "Add your subtitle here", buttonText: "Click Me" }
    case "text":
      return { text: "Add your text content here..." }
    case "image":
      return { src: "/placeholder-image.png", alt: "Placeholder image" }
    case "button":
      return { text: "Button", link: "#" }
    case "form":
      return { fields: ["Name", "Email"], submitText: "Submit" }
    case "features":
      return {
        title: "Features",
        items: [
          { title: "Feature 1", description: "Description here" },
          { title: "Feature 2", description: "Description here" },
        ],
      }
    case "testimonials":
      return {
        title: "What our customers say",
        items: [{ name: "John Doe", role: "CEO", quote: "Amazing product!" }],
      }
    case "pricing":
      return {
        title: "Pricing",
        plans: [
          { name: "Starter", price: "$9", features: ["Feature 1", "Feature 2"] },
          { name: "Pro", price: "$29", features: ["Feature 1", "Feature 2", "Feature 3"] },
        ],
      }
    case "footer":
      return { text: "© 2025 Your Company. All rights reserved." }
    default:
      return {}
  }
}

function getDefaultStyles(type: string) {
  return {
    backgroundColor: type === "hero" ? "bg-card" : "bg-background",
    textAlign: type === "hero" ? "text-center" : "text-left",
    padding: type === "hero" ? "py-24" : "py-12",
  }
}
