"use client"

import { useEffect, useRef, useState } from "react"
import { FileText } from "lucide-react"
import type { Template } from "@/lib/cv-templates"
import { SAMPLE_PROFILE_DATA } from "@/lib/cv-pdf/sample-profile-data"

export function TemplateGalleryPreview({ template }: { template: Template }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!template.available) return

    const controller = new AbortController()

    fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: template.id, profileData: SAMPLE_PROFILE_DATA }),
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("PDF generation failed")
        return response.blob()
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        objectUrlRef.current = url
        setPdfUrl(url)
        setStatus("ready")
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.error("[TemplateGalleryPreview] Failed to generate preview:", error)
        setStatus("error")
      })

    return () => {
      controller.abort()
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [template.available, template.id])

  if (!template.available) {
    return (
      <div className="aspect-[3/4] bg-muted rounded border border-border flex flex-col items-center justify-center gap-2 mb-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Bientôt disponible</span>
      </div>
    )
  }

  if (status === "ready" && pdfUrl) {
    return (
      <div className="aspect-[3/4] bg-muted rounded border border-border overflow-hidden mb-4">
        <iframe src={pdfUrl} title={`Aperçu ${template.name}`} className="h-full w-full border-0" />
      </div>
    )
  }

  return (
    <div className="aspect-[3/4] bg-muted rounded border border-border flex items-center justify-center mb-4">
      <FileText className="h-16 w-16 text-muted-foreground animate-pulse" />
    </div>
  )
}
