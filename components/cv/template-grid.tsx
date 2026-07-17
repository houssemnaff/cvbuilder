"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TEMPLATES } from "@/lib/cv-templates"
import { TemplateGalleryPreview } from "@/components/cv/template-gallery-preview"

const AVAILABLE_TEMPLATES = TEMPLATES.filter((template) => template.available)

interface TemplateGridProps {
  /** Destination du bouton "Utiliser ce modèle" (ex. /register en public, /dashboard/cvs/new en connecté). */
  ctaHref: string
}

export function TemplateGrid({ ctaHref }: TemplateGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {AVAILABLE_TEMPLATES.map((template) => (
        <Card key={template.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateGalleryPreview template={template} />
            <div className="flex gap-2 flex-wrap mb-4">
              {template.tags.map((tag) => (
                <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <Link href={ctaHref}>
              <Button className="w-full">Utiliser ce modèle</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
