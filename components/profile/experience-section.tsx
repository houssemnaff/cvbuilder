"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Briefcase } from "lucide-react"
import { AITextImprover } from "@/components/ui/ai-text-improver"
import { AutoSaveIndicator } from "./auto-save-indicator"
import { useAutoSave } from "@/hooks/use-auto-save"
import type { Experience } from "@/lib/services/profile-service"
import { useProfile } from "./profile-provider"

export function ExperienceSection() {
  const { profile, error, saveExperiences: persistExperiences } = useProfile()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (profile) {
      setExperiences(profile.experiences)
      setIsHydrated(true)
    }
  }, [profile])

  const autoSaveStatus = useAutoSave(experiences, persistExperiences, isHydrated)

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setExperiences([...experiences, newExperience])
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger les expériences : {error}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AutoSaveIndicator status={autoSaveStatus} />
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucune expérience ajoutée</p>
        </div>
      )}

      {experiences.map((exp) => (
        <Card key={exp.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">
              {exp.position || "Nouvelle expérience"} {exp.company && `- ${exp.company}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Poste</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                  placeholder="Développeur Full Stack"
                />
              </div>
              <div className="space-y-2">
                <Label>Entreprise</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lieu</Label>
              <Input
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                placeholder="Paris, France"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                  disabled={exp.current}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-sm">
                    Poste actuel
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description et responsabilités</Label>
                <AITextImprover
                  originalText={exp.description}
                  context="professional experience"
                  onApply={(improvedText) => updateExperience(exp.id, "description", improvedText)}
                />
              </div>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                placeholder="Décrivez vos missions, responsabilités et réalisations..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une expérience
      </Button>
    </div>
  )
}
