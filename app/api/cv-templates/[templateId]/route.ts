import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

export const runtime = "nodejs"

const ALLOWED_TEMPLATE_IDS = new Set(["academic"])

function resolveTemplatePath(templateId: string) {
  if (!ALLOWED_TEMPLATE_IDS.has(templateId)) {
    return null
  }
  return path.join(process.cwd(), "components", "cv", "templates", `${templateId}.json`)
}

export async function GET(_request: Request, { params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params
  const filePath = resolveTemplatePath(templateId)

  if (!filePath) {
    return Response.json({ error: "Unknown template id" }, { status: 404 })
  }

  try {
    const content = await readFile(filePath, "utf-8")
    return new Response(content, { headers: { "Content-Type": "application/json" } })
  } catch (error) {
    console.error("[cv-templates GET] Failed to read template:", error)
    return Response.json({ error: "Template not found" }, { status: 404 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params
  const filePath = resolveTemplatePath(templateId)

  if (!filePath) {
    return Response.json({ error: "Unknown template id" }, { status: 404 })
  }

  try {
    const template = await request.json()
    await writeFile(filePath, JSON.stringify(template, null, 2), "utf-8")
    return Response.json({ ok: true })
  } catch (error) {
    console.error("[cv-templates PUT] Failed to save template:", error)
    return Response.json({ error: "Failed to save template" }, { status: 500 })
  }
}
