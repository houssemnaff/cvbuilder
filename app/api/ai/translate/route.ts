import { NextRequest, NextResponse } from 'next/server'
import { chatComplete } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: "Le texte est requis" },
        { status: 400 }
      )
    }

    if (!targetLanguage) {
      return NextResponse.json(
        { error: "La langue cible est requise" },
        { status: 400 }
      )
    }

    const languageName = targetLanguage === "en" ? "English" : 
                        targetLanguage === "fr" ? "French" : 
                        targetLanguage

    const prompt = `Translate the following CV text to professional ${languageName}. Maintain a professional tone and ensure it's suitable for a resume/CV context.

IMPORTANT RULES:
1. Keep all technical terms, company names, and proper nouns as is
2. Maintain the same level of formality
3. Ensure industry-specific terminology is correctly translated
4. Keep dates, numbers, and contact information unchanged
5. Preserve formatting where possible
6. Make the translation sound natural in ${languageName}

Text to translate:
${text}

Professional translation in ${languageName}:`

    const translatedText = (await chatComplete(prompt, { temperature: 0.5, maxTokens: 2000 })).trim()

    if (!translatedText) {
      throw new Error("No translation received from AI")
    }

    return NextResponse.json({
      translatedText,
      originalLanguage: detectLanguage(text),
      targetLanguage: languageName,
    })

  } catch (error: any) {
    console.error("[Translation API] Error:", error)
    
    return NextResponse.json(
      { 
        error: "Erreur lors de la traduction",
        details: error.message || "Unknown error",
        suggestion: error.message?.includes("404") 
          ? "Essayez avec le modèle 'openai/gpt-3.5-turbo'"
          : "Vérifiez votre connexion et votre clé API"
      },
      { status: 500 }
    )
  }
}

// Fonction pour détecter la langue (simple)
function detectLanguage(text: string): string {
  // Détection simple basée sur des mots clés
  const frenchWords = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'le', 'la', 'les', 'de', 'des', 'du']
  const englishWords = ['the', 'and', 'of', 'to', 'a', 'in', 'that', 'is', 'was', 'for']
  
  let frenchCount = 0
  let englishCount = 0
  
  const words = text.toLowerCase().split(/\s+/)
  
  words.forEach(word => {
    if (frenchWords.includes(word)) frenchCount++
    if (englishWords.includes(word)) englishCount++
  })
  
  if (frenchCount > englishCount) return "French"
  if (englishCount > frenchCount) return "English"
  return "Unknown"
}

// Optionnel: Ajouter une méthode GET pour tester
export async function GET() {
  return NextResponse.json({
    message: "CV Translation API is running",
    endpoint: "POST /api/translate-cv",
    requiredBody: {
      text: "Text to translate",
      targetLanguage: "en or fr (or other language name)"
    },
    exampleRequest: {
      text: "Développeur Full Stack avec 5 ans d'expérience en React et Node.js",
      targetLanguage: "en"
    }
  })
}