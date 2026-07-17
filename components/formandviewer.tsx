"use client"

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react"
import Link from "next/link"
import { Pencil, Download } from "lucide-react"
import type { Template } from "@pdfme/common"
import type { Form, Viewer } from "@pdfme/ui"
import { generatePDF, getFontsData } from "@/app/helper"
import { getPlugins } from "@/app/plugins"
import { getErrorMessage } from "@/lib/errors"
import { NavBar, type NavItem } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

type Mode = "form" | "viewer"

interface FormAndViewerProps {
  template: Template
  inputs: Record<string, string>[]
  filename: string
  designerHref?: string
  actions?: ReactNode
}

export function FormAndViewer({ template, inputs, filename, designerHref, actions }: FormAndViewerProps) {
  const { toast } = useToast()
  const uiRef = useRef<HTMLDivElement | null>(null)
  const ui = useRef<Form | Viewer | null>(null)
  const currentInputsRef = useRef<Record<string, string>[]>(inputs)
  const [mode, setMode] = useState<Mode>("viewer")
  const [isGenerating, setIsGenerating] = useState(false)

  const destroyCurrentUi = useCallback(() => {
    if (!ui.current) return
    currentInputsRef.current = ui.current.getInputs?.() ?? currentInputsRef.current
    ui.current.destroy()
    ui.current = null
  }, [])

  useEffect(() => {
    if (!uiRef.current) return

    let cancelled = false

    destroyCurrentUi()

    import("@pdfme/ui").then(({ Form, Viewer }) => {
      if (cancelled || !uiRef.current) return

      ui.current = new (mode === "form" ? Form : Viewer)({
        domContainer: uiRef.current,
        template,
        inputs: currentInputsRef.current,
        options: {
          font: getFontsData(),
        },
        plugins: getPlugins(),
      })
    })

    return () => {
      cancelled = true
      destroyCurrentUi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, template])

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      const pdf = await generatePDF(ui.current)
      if (!pdf) return

      const blob = new Blob([new Uint8Array(pdf)], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (error) {
      console.error("[FormAndViewer] Failed to generate PDF:", error)
      toast({
        title: "Erreur",
        description: `Impossible de générer le PDF: ${getErrorMessage(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const navItems: NavItem[] = [
    ...(designerHref
      ? [
        /*    design i will fix it later
          {
            label: "Design",
            content: (
              <Link
                href={designerHref}
                className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-sm hover:bg-muted"
              >
                <Pencil className="h-3.5 w-3.5" />
                Designer
              </Link>
            ),
          }, */
        ]
      : []),
    {
      label: "Mode",
      content: (
        <div className="flex gap-1">
          {(["viewer", "form"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded px-3 py-1.5 text-sm ${
                mode === item ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
              }`}
            >
              {item === "form" ? "Form" : "Aperçu"}
            </button>
          ))}
        </div>
      ),
    },
    {
      label: "Export",
      content: (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {isGenerating ? "Génération..." : "Générer le PDF"}
          </button>
          {actions}
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <NavBar items={navItems} />
      <div ref={uiRef} className="min-h-[80vh] w-full flex-1" />
    </div>
  )
}

