"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, FolderKanban } from "lucide-react"
import { AITextImprover } from "@/components/ui/ai-text-improver"
import { AutoSaveIndicator } from "./auto-save-indicator"
import { useAutoSave } from "@/hooks/use-auto-save"
import type { Project } from "@/lib/services/profile-service"
import { useProfile } from "./profile-provider"

export function ProjectSelection() {
  const { profile, error, saveProjects: persistProjects } = useProfile()
  const [projects, setProjects] = useState<Project[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (profile) {
      setProjects(profile.projects)
      setIsHydrated(true)
    }
  }, [profile])

  const autoSaveStatus = useAutoSave(projects, persistProjects, isHydrated)

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      link: "",
      technologies: "",
      description: "",
    }
    setProjects([...projects, newProject])
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)))
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((proj) => proj.id !== id))
  }

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger les projets : {error}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AutoSaveIndicator status={autoSaveStatus} />
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucun projet ajouté</p>
        </div>
      )}

      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">{project.name || "Nouveau projet"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du projet</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  placeholder="Générateur de CV en ligne"
                />
              </div>
              <div className="space-y-2">
                <Label>Lien (optionnel)</Label>
                <Input
                  value={project.link}
                  onChange={(e) => updateProject(project.id, "link", e.target.value)}
                  placeholder="github.com/user/projet"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies utilisées</Label>
              <Input
                value={project.technologies}
                onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <AITextImprover
                  originalText={project.description}
                  context="project"
                  onApply={(improvedText) => updateProject(project.id, "description", improvedText)}
                />
              </div>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, "description", e.target.value)}
                placeholder="Décrivez le projet, votre rôle et les résultats obtenus..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un projet
      </Button>
    </div>
  )
}
