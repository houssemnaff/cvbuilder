"use client"

import { forwardRef, useImperativeHandle, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AITextImprover } from "@/components/ui/ai-text-improver"
import type { SectionHandle } from "./section-handle"
import type { PersonalInfo } from "@/lib/services/profile-service"
import { useProfile } from "./profile-provider"

const EMPTY_PERSONAL_INFO: PersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  linkedin: "",
  website: "",
  summary: "",
}

export const ProfileForm = forwardRef<SectionHandle>(function ProfileForm(_props, ref) {
  const { toast } = useToast()
  const { profile, error, savePersonalInfo } = useProfile()
  const [formData, setFormData] = useState<PersonalInfo>(EMPTY_PERSONAL_INFO)

  useEffect(() => {
    if (profile) {
      setFormData(profile.personalInfo)
    }
  }, [profile])

  useImperativeHandle(ref, () => ({
    save: async () => {
      try {
        await savePersonalInfo(formData)
        toast({
          title: "Profil sauvegardé",
          description: "Vos informations personnelles ont été enregistrées.",
        })
      } catch (err) {
        console.error("[ProfileForm] Failed to save:", err)
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : "Impossible de sauvegarder le profil.",
          variant: "destructive",
        })
      }
    },
  }))

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger le profil : {error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Jean"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Dupont"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jean.dupont@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="12 rue de la République"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Paris"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code Postal</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            placeholder="75001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="France"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            placeholder="linkedin.com/in/jeandupont"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Site Web</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="www.monsite.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Résumé Professionnel</Label>
          <AITextImprover
            originalText={formData.summary}
            context="professional summary"
            onApply={(improvedText) => setFormData({ ...formData, summary: improvedText })}
          />
        </div>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="Décrivez votre profil professionnel en quelques phrases..."
          rows={5}
        />
        <p className="text-sm text-muted-foreground">
          Conseil : Décrivez vos compétences clés et objectifs. L'IA pourra reformuler ce texte de manière
          professionnelle.
        </p>
      </div>
    </div>
  )
})
