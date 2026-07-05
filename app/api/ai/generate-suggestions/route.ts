import { chatComplete } from '@/lib/openrouter'

export async function POST(request: Request) {
  try {
    const { text, context, language } = await request.json()

    if (!text) {
      return Response.json({ error: "Le texte est requis" }, { status: 400 })
    }

    const languageInstruction = language === "en" ? "in English" : "en français"
    const contextInstruction = context ? `This is for a ${context} section of a CV.` : ""

    const prompt = `You are a professional CV writing assistant. Generate 3 different professional variations of the following text ${languageInstruction}.
${contextInstruction}

Requirements:
- Each variation should be professional, clear, and impactful
- Use action verbs and highlight achievements
- Make them concise and ATS-friendly
- Each variation should have a slightly different style or emphasis
- Plain text only: no markdown, no bold, no bullet points, no headings — each variation is a single paragraph

Original text:
${text}

Respond with strict JSON in this exact shape, nothing else: {"suggestions": ["variation 1", "variation 2", "variation 3"]}`

    const generatedText = await chatComplete(prompt, { temperature: 0.8, jsonResponse: true })

    let suggestions: string[] = []
    try {
      const parsed = JSON.parse(generatedText)
      if (Array.isArray(parsed?.suggestions)) {
        suggestions = parsed.suggestions.filter((s: unknown) => typeof s === "string" && s.trim())
      }
    } catch (parseError) {
      console.error("[generate-suggestions] Failed to parse JSON:", generatedText)
      throw new Error("Invalid JSON response from AI")
    }

    return Response.json({ suggestions })
  } catch (error: any) {
    console.error("[OpenRouter] Error generating suggestions:", error)
    return Response.json({
      error: "Erreur lors de la génération des suggestions",
      details: error.message
    }, { status: 500 })
  }
}
