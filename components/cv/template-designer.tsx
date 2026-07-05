"use client"

import { useEffect, useRef, useState } from "react"
import type { Template } from "@pdfme/common"
import { Designer } from "@pdfme/ui"
import { getPlugins } from "@/app/plugins"

interface TemplateDesignerProps {
  initialTemplate: Template
  onSave?: (template: Template) => void
}

// Editable (non-readOnly) text/multiVariableText fields hold a specific user's live data
// (name, contact info, skills, etc.). Strip that back to blank before persisting the layout,
// so the saved template.json stays a reusable, generic layout instead of one person's snapshot.
function stripDynamicContent(template: Template): Template {
  return {
    ...template,
    schemas: template.schemas.map((page) =>
      page.map((schema) => {
        if (schema.readOnly) return schema
        if (schema.type === "text") return { ...schema, content: "" }
        if (schema.type === "multiVariableText") return { ...schema, content: "{}" }
        return schema
      }),
    ),
  }
}

export function TemplateDesigner({ initialTemplate, onSave }: TemplateDesignerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const designerRef = useRef<Designer | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const designer = new Designer({
      domContainer: containerRef.current,
      template: initialTemplate,
      plugins: getPlugins(),
    })
    designerRef.current = designer

    return () => {
      designer.destroy()
      designerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    const designer = designerRef.current
    if (!designer || !onSave) return

    setSaving(true)
    setSaveMessage(null)
    try {
      await onSave(stripDynamicContent(designer.getTemplate() as unknown as Template))
      setSaveMessage("Template sauvegardé.")
    } catch (error) {
      console.error("[TemplateDesigner] Save failed:", error)
      setSaveMessage("Échec de la sauvegarde.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {onSave && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder le template"}
          </button>
          {saveMessage && <span className="text-sm text-slate-500">{saveMessage}</span>}
        </div>
      )}
      <div ref={containerRef} className="min-h-[80vh] w-full flex-1" />
    </div>
  )
}
