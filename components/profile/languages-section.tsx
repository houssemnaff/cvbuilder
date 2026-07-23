"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Languages } from "lucide-react"
import { AutoSaveIndicator } from "./auto-save-indicator"
import { useAutoSave } from "@/hooks/use-auto-save"
import type { Language } from "@/lib/services/profile-service"
import { useProfile } from "./profile-provider"

const LEVELS = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
  { value: "fluent", label: "Courant" },
  { value: "native", label: "Langue maternelle" },
]

export function LanguagesSection() {
  const { profile, error, saveLanguages: persistLanguages } = useProfile()
  const [languages, setLanguages] = useState<Language[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (profile) {
      setLanguages(profile.languages)
      setIsHydrated(true)
    }
  }, [profile])

  const autoSaveStatus = useAutoSave(languages, persistLanguages, isHydrated)

  const addLanguage = () => {
    const newLanguage: Language = {
      id: crypto.randomUUID(),
      name: "",
      level: "intermediate",
    }
    setLanguages([...languages, newLanguage])
  }

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)))
  }

  const deleteLanguage = (id: string) => {
    setLanguages(languages.filter((lang) => lang.id !== id))
  }

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger les langues : {error}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AutoSaveIndicator status={autoSaveStatus} />
      </div>

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
}
