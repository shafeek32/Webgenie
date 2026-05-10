"use client"

import { useState } from "react"
import { Sparkles, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/builder/header"
import { PromptPanel } from "@/components/builder/prompt-panel"
import { PreviewPanel } from "@/components/builder/preview-panel"
import { ComponentsSidebar } from "@/components/builder/components-sidebar"
import { PropertiesPanel } from "@/components/builder/properties-panel"
import { ProjectsDialog } from "@/components/builder/projects-dialog"
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
  const [generatedSchema, setGeneratedSchema] = useState<string | null>(null)
  const [generatedApi, setGeneratedApi] = useState<string | null>(null)
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  
  const [history, setHistory] = useState<{
    html: string | null;
    schema: string | null;
    api: string | null;
    categoryId: string | null;
  }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const { toast } = useToast()

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const state = history[newIndex]
      setGeneratedHtml(state.html)
      setGeneratedSchema(state.schema)
      setGeneratedApi(state.api)
      setCurrentCategoryId(state.categoryId)
    } else if (historyIndex === 0) {
      setHistoryIndex(-1)
      setGeneratedHtml(null)
      setGeneratedSchema(null)
      setGeneratedApi(null)
      setCurrentCategoryId(null)
      setHasGenerated(false)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const state = history[newIndex]
      setGeneratedHtml(state.html)
      setGeneratedSchema(state.schema)
      setGeneratedApi(state.api)
      setCurrentCategoryId(state.categoryId)
      setHasGenerated(true)
    }
  }

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
        body: JSON.stringify({ 
          prompt: trimmed,
          currentHtml: generatedHtml || undefined,
          categoryId: currentCategoryId || undefined
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || `Server returned ${res.status}`)
      }

      const data = await res.json()
      const html = data?.code
      const schema = data?.schema
      const api = data?.api

      if (!html) throw new Error("No HTML code returned from generator")

      // Set the generated files
      setGeneratedHtml(html)
      setGeneratedSchema(schema || "// No schema generated")
      setGeneratedApi(api || "// No API generated")
      if (data?.categoryId) {
        setCurrentCategoryId(data.categoryId)
      }

      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push({
          html,
          schema: schema || "// No schema generated",
          api: api || "// No API generated",
          categoryId: data?.categoryId || currentCategoryId
        })
        return newHistory
      })
      setHistoryIndex(prev => prev + 1)

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

      // 1. Frontend: Next.js Pages
      zip.file("app/page.tsx", `export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${generatedHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
  )
}`)
      zip.file("app/layout.tsx", `import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`)
      zip.file("app/globals.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`)

      // 2. Database Schema
      if (generatedSchema && !generatedSchema.includes("No schema")) {
        zip.folder("prisma")?.file("schema.prisma", generatedSchema)
      }

      // 3. Backend API
      if (generatedApi && !generatedApi.includes("No API")) {
        zip.folder("app")?.folder("api")?.folder("data")?.file("route.ts", generatedApi)
      }

      // 4. Configs
      zip.file("package.json", JSON.stringify({
        name: "buildai-generated-app",
        version: "0.1.0",
        private: true,
        scripts: {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "db:push": "prisma db push"
        },
        dependencies: {
          "next": "14.2.5",
          "react": "^18",
          "react-dom": "^18",
          "@prisma/client": "^5.17.0"
        },
        devDependencies: {
          "prisma": "^5.17.0",
          "typescript": "^5",
          "tailwindcss": "^3.4.1",
          "postcss": "^8"
        }
      }, null, 2))

      zip.file("tailwind.config.ts", `import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;`)

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" })

      // Download the zip file
      saveAs(content, "fullstack-project.zip")

      toast({
        title: "Download started",
        description: "Your full-stack project is being downloaded as a zip file",
      })
    } catch (err: any) {
      toast({
        title: "Download failed",
        description: err?.message || "Unknown error occurred while downloading",
      })
    }
  }

  const handleSave = async () => {
    if (!generatedHtml) {
      toast({ title: "Nothing to save", description: "Generate a website first." })
      return
    }

    const projectName = window.prompt("Enter a name for your project:", prompt.slice(0, 30) || "My Project")
    if (!projectName) return

    setIsSaving(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          prompt,
          html: generatedHtml,
          schema: generatedSchema,
          api: generatedApi,
          categoryId: currentCategoryId,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")
      
      toast({ title: "Project saved!", description: "Your website has been saved successfully." })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadProject = (project: any) => {
    setPrompt(project.prompt || "")
    setGeneratedHtml(project.html)
    setGeneratedSchema(project.schema)
    setGeneratedApi(project.api)
    setCurrentCategoryId(project.categoryId)
    setHasGenerated(true)
    setProjectsOpen(false)
    
    // Clear history or set initial history to this project
    setHistory([{
      html: project.html,
      schema: project.schema,
      api: project.api,
      categoryId: project.categoryId
    }])
    setHistoryIndex(0)
    
    toast({ title: "Project loaded", description: `Loaded "${project.name}" successfully.` })
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

  const handleAddElement = (type: string, index?: number) => {
    const newElement: WebsiteElement = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
    }
    setElements((prev) => {
      if (index !== undefined) {
        const newEls = [...prev]
        newEls.splice(index, 0, newElement)
        return newEls
      }
      return [...prev, newElement]
    })
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
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="z-10 bg-background/50 backdrop-blur-xl border-b border-border/50">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          hasGenerated={hasGenerated} 
          onDownload={handleDownload} 
          canUndo={historyIndex >= 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          viewport={viewport}
          setViewport={setViewport}
          onPreview={() => setIsPreviewMode(true)}
          onSave={handleSave}
          isSaving={isSaving}
          onOpenProjects={() => setProjectsOpen(true)}
        />
      </div>

      <div className="flex-1 flex overflow-hidden z-10 relative">
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
                <div className="w-full max-w-2xl flex items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-full px-4 py-2 shadow-2xl ring-1 ring-white/5 focus-within:ring-2 focus-within:ring-accent/50 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
                  <Sparkles className="w-4 h-4 text-accent animate-pulse relative z-10" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe changes (e.g., 'change hero background to blue')..."
                    className="flex-1 bg-transparent border-none py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none relative z-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleGenerate()
                        setPrompt("") // reset after submission
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      handleGenerate()
                      setPrompt("") // reset after submission
                    }}
                    disabled={generationState === "generating"}
                    className="px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-xs font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 relative z-10"
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
                onAddElement={handleAddElement}
                onMoveElement={handleMoveElement}
                generationState={generationState}
                generatedHtml={generatedHtml}
                generatedSchema={generatedSchema}
                generatedApi={generatedApi}
                onCodeUpdate={(type, code) => {
                  if (type === "html") setGeneratedHtml(code)
                  if (type === "schema") setGeneratedSchema(code)
                  if (type === "api") setGeneratedApi(code)
                }}
                error={error}
                viewport={viewport}
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

      {/* Full Screen Preview Mode */}
      {isPreviewMode && (
        <div className="fixed inset-0 z-[100] bg-background">
          <div className="absolute top-4 right-4 z-[101]">
            <Button variant="secondary" size="sm" onClick={() => setIsPreviewMode(false)} className="gap-2 shadow-lg">
              <EyeOff className="w-4 h-4" />
              <span>Exit Preview</span>
            </Button>
          </div>
          <iframe
            className="w-full h-full border-0"
            title="Full Screen Preview"
            srcDoc={generatedHtml || ""}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      )}

      {/* Projects Dialog */}
      <ProjectsDialog 
        open={projectsOpen} 
        onOpenChange={setProjectsOpen} 
        onLoadProject={handleLoadProject} 
      />
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
