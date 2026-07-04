"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Sparkles } from "lucide-react"
import { CVPreview } from "@/components/cv/cv-preview"
import { ATSAnalysisDialog } from "@/components/cv/ats-analysis-dialog"
import { CVActions } from "@/components/cv/cv-actions"
import { TEMPLATES } from "@/lib/cv-templates"
import type { ProfileData } from "@/components/cv/cv-preview"
import { useToast } from "@/hooks/use-toast"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

interface CV {
  id: string
  name: string
  templateId: string
  createdAt: string
  updatedAt: string
}

export default function CVViewPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [cv, setCv] = useState<CV | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
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
    },
    experiences: [],
    education: [],
    skills: [],
    languages: [],
  })

  const loadCV = () => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    const savedCvs = localStorage.getItem("user_cvs")
    if (savedCvs) {
      const cvs = JSON.parse(savedCvs)
      const foundCv = cvs.find((c: CV) => c.id === params.id)
      if (foundCv) {
        setCv(foundCv)
      } else {
        router.push("/dashboard/cvs")
      }
    }

    // Load profile data
    const personal = localStorage.getItem("profile_personal")
    const experiences = localStorage.getItem("profile_experiences")
    const education = localStorage.getItem("profile_education")
    const skills = localStorage.getItem("profile_skills")
    const languages = localStorage.getItem("profile_languages")

    setProfileData({
      personal: personal ? JSON.parse(personal) : profileData.personal,
      experiences: experiences ? JSON.parse(experiences) : [],
      education: education ? JSON.parse(education) : [],
      skills: skills ? JSON.parse(skills) : [],
      languages: languages ? JSON.parse(languages) : [],
    })
  }

  useEffect(() => {
    loadCV()
  }, [router, params.id])

  const handleQuickExport = async () => {
    setIsExporting(true)

    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: cv?.templateId,
          profileData,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => null)
        throw new Error(error?.error || "Impossible de générer le PDF")
      }

      const blob = await response.blob()
      const filenameBase = [profileData.personal.firstName, profileData.personal.lastName].filter(Boolean).join("_")
      const filename = filenameBase ? `${filenameBase}_CV.pdf` : `${cv?.name || "CV"}.pdf`

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export réussi",
        description: "Votre CV a été exporté en PDF avec succès.",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      console.error("[PDF Export Error]:", error)

      toast({
        title: "Erreur d'export",
        description: `Impossible d'exporter le PDF: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }







  if (!user || !cv) {
    return null
  }

  const template = TEMPLATES.find((t) => t.id === cv.templateId)

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">{cv.name}</h1>
              <p className="text-sm text-muted-foreground">Modèle : {template?.name}</p>
            </div>
            <div className="flex gap-2">
              <ATSAnalysisDialog cvData={profileData} />
              <Button onClick={handleQuickExport} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Export..." : "Télécharger PDF"}
              </Button>
              <CVActions
                cvId={cv.id}
                cvName={cv.name}
                templateId={cv.templateId}
                profileData={profileData}
                onUpdate={loadCV}
              />
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

          <div className="bg-muted/30 p-8 rounded-lg" id="cv-preview-export">
            <CVPreview templateId={cv.templateId} profileData={profileData} />
          </div>
        </div>
      </main>
    </div>
  )
}
