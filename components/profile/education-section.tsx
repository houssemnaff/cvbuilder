"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, GraduationCap } from "lucide-react"
import { AITextImprover } from "@/components/ui/ai-text-improver"

interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export function EducationSection() {
  const { toast } = useToast()
  const [educations, setEducations] = useState<Education[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("profile_education")
    if (saved) {
      setEducations(JSON.parse(saved))
    }
  }, [])

  const saveEducations = (newEducations: Education[]) => {
    setEducations(newEducations)
    localStorage.setItem("profile_education", JSON.stringify(newEducations))
    toast({
      title: "Formation sauvegardée",
      description: "Vos diplômes et formations ont été enregistrés.",
    })
  }

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    saveEducations([...educations, newEducation])
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    saveEducations(updated)
  }

  const deleteEducation = (id: string) => {
    saveEducations(educations.filter((edu) => edu.id !== id))
  }

  return (
    <div className="space-y-4">
      {educations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucune formation ajoutée</p>
        </div>
      )}

      {educations.map((edu) => (
        <Card key={edu.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">
              {edu.degree || "Nouvelle formation"} {edu.institution && `- ${edu.institution}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => deleteEducation(edu.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Diplôme / Formation</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                  placeholder="Master en Informatique"
                />
              </div>
              <div className="space-y-2">
                <Label>Établissement</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                  placeholder="Université Paris-Saclay"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lieu</Label>
              <Input
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                placeholder="Paris, France"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description (optionnel)</Label>
                <AITextImprover
                  originalText={edu.description}
                  context="education"
                  onApply={(improvedText) => updateEducation(edu.id, "description", improvedText)}
                />
              </div>
              <Textarea
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                placeholder="Mention, spécialisation, projets notables..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une formation
      </Button>
    </div>
  )
}
