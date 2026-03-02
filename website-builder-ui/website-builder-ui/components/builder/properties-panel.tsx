"use client"

import { cn } from "@/lib/utils"
import { X, Palette, AlignLeft, AlignCenter, AlignRight, Box } from "lucide-react"
import type { WebsiteElement } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface PropertiesPanelProps {
  open: boolean
  element: WebsiteElement | null
  onClose: () => void
  onUpdate: (id: string, updates: Partial<WebsiteElement>) => void
}

const bgColors = [
  { value: "bg-background", label: "Default", color: "#0a0a0a" },
  { value: "bg-card", label: "Card", color: "#1f1f1f" },
  { value: "bg-secondary", label: "Secondary", color: "#2e2e2e" },
  { value: "bg-accent/10", label: "Accent Light", color: "#1a3a35" },
]

const alignments = [
  { value: "text-left", icon: AlignLeft, label: "Left" },
  { value: "text-center", icon: AlignCenter, label: "Center" },
  { value: "text-right", icon: AlignRight, label: "Right" },
]

const paddings = [
  { value: "py-8", label: "Small" },
  { value: "py-12", label: "Medium" },
  { value: "py-16", label: "Large" },
  { value: "py-24", label: "Extra Large" },
]

export function PropertiesPanel({ open, element, onClose, onUpdate }: PropertiesPanelProps) {
  if (!element) return null

  const handleStyleUpdate = (key: string, value: string) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        [key]: value,
      },
    })
  }

  return (
    <div
      className={cn(
        "border-l border-border bg-card/50 transition-all duration-300 overflow-hidden",
        open ? "w-72" : "w-0",
      )}
    >
      <div className="w-72 h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground capitalize">{element.type}</h2>
            <p className="text-xs text-muted-foreground">Edit properties</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Background Color */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Palette className="w-4 h-4 text-muted-foreground" />
              Background
            </div>
            <div className="grid grid-cols-4 gap-2">
              {bgColors.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleStyleUpdate("backgroundColor", value)}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all",
                    element.styles.backgroundColor === value
                      ? "border-accent scale-95"
                      : "border-transparent hover:border-muted-foreground/30",
                  )}
                  style={{ backgroundColor: color }}
                  title={label}
                />
              ))}
            </div>
          </div>

          {/* Text Alignment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AlignCenter className="w-4 h-4 text-muted-foreground" />
              Alignment
            </div>
            <div className="flex gap-1">
              {alignments.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => handleStyleUpdate("textAlign", value)}
                  className={cn(
                    "flex-1 p-2 rounded-lg border transition-all",
                    element.styles.textAlign === value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50",
                  )}
                  title={label}
                >
                  <Icon className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Box className="w-4 h-4 text-muted-foreground" />
              Padding
            </div>
            <div className="grid grid-cols-2 gap-2">
              {paddings.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleStyleUpdate("padding", value)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm transition-all",
                    element.styles.padding === value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Fields */}
          {element.content && Object.keys(element.content).length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Content</div>
              {Object.entries(element.content).map(([key, value]) => {
                if (typeof value !== "string") return null
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-xs text-muted-foreground capitalize">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        onUpdate(element.id, {
                          content: {
                            ...element.content,
                            [key]: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
