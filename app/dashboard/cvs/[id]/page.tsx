"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import type { Template } from "@pdfme/common"
import { renderToTemplate } from "@pdfme/jsx"
import { Sparkles } from "lucide-react"
import { FormAndViewer } from "@/components/formandviewer"
import { AcademicTemplate } from "@/components/cv/templates/academic"
import { ModernMinimalTemplate } from "@/components/cv/templates/modern"
import { EuropeanTemplate } from "@/components/cv/templates/european"
import { TwoColumnTemplate } from "@/components/cv/templates/two-column"
import { ATSAnalysisDialog } from "@/components/cv/ats-analysis-dialog"
import { CVActions } from "@/components/cv/cv-actions"
import { TEMPLATES } from "@/lib/cv-templates"
import type { ProfileData } from "@/components/cv/cv-preview"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { authService, type AuthUser } from "@/lib/services/auth-service"
import { cvService, type Cv } from "@/lib/services/cv-service"
import { useProfile } from "@/components/profile/profile-provider"

const CV_TEMPLATE_COMPONENTS: Record<string, (props: { data: ProfileData }) => ReturnType<typeof AcademicTemplate>> = {
  academic: AcademicTemplate,
  "modern-minimal": ModernMinimalTemplate,
  european: EuropeanTemplate,
  "two-column": TwoColumnTemplate,
}

export default function CVViewPage() {
  const router = useRouter()
  const params = useParams()
  const { profile, isLoading: isProfileLoading, error: profileError } = useProfile()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [cv, setCv] = useState<Cv | null>(null)
  const [rendered, setRendered] = useState<{ template: Template; inputs: Record<string, string>[] } | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const profileData: ProfileData | null = useMemo(
    () =>
      profile
        ? {
            personal: profile.personalInfo,
            experiences: profile.experiences,
            education: profile.education,
            skills: profile.skills,
            languages: profile.languages,
            projects: profile.projects,
          }
        : null,
    [profile],
  )

  const loadCV = async () => {
    const currentUser = await authService.getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    const foundCv = await cvService.getCv(params.id as string)
    if (foundCv) {
      setCv(foundCv)
    } else {
      router.push("/dashboard/cvs")
    }
  }

  useEffect(() => {
    loadCV()
  }, [router, params.id])

  useEffect(() => {
    if (!cv || !profileData) return

    const TemplateComponent = CV_TEMPLATE_COMPONENTS[cv.templateId]
    if (!TemplateComponent) {
      setPreviewError("Ce template n'a pas encore été migré vers pdfme.")
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const result = await renderToTemplate(TemplateComponent({ data: profileData }))
        if (!cancelled) setRendered(result)
      } catch (error) {
        if (cancelled) return
        console.error("[CVViewPage] Failed to render template:", error)
        const message = error instanceof Error ? error.message : String(error)
        setPreviewError(`Impossible de préparer l'aperçu : ${message}`)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [cv, profileData])

  if (!user || !cv) {
    return null
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <main className="flex-1 md:ml-64 p-4 pt-20 md:p-8 text-destructive">
          Impossible de charger votre profil : {profileError}
        </main>
      </div>
    )
  }

  if (isProfileLoading || !profileData) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <main className="flex-1 md:ml-64 p-4 pt-20 md:p-8 text-muted-foreground">Chargement de votre profil...</main>
      </div>
    )
  }

  const template = TEMPLATES.find((t) => t.id === cv.templateId)

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 p-4 pt-20 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{cv.name}</h1>
              <p className="text-sm text-muted-foreground">Modèle : {template?.name}</p>
            </div>
            <div className="flex gap-2">
              <ATSAnalysisDialog cvData={profileData} />
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">Conseil professionnel</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez l'analyse ATS pour optimiser votre CV selon l'offre d'emploi visée. Pensez à mettre à jour vos
                informations régulièrement dans votre profil.
              </p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg overflow-hidden" id="cv-preview-export">
            {previewError && (
              <div className="p-8 text-center text-muted-foreground">{previewError}</div>
            )}
            {!previewError && !rendered && (
              <div className="p-8 text-center text-muted-foreground">Chargement de l&apos;aperçu...</div>
            )}
            {!previewError && rendered && (
              <FormAndViewer
                template={rendered.template}
                inputs={rendered.inputs}
                filename={`${cv.name}.pdf`}
                designerHref={`/dashboard/template-designer?cvId=${cv.id}`}
                actions={<CVActions cvId={cv.id} cvName={cv.name} onUpdate={loadCV} />}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
