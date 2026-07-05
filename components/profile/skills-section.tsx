"use client"

import type React from "react"

import { forwardRef, useImperativeHandle, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, X, Wrench } from "lucide-react"
import type { SectionHandle } from "./section-handle"
import { useProfile } from "./profile-provider"

export const SkillsSection = forwardRef<SectionHandle>(function SkillsSection(_props, ref) {
  const { toast } = useToast()
  const { profile, error, saveSkills: persistSkills } = useProfile()
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills)
    }
  }, [profile])

  const saveSkills = async (newSkills: string[]) => {
    setSkills(newSkills)
    try {
      await persistSkills(newSkills)
      toast({
        title: "Compétences sauvegardées",
        description: "Vos compétences ont été enregistrées.",
      })
    } catch (err) {
      console.error("[SkillsSection] Failed to save:", err)
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Impossible de sauvegarder.",
        variant: "destructive",
      })
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      saveSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    saveSkills(skills.filter((s) => s !== skill))
  }

  useImperativeHandle(ref, () => ({
    save: () => saveSkills(skills),
  }))

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger les compétences : {error}</p>
  }

  return (
    <div className="space-y-6">
      {skills.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucune compétence ajoutée</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="newSkill">Ajouter une compétence</Label>
        <div className="flex gap-2">
          <Input
            id="newSkill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: JavaScript, React, Gestion de projet..."
          />
          <Button onClick={addSkill} disabled={!newSkill.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Ajoutez vos compétences techniques, logiciels, langages de programmation, etc.
        </p>
      </div>
    </div>
  )
})
