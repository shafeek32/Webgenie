import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, ExternalLink } from "lucide-react"

interface Project {
  id: string
  name: string
  prompt: string
  html: string
  schema: string | null
  api: string | null
  categoryId: string | null
  createdAt: string
}

interface ProjectsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadProject: (project: Project) => void
}

export function ProjectsDialog({ open, onOpenChange, onLoadProject }: ProjectsDialogProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadProjects()
    }
  }, [open])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (err) {
      console.error("Failed to load projects", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this project?")) return
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete project", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>My Projects</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-3">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No saved projects yet.</p>
          ) : (
            projects.map(project => (
              <div 
                key={project.id} 
                onClick={() => onLoadProject(project)}
                className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-accent hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{project.name}</h3>
                  <p className="text-sm text-muted-foreground truncate max-w-md mt-1">
                    {project.prompt || "No prompt provided"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 opacity-70">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={(e) => deleteProject(e, project.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
