"use client"

import { forwardRef, useImperativeHandle, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Languages } from "lucide-react"
import type { SectionHandle } from "./section-handle"
import type { Language } from "@/lib/services/profile-service"
import { useProfile } from "./profile-provider"

const LEVELS = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
  { value: "fluent", label: "Courant" },
  { value: "native", label: "Langue maternelle" },
]

export const LanguagesSection = forwardRef<SectionHandle>(function LanguagesSection(_props, ref) {
  const { toast } = useToast()
  const { profile, error, saveLanguages: persistLanguages } = useProfile()
  const [languages, setLanguages] = useState<Language[]>([])

  useEffect(() => {
    if (profile) {
      setLanguages(profile.languages)
    }
  }, [profile])

  const saveLanguages = async (newLanguages: Language[]) => {
    setLanguages(newLanguages)
    try {
      await persistLanguages(newLanguages)
      toast({
        title: "Langues sauvegardées",
        description: "Vos langues ont été enregistrées.",
      })
    } catch (err) {
      console.error("[LanguagesSection] Failed to save:", err)
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Impossible de sauvegarder.",
        variant: "destructive",
      })
    }
  }

  const addLanguage = () => {
    const newLanguage: Language = {
      id: crypto.randomUUID(),
      name: "",
      level: "intermediate",
    }
    saveLanguages([...languages, newLanguage])
  }

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    const updated = languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang))
    saveLanguages(updated)
  }

  const deleteLanguage = (id: string) => {
    saveLanguages(languages.filter((lang) => lang.id !== id))
  }

  useImperativeHandle(ref, () => ({
    save: () => saveLanguages(languages),
  }))

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger les langues : {error}</p>
  }

  return (
    <div className="space-y-4">
      {languages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Languages className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucune langue ajoutée</p>
        </div>
      )}

      {languages.map((lang) => (
        <Card key={lang.id}>
          <CardContent className="pt-6">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>Langue</Label>
                <Input
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                  placeholder="Ex: Anglais, Espagnol..."
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Niveau</Label>
                <Select value={lang.level} onValueChange={(value) => updateLanguage(lang.id, "level", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteLanguage(lang.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addLanguage} variant="outline" className="w-full bg-transparent">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une langue
      </Button>
    </div>
  )
})
