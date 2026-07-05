"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Template } from "@pdfme/common"
import { renderToTemplate } from "@pdfme/jsx"
import { TemplateDesigner } from "@/components/cv/template-designer"
import { AcademicTemplate } from "@/components/cv/templates/academic"
import type { ProfileData } from "@/components/cv/cv-preview"
import { cvService } from "@/lib/services/cv-service"
import { useProfile } from "@/components/profile/profile-provider"

const TEMPLATE_ID = "academic"

function applyInputsToTemplate(template: Template, inputs: Record<string, string>[]): Template {
  const values = inputs[0] ?? {}
  return {
    ...template,
    schemas: template.schemas.map((page) =>
      page.map((schema) =>
        schema.name in values ? { ...schema, content: values[schema.name] } : schema,
      ),
    ),
  }
}

export default function TemplateDesignerPage() {
  const searchParams = useSearchParams()
  const cvId = searchParams.get("cvId")
  const { profile, isLoading: isProfileLoading, error: profileErrorMessage } = useProfile()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (profileErrorMessage) {
      setLoadError("Impossible de charger votre profil.")
      return
    }
    if (cvId && isProfileLoading) {
      return
    }

    setTemplate(null)
    setLoadError(null)

    if (cvId) {
      const profileData: ProfileData = {
        personal: profile!.personalInfo,
        experiences: profile!.experiences,
        education: profile!.education,
        skills: profile!.skills,
        languages: profile!.languages,
      }

      cvService
        .getCv(cvId)
        .then(async (cv) => {
          if (!cv || cv.templateId !== TEMPLATE_ID) {
            setLoadError("CV introuvable pour ce template.")
            return
          }

          const [jsxResult, savedLayout] = await Promise.all([
            renderToTemplate(AcademicTemplate({ data: profileData })),
            fetch(`/api/cv-templates/${TEMPLATE_ID}`)
              .then((response) => (response.ok ? (response.json() as Promise<Template>) : null))
              .catch(() => null),
          ])
          const baseTemplate = savedLayout ?? jsxResult.template
          setTemplate(applyInputsToTemplate(baseTemplate, jsxResult.inputs))
        })
        .catch((error) => {
          console.error("[TemplateDesignerPage] Failed to render template:", error)
          setLoadError("Impossible de préparer le template avec vos données.")
        })
      return
    }

    fetch(`/api/cv-templates/${TEMPLATE_ID}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load template")
        return response.json()
      })
      .then((data: Template) => setTemplate(data))
      .catch((error) => {
        console.error("[TemplateDesignerPage] Failed to load template:", error)
        setLoadError("Impossible de charger le template.")
      })
  }, [cvId, profile, isProfileLoading, profileErrorMessage])

  const handleSave = async (updatedTemplate: Template) => {
    const response = await fetch(`/api/cv-templates/${TEMPLATE_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTemplate),
    })

    if (!response.ok) {
      throw new Error("Failed to save template")
    }
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <h1 className="mb-3 text-xl font-semibold">Éditeur de template — CV Académique</h1>
      <p className="mb-3 text-sm text-slate-500">
        Outil de conception (glisser-déposer) basé sur le Designer pdfme.
        {cvId
          ? " Vos propres informations sont affichées ici pour l'édition de mise en page."
          : " Aucun CV sélectionné — un contenu d'exemple est affiché."}
        {" "}Les modifications de mise en page sont sauvegardées dans{" "}
        <code>components/cv/templates/academic.json</code> et n&apos;affectent que la référence de
        mise en page — la génération de PDF réelle reste pilotée par le composant JSX à partir des
        données du profil.
      </p>
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}
      {!loadError && !template && <p className="text-sm text-slate-500">Chargement...</p>}
      {template && <TemplateDesigner initialTemplate={template} onSave={handleSave} />}
    </div>
  )
}
