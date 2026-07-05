import { renderToTemplate } from "@pdfme/jsx"
import { generate } from "@pdfme/generator"
import { getPlugins } from "@/app/plugins"
import type { ProfileData } from "@/components/cv/cv-preview"
import { AcademicTemplate } from "@/components/cv/templates/academic"

const CV_TEMPLATE_MAP: Record<string, (props: { data: ProfileData }) => ReturnType<typeof AcademicTemplate>> = {
  academic: AcademicTemplate,
}

export async function generateCvPdf(templateId: string, profileData: ProfileData): Promise<Buffer> {
  const TemplateComponent = CV_TEMPLATE_MAP[templateId]

  if (!TemplateComponent) {
    throw new Error(`Template "${templateId}" not found`)
  }

  const { template, inputs } = await renderToTemplate(TemplateComponent({ data: profileData }))

  const pdfBytes = await generate({
    template,
    inputs,
    plugins: getPlugins(),
  })

  return Buffer.from(pdfBytes)
}
