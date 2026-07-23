"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, FileUp, Loader2, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "./profile-provider"
import type { Profile } from "@/lib/services/profile-service"

type ExtractedProfile = {
  personalInfo: Omit<Profile["personalInfo"], "photo">
  experiences: Profile["experiences"]
  education: Profile["education"]
  skills: Profile["skills"]
  languages: Profile["languages"]
  projects: Profile["projects"]
}

type Step = "pick" | "loading" | "review" | "applying"

export function ImportCvDialog() {
  const { toast } = useToast()
  const {
    profile,
    savePersonalInfo,
    saveExperiences,
    saveEducation,
    saveSkills,
    saveLanguages,
    saveProjects,
    refresh,
  } = useProfile()

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>("pick")
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [extracted, setExtracted] = useState<ExtractedProfile | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setStep("pick")
    setError(null)
    setExtracted(null)
    setFileName("")
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) reset()
  }

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés.")
      return
    }

    setFileName(file.name)
    setError(null)
    setStep("loading")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/import-cv", { method: "POST", body: formData })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de l'analyse du CV")
      }

      setExtracted(data.profile)
      setStep("review")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'analyse du CV")
      setStep("pick")
    }
  }

  const handleApply = async () => {
    if (!extracted) return
    setStep("applying")

    try {
      // Fusion du bloc personnel : une valeur extraite non vide remplace l'existante,
      // sinon on garde ce que l'utilisateur avait déjà (photo incluse).
      const existing = profile?.personalInfo
      const merged = Object.fromEntries(
        Object.entries(extracted.personalInfo).map(([key, value]) => [
          key,
          value || (existing?.[key as keyof typeof existing] ?? ""),
        ]),
      ) as unknown as Profile["personalInfo"]
      merged.photo = existing?.photo ?? ""

      await savePersonalInfo(merged)
      // Les listes ne sont remplacées que si l'extraction a trouvé quelque chose
      if (extracted.experiences.length > 0) await saveExperiences(extracted.experiences)
      if (extracted.education.length > 0) await saveEducation(extracted.education)
      if (extracted.skills.length > 0) await saveSkills(extracted.skills)
      if (extracted.languages.length > 0) await saveLanguages(extracted.languages)
      if (extracted.projects.length > 0) await saveProjects(extracted.projects)
      await refresh()

      setIsOpen(false)
      toast({
        title: "Profil pré-rempli",
        description: "Vérifiez chaque onglet et corrigez les informations si besoin.",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer le profil")
      setStep("review")
    }
  }

  const fullName = extracted
    ? `${extracted.personalInfo.firstName} ${extracted.personalInfo.lastName}`.trim()
    : ""

  const reviewCounts = extracted
    ? [
        { label: "Expériences", count: extracted.experiences.length },
        { label: "Formations", count: extracted.education.length },
        { label: "Compétences", count: extracted.skills.length },
        { label: "Langues", count: extracted.languages.length },
        { label: "Projets", count: extracted.projects.length },
      ]
    : []

  return (
    <>
      <Button onClick={() => handleOpenChange(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Importer un CV existant
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Importer un CV existant</DialogTitle>
            <DialogDescription>
              Envoyez votre ancien CV en PDF : l'IA en extrait vos informations et pré-remplit votre profil. Vous
              pourrez ensuite tout vérifier et corriger.
            </DialogDescription>
          </DialogHeader>

          {step === "pick" && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/50 hover:bg-accent transition-colors"
              >
                <FileUp className="h-10 w-10" />
                <span className="text-sm font-medium text-foreground">Cliquez pour choisir votre CV (PDF)</span>
                <span className="text-xs">10 Mo maximum — PDF contenant du texte (pas un scan)</span>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                  e.target.value = ""
                }}
              />
              {error && (
                <p className="flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </p>
              )}
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 bg-muted rounded-lg text-center px-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Analyse de « {fileName} » en cours...</p>
              <p className="text-xs text-muted-foreground">
                Extraction du texte puis structuration par l'IA (10-30 secondes)
              </p>
            </div>
          )}

          {(step === "review" || step === "applying") && extracted && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">
                  {fullName || "Nom non détecté"}
                  {extracted.personalInfo.email && (
                    <span className="text-muted-foreground font-normal"> — {extracted.personalInfo.email}</span>
                  )}
                </p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {reviewCounts.map((item) => (
                    <li key={item.label} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 shrink-0" />
                      {item.count} {item.label.toLowerCase()}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                En appliquant, ces informations remplaceront les sections correspondantes de votre profil (votre photo
                est conservée). Vous pourrez ensuite corriger chaque champ dans les onglets du profil.
              </p>

              {error && (
                <p className="flex items-start gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={reset}
                  disabled={step === "applying"}
                  className="bg-transparent w-full sm:w-auto"
                >
                  Choisir un autre fichier
                </Button>
                <Button onClick={handleApply} disabled={step === "applying"} className="w-full sm:w-auto">
                  {step === "applying" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Application...
                    </>
                  ) : (
                    "Appliquer à mon profil"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
