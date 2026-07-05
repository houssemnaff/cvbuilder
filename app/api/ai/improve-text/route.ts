import { chatComplete } from "@/lib/openrouter"

export async function POST(request: Request) {
  try {
    const { text, context, language } = await request.json()

    if (!text) {
      return Response.json({ error: "Le texte est requis" }, { status: 400 })
    }

    const languageInstruction = language === "en" ? "in English" : "en français"
    const contextInstruction = context ? `Context: This text is for a ${context} section of a CV.` : ""

    const prompt = `You are a professional CV writing assistant. Rewrite the following text in a professional, clear, and impactful way ${languageInstruction}.
${contextInstruction}
Make it concise, highlight achievements and responsibilities using action verbs, and ensure it's ATS-friendly.

Original text:
${text}

Rewritten professional version:`

    const improvedText = await chatComplete(prompt, { temperature: 0.7 })

    return Response.json({ improvedText: improvedText.trim() })
  } catch (error) {
    console.error("[improve-text] Error improving text:", error)
    return Response.json({ error: "Erreur lors de l'amélioration du texte" }, { status: 500 })
  }
}
