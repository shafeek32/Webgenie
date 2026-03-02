"use client"

import { cn } from "@/lib/utils"
import {
  Layout,
  Type,
  ImageIcon,
  MousePointer,
  FormInput,
  CreditCard,
  Grid3X3,
  Quote,
  ListTodo,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

interface ComponentsSidebarProps {
  open: boolean
  onAddElement: (type: string) => void
  hasGenerated: boolean
}

const componentGroups = [
  {
    name: "Layout",
    items: [
      { type: "hero", icon: Layout, label: "Hero Section" },
      { type: "features", icon: Grid3X3, label: "Features Grid" },
      { type: "pricing", icon: CreditCard, label: "Pricing Table" },
    ],
  },
  {
    name: "Content",
    items: [
      { type: "text", icon: Type, label: "Text Block" },
      { type: "image", icon: ImageIcon, label: "Image" },
      { type: "testimonials", icon: Quote, label: "Testimonials" },
    ],
  },
  {
    name: "Interactive",
    items: [
      { type: "button", icon: MousePointer, label: "Button" },
      { type: "form", icon: FormInput, label: "Form" },
    ],
  },
  {
    name: "Structure",
    items: [{ type: "footer", icon: ListTodo, label: "Footer" }],
  },
]

export function ComponentsSidebar({ open, onAddElement, hasGenerated }: ComponentsSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Layout", "Content", "Interactive"])

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => (prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]))
  }

  if (!hasGenerated) return null

  return (
    <div
      className={cn(
        "border-r border-border bg-card/50 transition-all duration-300 overflow-hidden",
        open ? "w-64" : "w-0",
      )}
    >
      <div className="w-64 h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Components</h2>
          <p className="text-xs text-muted-foreground mt-1">Drag to add to your page</p>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {componentGroups.map((group) => (
            <div key={group.name} className="mb-2">
              <button
                onClick={() => toggleGroup(group.name)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {group.name}
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", expandedGroups.includes(group.name) && "rotate-180")}
                />
              </button>

              {expandedGroups.includes(group.name) && (
                <div className="space-y-1 mt-1">
                  {group.items.map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => onAddElement(type)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("componentType", type)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors group cursor-grab active:cursor-grabbing"
                    >
                      <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-accent" />
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-xs text-accent font-medium">Pro Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              Double-click any text in the preview to edit it inline.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
