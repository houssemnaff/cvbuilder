import OpenAI from 'openai'

// Configuration
const DEFAULT_MODEL = 'kwaipilot/kat-coder-pro:free'
const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1'

// Initialiser le client OpenAI pour OpenRouter
const openai = new OpenAI({
  apiKey:  "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",
  baseURL: DEFAULT_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "CV Builder AI Assistant"
  }
})

export async function POST(request: Request) {
  try {
    const { text, context, language } = await request.json()

    if (!text) {
      return Response.json({ error: "Le texte est requis" }, { status: 400 })
    }

    const languageInstruction = language === "en" ? "in English" : "en français"
    const contextInstruction = context ? `This is for a ${context} section of a CV.` : ""

    const prompt = `You are a professional CV writing assistant. Generate 2 different professional variations of the following text ${languageInstruction}.
${contextInstruction}

Requirements:
- Each variation should be professional, clear, and impactful
- Use action verbs and highlight achievements
- Make them concise and ATS-friendly
- Each variation should have a slightly different style or emphasis
- Number each suggestion from 1 to 2

Original text:
${text}

Generate 10 professional variations (numbered 1-10):`

    // Utiliser directement le client OpenAI comme dans votre service NestJS
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL, // ou "openai/gpt-4o-mini" selon votre préférence
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
     // max_tokens: 2000
    })

    const generatedText = response.choices[0]?.message?.content || ""

    // Parse the suggestions
    const suggestions = generatedText
      .split(/\d+\.\s+/)
      .filter((s:any) => s.trim())
      .map((s:any) => s.trim())
      .slice(0, 10)

    return Response.json({ suggestions })
  } catch (error: any) {
    console.error("[OpenRouter] Error generating suggestions:", error)
    return Response.json({ 
      error: "Erreur lors de la génération des suggestions",
      details: error.message 
    }, { status: 500 })
  }
}