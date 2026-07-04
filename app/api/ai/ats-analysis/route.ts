import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// Configuration OpenAI pour OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "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",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_REFERER_URL || "http://localhost:3000",
    "X-Title": process.env.OPENROUTER_APP_NAME || "CV Analyzer",
  },
})

export async function POST(request: NextRequest) {
  try {
    const { cvData, jobDescription } = await request.json()

    if (!cvData || !jobDescription) {
      return NextResponse.json(
        { error: "Le CV et l'offre d'emploi sont requis" },
        { status: 400 }
      )
    }

    // Format CV data for analysis
    const cvText = `
INFORMATIONS PERSONNELLES:
${cvData.personal.firstName} ${cvData.personal.lastName}
${cvData.personal.email} | ${cvData.personal.phone}
${cvData.personal.city}, ${cvData.personal.country}

RÉSUMÉ PROFESSIONNEL:
${cvData.personal.summary}

EXPÉRIENCES PROFESSIONNELLES:
${cvData.experiences
  .map(
    (exp: any) => `
- ${exp.position} chez ${exp.company} (${exp.startDate} - ${exp.current ? "Présent" : exp.endDate})
  ${exp.description}
`,
  )
  .join("\n")}

FORMATION:
${cvData.education
  .map(
    (edu: any) => `
- ${edu.degree} - ${edu.institution} (${edu.startDate} - ${edu.endDate})
  ${edu.description}
`,
  )
  .join("\n")}

COMPÉTENCES:
${cvData.skills.join(", ")}

LANGUES:
${cvData.languages.map((lang: any) => `${lang.name} (${lang.level})`).join(", ")}
`

    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following CV against the job description and provide a detailed compatibility assessment.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE CV:
${cvText}

Provide your analysis in the following JSON format:
{
  "score": [number between 0-100],
  "summary": "[brief 2-3 sentence overall assessment]",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "recommendations": [
    {
      "category": "[category name like 'Skills', 'Experience', 'Keywords']",
      "suggestion": "[specific actionable recommendation]",
      "priority": "[high/medium/low]"
    }
  ]
}

Be specific, actionable, and focus on ATS optimization. Analyze keyword matching, skills alignment, experience relevance, and formatting considerations.`

    const response = await openai.chat.completions.create({
      model: "kwaipilot/kat-coder-pro:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" } // Force JSON response
    })

    const analysisText = response.choices[0]?.message?.content || ""

    if (!analysisText) {
      throw new Error("No response received from AI")
    }

    // Parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch (parseError) {
      console.error("Failed to parse JSON:", analysisText)
      
      // Fallback: Try to extract JSON if it's wrapped in text
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Invalid JSON response from AI")
      }
    }

    // Validate required fields
    const requiredFields = ['score', 'summary', 'strengths', 'weaknesses', 'missingKeywords', 'recommendations']
    const missingFields = requiredFields.filter(field => !(field in analysis))
    
    if (missingFields.length > 0) {
      console.warn(`Missing fields in analysis: ${missingFields.join(', ')}`)
      
      // Add default values for missing fields
      missingFields.forEach(field => {
        if (field === 'score') analysis.score = 0
        else if (field === 'strengths') analysis.strengths = []
        else if (field === 'weaknesses') analysis.weaknesses = []
        else if (field === 'missingKeywords') analysis.missingKeywords = []
        else if (field === 'recommendations') analysis.recommendations = []
        else if (field === 'summary') analysis.summary = "Analyse générée par l'IA"
      })
    }

    return NextResponse.json({ 
      analysis,
      model: response.model 
    })

  } catch (error: any) {
    console.error("[CV Analysis] Error:", error)
    
    return NextResponse.json(
      { 
        error: "Erreur lors de l'analyse du CV",
        details: error.message || "Unknown error",
        suggestion: error.message?.includes("404") 
          ? "Le modèle 'openai/gpt-4o-mini' n'est peut-être pas disponible. Essayez avec 'openai/gpt-3.5-turbo'"
          : "Vérifiez votre connexion et vos crédits OpenRouter"
      },
      { status: 500 }
    )
  }
}

// Optionnel: Ajoutez une méthode GET pour tester
export async function GET() {
  return NextResponse.json({
    message: "CV Analysis API is running",
    endpoint: "POST /api/analyze-cv",
    requiredBody: {
      cvData: "Object containing CV information",
      jobDescription: "String containing the job description"
    }
  })
}