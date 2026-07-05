"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { TEMPLATES } from "@/lib/cv-templates"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { TemplateGalleryPreview } from "@/components/cv/template-gallery-preview"
import { authService, type AuthUser } from "@/lib/services/auth-service"
import { cvService } from "@/lib/services/cv-service"

const AVAILABLE_TEMPLATES = TEMPLATES.filter((template) => template.available)

export default function NewCVPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
        setIsLoading(false)
      }
    })
  }, [router])

  const createCV = async () => {
    if (!selectedTemplate) return

    const templateName = TEMPLATES.find((t) => t.id === selectedTemplate)?.name
    const newCv = await cvService.createCv(`CV ${templateName}`, selectedTemplate)

    router.push(`/dashboard/cvs/${newCv.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Choisissez un modèle</h1>
            <p className="text-muted-foreground">
              Sélectionnez un template professionnel. Vos informations seront automatiquement appliquées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {AVAILABLE_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <TemplateGalleryPreview template={template} />
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {template.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/dashboard/cvs">
              <Button variant="outline">Annuler</Button>
            </Link>
            <Button onClick={createCV} disabled={!selectedTemplate} size="lg">
              Créer le CV
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
