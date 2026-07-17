"use client"

import { forwardRef, useImperativeHandle, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, FolderKanban } from "lucide-react"
import { AITextImprover } from "@/components/ui/ai-text-improver"
import type { SectionHandle } from "./section-handle"
import type { Project } from "@/lib/services/profile-service"
import { useProfile } from "./profile-provider"

export const ProjectSelection = forwardRef<SectionHandle>(function ProjectSelection(_props, ref) {
  const { toast } = useToast()
  const { profile, error, saveProjects: persistProjects } = useProfile()
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (profile) {
      setProjects(profile.projects)
    }
  }, [profile])

  const saveProjects = async (newProjects: Project[], silent = false) => {
    setProjects(newProjects)
    try {
      await persistProjects(newProjects)
      if (!silent) {
        toast({
          title: "Projets sauvegardés",
          description: "Vos projets ont été enregistrés.",
        })
      }
    } catch (err) {
      console.error("[ProjectSelection] Failed to save:", err)
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Impossible de sauvegarder.",
        variant: "destructive",
      })
    }
  }

  useImperativeHandle(ref, () => ({
    save: () => saveProjects(projects),
  }))

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: "",
      link: "",
      technologies: "",
      description: "",
    }
    saveProjects([...projects, newProject], true)
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updated = projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
    saveProjects(updated, true)
  }

  const deleteProject = (id: string) => {
    saveProjects(
      projects.filter((proj) => proj.id !== id),
      true,
    )
  }

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger les projets : {error}</p>
  }

  return (
    <div className="space-y-4">
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
})
