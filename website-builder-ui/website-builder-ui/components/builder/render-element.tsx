"use client"

import { useState } from "react"
import type { WebsiteElement } from "@/lib/types"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface RenderElementProps {
  element: WebsiteElement
  onUpdate: (updates: Partial<WebsiteElement>) => void
}

export function RenderElement({ element, onUpdate }: RenderElementProps) {
  const [editingField, setEditingField] = useState<string | null>(null)

  const handleTextEdit = (field: string, value: string) => {
    onUpdate({
      content: {
        ...element.content,
        [field]: value,
      },
    })
  }

  const EditableText = ({
    field,
    className,
    as: Component = "span",
  }: {
    field: string
    className?: string
    as?: keyof JSX.IntrinsicElements
  }) => {
    const value = element.content[field] || ""
    const isEditing = editingField === field

    if (isEditing) {
      return (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => handleTextEdit(field, e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => e.key === "Enter" && setEditingField(null)}
          className={cn("bg-transparent border-b-2 border-accent outline-none w-full", className)}
        />
      )
    }

    return (
      <Component
        onDoubleClick={() => setEditingField(field)}
        className={cn("cursor-text hover:bg-accent/10 rounded px-1 -mx-1 transition-colors", className)}
      >
        {value}
      </Component>
    )
  }

  const { styles, content, type } = element
  const baseClasses = cn(styles.backgroundColor, styles.textAlign, styles.padding, "px-8")

  switch (type) {
    case "hero":
      return (
        <div className={cn(baseClasses, "space-y-6")}>
          <EditableText field="title" as="h1" className="text-4xl md:text-5xl font-bold text-foreground" />
          <EditableText field="subtitle" as="p" className="text-xl text-muted-foreground max-w-2xl mx-auto" />
          <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
            <EditableText field="buttonText" />
          </button>
        </div>
      )

    case "features":
      return (
        <div className={cn(baseClasses, "space-y-8")}>
          <EditableText field="title" as="h2" className="text-3xl font-bold text-foreground text-center" />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(content.items || []).map((item: { title: string; description: string }, i: number) => (
              <div key={i} className="p-6 bg-card rounded-xl border border-border space-y-2">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "text":
      return (
        <div className={cn(baseClasses)}>
          <EditableText field="text" as="p" className="text-foreground leading-relaxed" />
        </div>
      )

    case "image":
      return (
        <div className={cn(baseClasses, "flex justify-center")}>
          <img
            src={content.src || "/placeholder.svg"}
            alt={content.alt || "Image"}
            className="rounded-xl max-w-full h-auto border border-border"
          />
        </div>
      )

    case "button":
      return (
        <div className={cn(baseClasses)}>
          <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
            <EditableText field="text" />
          </button>
        </div>
      )

    case "form":
      return (
        <div className={cn(baseClasses, "max-w-md mx-auto")}>
          <div className="space-y-4 p-6 bg-card rounded-xl border border-border">
            {(content.fields || []).map((field: string, i: number) => (
              <div key={i}>
                <label className="block text-sm font-medium text-foreground mb-1">{field}</label>
                <input
                  type="text"
                  placeholder={`Enter ${field.toLowerCase()}`}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>
            ))}
            <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
              {content.submitText || "Submit"}
            </button>
          </div>
        </div>
      )

    case "testimonials":
      return (
        <div className={cn(baseClasses, "space-y-8")}>
          <EditableText field="title" as="h2" className="text-3xl font-bold text-foreground text-center" />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {(content.items || []).map((item: { name: string; role: string; quote: string }, i: number) => (
              <div key={i} className="p-6 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground italic mb-4">"{item.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case "pricing":
      return (
        <div className={cn(baseClasses, "space-y-8")}>
          <EditableText field="title" as="h2" className="text-3xl font-bold text-foreground text-center" />
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {(content.plans || []).map((plan: { name: string; price: string; features: string[] }, i: number) => (
              <div key={i} className="p-6 bg-card rounded-xl border border-border space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="text-3xl font-bold text-accent">
                  {plan.price}
                  <span className="text-sm text-muted-foreground">/mo</span>
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-accent">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      )

    case "footer":
      return (
        <div className={cn(baseClasses, "text-center text-muted-foreground text-sm")}>
          <EditableText field="text" />
        </div>
      )

    default:
      return (
        <div className={cn(baseClasses)}>
          <p className="text-muted-foreground">Unknown element type: {type}</p>
        </div>
      )
  }
}
