"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { GripVertical, Trash2, Edit3, Move } from "lucide-react"
import { useDroppable } from "@dnd-kit/core"
import { Spinner } from "@/components/ui/spinner"
import type { WebsiteElement, GenerationState } from "@/lib/types"
import { RenderElement } from "@/components/builder/render-element"

interface PreviewPanelProps {
  elements: WebsiteElement[]
  selectedElement: WebsiteElement | null
  onElementSelect: (element: WebsiteElement) => void
  onElementUpdate: (id: string, updates: Partial<WebsiteElement>) => void
  onDeleteElement: (id: string) => void
  onMoveElement: (dragIndex: number, hoverIndex: number) => void
  generationState: GenerationState
  // If provided, the generated HTML will be rendered in an iframe preview
  generatedHtml?: string | null
  error?: string | null
}

export function PreviewPanel({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onDeleteElement,
  onMoveElement,
  generationState,
  generatedHtml,
  error,
}: PreviewPanelProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null) {
      onMoveElement(draggedIndex, dragOverIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="flex-1 overflow-auto bg-background/50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Preview Frame */}
        <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-chart-4/50" />
              <div className="w-3 h-3 rounded-full bg-accent/50" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 bg-input rounded-md text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-accent">🔒</span>
                yourwebsite.com
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div ref={setNodeRef} className={cn("min-h-[500px] relative transition-colors", isOver ? "bg-accent/10" : "bg-background")}>
            {generationState === "generating" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                <div className="text-center space-y-4">
                  <Spinner className="w-12 h-12 text-accent mx-auto" />
                  <p className="text-muted-foreground font-medium">Generating your website...</p>
                </div>
              </div>
            )}
            {/* If the AI returned a complete HTML document, render it directly inside an iframe */}
            {generatedHtml ? (
              <div className="w-full h-[700px] relative group">
                <iframe
                  key={generatedHtml?.slice(0, 64)}
                  className="w-full h-full border-0"
                  title="AI Generated Preview"
                  srcDoc={generatedHtml}
                  onLoad={(e) => {
                    const doc = e.currentTarget.contentDocument
                    if (!doc) return

                    // Inject Styles
                    const link = doc.createElement("link")
                    link.rel = "stylesheet"
                    link.href = "/scripts/edit-mode.css"
                    doc.head.appendChild(link)

                    // Inject Script
                    const script = doc.createElement("script")
                    script.src = "/scripts/edit-mode.js"
                    doc.head.appendChild(script)
                  }}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />

                {/* Hidden Image Input for Iframe Integration */}
                <input
                  type="file"
                  id="integrated-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const iframe = document.querySelector('iframe')
                        iframe?.contentWindow?.postMessage({
                          type: 'IMAGE_SELECTED',
                          url: event.target?.result
                        }, '*')
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />

                <script dangerouslySetInnerHTML={{
                  __html: `
                  window.addEventListener('message', (event) => {
                    if (event.data.type === 'REQUEST_IMAGE_UPLOAD') {
                      document.getElementById('integrated-image-upload').click();
                    }
                  });
                `}} />
              </div>
            ) : (
              <>
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={() => setHoveredElement(element.id)}
                    onMouseLeave={() => setHoveredElement(null)}
                    onClick={() => onElementSelect(element)}
                    className={cn(
                      "relative group cursor-pointer transition-all",
                      selectedElement?.id === element.id && "ring-2 ring-accent ring-inset",
                      hoveredElement === element.id &&
                      selectedElement?.id !== element.id &&
                      "ring-1 ring-accent/50 ring-inset",
                      dragOverIndex === index && "border-t-2 border-accent",
                      draggedIndex === index && "opacity-50",
                    )}
                  >
                    {/* Element Controls */}
                    {(hoveredElement === element.id || selectedElement?.id === element.id) && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                        <button className="p-1.5 bg-card/90 backdrop-blur-sm rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors">
                          <Move className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 bg-card/90 backdrop-blur-sm rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteElement(element.id)
                          }}
                          className="p-1.5 bg-card/90 backdrop-blur-sm rounded-md border border-border text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Drag Handle */}
                    {(hoveredElement === element.id || selectedElement?.id === element.id) && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-card/90 backdrop-blur-sm rounded-md border border-border text-muted-foreground cursor-grab active:cursor-grabbing z-10">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <RenderElement element={element} onUpdate={(updates) => onElementUpdate(element.id, updates)} />
                  </div>
                ))}
              </>)}

            {elements.length === 0 && generationState !== "generating" && (
              <div className="h-[500px] flex items-center justify-center text-muted-foreground p-8">
                {error ? (
                  <div className="text-center space-y-4 max-w-md">
                    <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Generation Failed</h3>
                    <p className="text-destructive font-medium">{error}</p>
                    {error.includes("quota") && (
                      <p className="text-sm bg-muted p-2 rounded border border-border">
                        <strong>Tip:</strong> Your OpenAI API key has run out of credits. Please update it in <code>.env.local</code>.
                      </p>
                    )}
                  </div>
                ) : (
                  <p>Your website preview will appear here</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
