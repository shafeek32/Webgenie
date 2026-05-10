"use client"

import {
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Share2,
  Play,
  Undo,
  Redo,
  Eye,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  hasGenerated: boolean
  onDownload?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
  viewport: "desktop" | "tablet" | "mobile"
  setViewport: (viewport: "desktop" | "tablet" | "mobile") => void
  onPreview?: () => void
  onSave?: () => void
  isSaving?: boolean
  onOpenProjects?: () => void
}

export function Header({ sidebarOpen, setSidebarOpen, hasGenerated, onDownload, canUndo, canRedo, onUndo, onRedo, viewport, setViewport, onPreview, onSave, isSaving, onOpenProjects }: HeaderProps) {

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-semibold text-foreground mr-4">BuildAI</span>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hidden sm:flex" onClick={onOpenProjects}>
            My Projects
          </Button>
        </div>

        {hasGenerated && (
          <>
            <div className="h-6 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </Button>

            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {hasGenerated && (
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {[
            { icon: Monitor, value: "desktop" },
            { icon: Tablet, value: "tablet" },
            { icon: Smartphone, value: "mobile" },
          ].map(({ icon: Icon, value }) => (
            <button
              key={value}
              onClick={() => setViewport(value as typeof viewport)}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewport === value ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {hasGenerated && (
          <>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2" onClick={onPreview}>
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2" onClick={onDownload}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2" onClick={onSave} disabled={isSaving}>
              {isSaving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <div className="h-6 w-px bg-border" />
          </>
        )}
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
          <Play className="w-4 h-4" />
          <span>Publish</span>
        </Button>
      </div>
    </header>
  )
}
