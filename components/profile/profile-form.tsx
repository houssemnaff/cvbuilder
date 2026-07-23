"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AITextImprover } from "@/components/ui/ai-text-improver"
import { AutoSaveIndicator } from "./auto-save-indicator"
import { useAutoSave } from "@/hooks/use-auto-save"
import type { PersonalInfo } from "@/lib/services/profile-service"
import { useProfile } from "./profile-provider"
import { uploadImageToCloudinary } from "@/lib/cloudinary"

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
  photo: "",
}

export function ProfileForm() {
  const { toast } = useToast()
  const { profile, error, savePersonalInfo } = useProfile()
  const [formData, setFormData] = useState<PersonalInfo>(EMPTY_PERSONAL_INFO)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData(profile.personalInfo)
      setIsHydrated(true)
    }
  }, [profile])

  const autoSaveStatus = useAutoSave(formData, savePersonalInfo, isHydrated)

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.onload = () => {
        // Redimensionne à 400px max avant l'upload pour limiter le poids envoyé à Cloudinary
        const MAX_SIZE = 400
        const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          async (blob) => {
            if (!blob) return
            setIsUploadingPhoto(true)
            try {
              const url = await uploadImageToCloudinary(blob)
              setFormData((prev) => ({ ...prev, photo: url }))
            } catch (err) {
              console.error("[ProfileForm] Failed to upload photo:", err)
              toast({
                title: "Erreur",
                description: err instanceof Error ? err.message : "Impossible d'envoyer la photo.",
                variant: "destructive",
              })
            } finally {
              setIsUploadingPhoto(false)
            }
          },
          "image/jpeg",
          0.85,
        )
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  if (error) {
    return <p className="text-sm text-destructive">Impossible de charger le profil : {error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <AutoSaveIndicator status={autoSaveStatus} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {formData.photo ? (
          <img
            src={formData.photo}
            alt="Photo de profil"
            className="h-24 w-24 rounded-full object-cover border border-border shrink-0"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="space-y-2 flex-1">
          <Label htmlFor="photo">Photo de profil</Label>
          <Input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            disabled={isUploadingPhoto}
          />
          <p className="text-sm text-muted-foreground">
            {isUploadingPhoto
              ? "Envoi de la photo en cours..."
              : "Utilisée par les templates avec photo (ex. Style Européen). JPEG, PNG ou WEBP, 5 Mo max."}
          </p>
          {formData.photo && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData({ ...formData, photo: "" })}
            >
              Supprimer la photo
            </Button>
          )}
        </div>
      </div>

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
}
