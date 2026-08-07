"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Braces, FileJson, Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { ProfileForm } from "@/components/profile/profile-form"
import { ExperienceSection } from "@/components/profile/experience-section"
import { EducationSection } from "@/components/profile/education-section"
import { SkillsSection } from "@/components/profile/skills-section"
import { LanguagesSection } from "@/components/profile/languages-section"
import { ProjectSelection } from "@/components/profile/project-selection"
import { ImportCvDialog } from "@/components/profile/import-cv-dialog"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { authService, type AuthUser } from "@/lib/services/auth-service"
import { useProfile } from "@/components/profile/profile-provider"
import type { Profile } from "@/lib/services/profile-service"

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const PHOTO_PLACEHOLDER = "image"

function profileToViewJson(profile: Profile): string {
  const clone = JSON.parse(JSON.stringify(profile)) as Profile
  if (clone.personalInfo.photo) {
    clone.personalInfo.photo = PHOTO_PLACEHOLDER
  }
  return JSON.stringify(clone, null, 2)
}

function mergeSection(existing: unknown, incoming: unknown): unknown {
  if (isPlainObject(existing) && isPlainObject(incoming)) {
    const result: Record<string, unknown> = { ...existing }
    for (const key of Object.keys(incoming)) {
      result[key] = mergeSection(existing[key], incoming[key])
    }
    return result
  }
  return incoming
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
      }
    })
  }, [router])

  const { profile, savePersonalInfo, saveExperiences, saveEducation, saveSkills, saveLanguages, saveProjects } =
    useProfile()
  const [jsonPanel, setJsonPanel] = useState<"view" | "fill" | null>(null)
  const [formJson, setFormJson] = useState("")
  const [pastedJson, setPastedJson] = useState("")
  const [panelError, setPanelError] = useState<string | null>(null)
  const [isFilling, setIsFilling] = useState(false)
  const [copied, setCopied] = useState(false)

  const sectionSavers: Record<string, (data: unknown) => Promise<void>> = {
    personalInfo: savePersonalInfo as (data: unknown) => Promise<void>,
    experiences: saveExperiences as (data: unknown) => Promise<void>,
    education: saveEducation as (data: unknown) => Promise<void>,
    skills: saveSkills as (data: unknown) => Promise<void>,
    languages: saveLanguages as (data: unknown) => Promise<void>,
    projects: saveProjects as (data: unknown) => Promise<void>,
  }

  const openJsonView = () => {
    if (!profile) return
    setFormJson(profileToViewJson(profile))
    setCopied(false)
    setPanelError(null)
    setJsonPanel("view")
  }

  const openJsonFill = () => {
    setPanelError(null)
    setJsonPanel("fill")
  }

  const closeJsonPanel = () => {
    setJsonPanel(null)
    setPanelError(null)
  }

  const copyFormJson = async () => {
    try {
      await navigator.clipboard.writeText(formJson)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setPanelError("Impossible de copier : le presse-papiers n'est pas accessible dans ce navigateur.")
    }
  }

  const fillForm = async () => {
    setPanelError(null)

    let parsed: unknown
    try {
      parsed = JSON.parse(pastedJson)
    } catch (err) {
      setPanelError(
        `JSON invalide : ${err instanceof Error ? err.message : "erreur de syntaxe"}. Vérifiez le format puis réessayez.`,
      )
      return
    }

    if (!isPlainObject(parsed)) {
      setPanelError('Le JSON doit être un objet, par exemple : { "personalInfo": { "firstName": "Jean" } }.')
      return
    }

    if (!profile) {
      setPanelError("Le profil n'est pas encore chargé. Réessayez dans un instant.")
      return
    }

    const recognized = Object.keys(parsed).filter((key) => key in sectionSavers)
    if (recognized.length === 0) {
      setPanelError(`Aucune section reconnue dans le JSON. Clés attendues : ${Object.keys(sectionSavers).join(", ")}.`)
      return
    }

    const arraySections = ["experiences", "education", "skills", "languages", "projects"]
    for (const key of recognized) {
      if (arraySections.includes(key) && !Array.isArray(parsed[key])) {
        setPanelError(`La section « ${key} » doit être un tableau (JSON array).`)
        return
      }
      if (key === "personalInfo" && !isPlainObject(parsed[key])) {
        setPanelError("La section « personalInfo » doit être un objet (JSON object).")
        return
      }
    }

    setIsFilling(true)
    try {
      const applied: Record<string, unknown> = { ...parsed }
      if (isPlainObject(applied.personalInfo) && applied.personalInfo.photo === PHOTO_PLACEHOLDER) {
        applied.personalInfo = { ...applied.personalInfo, photo: profile.personalInfo.photo }
      }
      for (const key of recognized) {
        const merged = mergeSection(profile[key as keyof Profile], applied[key])
        await sectionSavers[key](merged)
      }
      setJsonPanel(null)
      setPastedJson("")
    } catch (err) {
      setPanelError(`Impossible d'enregistrer le formulaire : ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsFilling(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 p-4 pt-20 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">
              Centralisez toutes vos informations ici. Elles seront utilisées pour générer tous vos CV. Vos
              modifications sont enregistrées automatiquement.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" onClick={openJsonView} disabled={!profile}>
              <FileJson className="h-4 w-4 mr-2" />
              Voir / Copier le JSON du formulaire
            </Button>
            <Button variant="outline" onClick={openJsonFill} disabled={!profile}>
              <Braces className="h-4 w-4 mr-2" />
              Remplir le formulaire
            </Button>
          </div>

          {jsonPanel === "view" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>JSON du formulaire</CardTitle>
                <CardDescription>
                  Tous les champs du profil au format JSON (la photo est affichée comme « {PHOTO_PLACEHOLDER} » pour
                  ne pas allonger le texte). Modifiez la zone puis copiez-la, ou conservez-la comme sauvegarde.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={formJson}
                  onChange={(e) => setFormJson(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="font-mono text-xs"
                />
                {panelError && <p className="text-sm text-destructive">{panelError}</p>}
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={copyFormJson} disabled={!formJson}>
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "Copié !" : "Copier"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeJsonPanel} className="bg-transparent">
                    Fermer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {jsonPanel === "fill" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Remplir le formulaire</CardTitle>
                <CardDescription>
                  Collez un JSON (manuel ou généré par IA). Les champs absents du JSON sont conservés tels quels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  placeholder='{ "personalInfo": { "firstName": "Jean", "city": "Paris" }, "skills": ["React", "TypeScript"] }'
                  className="font-mono text-xs"
                />
                {panelError && <p className="text-sm text-destructive">{panelError}</p>}
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={fillForm} disabled={!pastedJson.trim() || isFilling}>
                    {isFilling ? "Remplissage..." : "Remplir le formulaire"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeJsonPanel} className="bg-transparent">
                    Fermer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Choix : import IA d'un ancien CV ou saisie manuelle dans les onglets */}
          <div className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="font-semibold mb-1">Gagnez du temps avec l'IA</h2>
              <p className="text-sm text-muted-foreground">
                Importez votre ancien CV (PDF) : l'IA extrait vos expériences, formations, compétences et projets pour
                pré-remplir votre profil. Ou remplissez simplement les onglets ci-dessous manuellement.
              </p>
            </div>
            <div className="shrink-0">
              <ImportCvDialog />
            </div>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full h-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="experience">Expériences</TabsTrigger>
              <TabsTrigger value="education">Formation</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
              <TabsTrigger value="projects">Projets</TabsTrigger>
              <TabsTrigger value="languages">Langues</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Personnelles</CardTitle>
                  <CardDescription>Vos coordonnées et informations de contact</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Expériences Professionnelles</CardTitle>
                  <CardDescription>Ajoutez vos postes et responsabilités</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExperienceSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Formation</CardTitle>
                  <CardDescription>Vos diplômes et certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <EducationSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Compétences</CardTitle>
                  <CardDescription>Techniques, logiciels, et savoir-faire</CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsSection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projets</CardTitle>
                  <CardDescription>Vos projets personnels ou professionnels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectSelection />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="languages">
              <Card>
                <CardHeader>
                  <CardTitle>Langues</CardTitle>
                  <CardDescription>Langues parlées et niveau de maîtrise</CardDescription>
                </CardHeader>
                <CardContent>
                  <LanguagesSection />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-center">
            <Link href="/dashboard/cvs/new">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Créer un CV
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
