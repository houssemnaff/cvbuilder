import { Font, getDefaultFont } from "@pdfme/common"
import { Form, Viewer, Designer } from "@pdfme/ui"
import { generate } from "@pdfme/generator"
import { getPlugins } from "./plugins"

export const getFontsData = (): Font => ({
  ...getDefaultFont(),
})

export const generatePDF = async (
  currentRef: Designer | Form | Viewer | null,
): Promise<Uint8Array | null> => {
  if (!currentRef) return null

  const template = currentRef.getTemplate()
  const inputs = (currentRef as Viewer | Form).getInputs?.() ?? [{}]

  const pdf = await generate({
    template,
    inputs,
    options: {
      font: getFontsData(),
    },
    plugins: getPlugins(),
  })

  return pdf
}
