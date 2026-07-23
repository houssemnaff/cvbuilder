import { randomUUID } from "crypto"
import { extractText, getDocumentProxy } from "unpdf"
import { chatComplete } from "@/lib/openrouter"
import type { Profile } from "@/lib/services/profile-service"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 Mo

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return String(value)
  return ""
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(asString).filter(Boolean)
}

/** Normalise la réponse de l'IA vers la forme exacte du profil, quoi qu'elle renvoie. */
function normalizeProfile(raw: any): Omit<Profile, "personalInfo"> & { personalInfo: Omit<Profile["personalInfo"], "photo"> } {
  const personal = raw?.personal ?? raw?.personalInfo ?? {}
  return {
    personalInfo: {
      firstName: asString(personal.firstName),
      lastName: asString(personal.lastName),
      email: asString(personal.email),
      phone: asString(personal.phone),
      address: asString(personal.address),
      city: asString(personal.city),
      postalCode: asString(personal.postalCode),
      country: asString(personal.country),
      linkedin: asString(personal.linkedin),
      website: asString(personal.website),
      summary: asString(personal.summary),
    },
    experiences: (Array.isArray(raw?.experiences) ? raw.experiences : []).map((exp: any) => ({
      id: randomUUID(),
      position: asString(exp?.position),
      company: asString(exp?.company),
      location: asString(exp?.location),
      startDate: asString(exp?.startDate),
      endDate: asString(exp?.endDate),
      current: Boolean(exp?.current),
      description: asString(exp?.description),
    })),
    education: (Array.isArray(raw?.education) ? raw.education : []).map((edu: any) => ({
      id: randomUUID(),
      degree: asString(edu?.degree),
      institution: asString(edu?.institution),
      location: asString(edu?.location),
      startDate: asString(edu?.startDate),
      endDate: asString(edu?.endDate),
      description: asString(edu?.description),
    })),
    skills: asStringArray(raw?.skills),
    languages: (Array.isArray(raw?.languages) ? raw.languages : []).map((lang: any) => ({
      id: randomUUID(),
      name: asString(lang?.name),
      level: asString(lang?.level),
    })),
    projects: (Array.isArray(raw?.projects) ? raw.projects : []).map((proj: any) => ({
      id: randomUUID(),
      name: asString(proj?.name),
      link: asString(proj?.link),
      technologies: asString(proj?.technologies),
      description: asString(proj?.description),
    })),
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return Response.json({ error: "Aucun fichier reçu" }, { status: 400 })
    }
    if (file.type !== "application/pdf") {
      return Response.json({ error: "Seuls les fichiers PDF sont acceptés" }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "Fichier trop volumineux (10 Mo maximum)" }, { status: 400 })
    }

    const buffer = new Uint8Array(await file.arrayBuffer())
    const pdf = await getDocumentProxy(buffer)
    const { text } = await extractText(pdf, { mergePages: true })

    const cvText = text.trim()
    if (cvText.length < 50) {
      return Response.json(
        { error: "Impossible de lire le texte de ce PDF (document scanné ou vide). Essayez un PDF contenant du texte." },
        { status: 422 },
      )
    }

    const prompt = `You are a CV parsing assistant. Extract the information from the following CV text into structured JSON.

Rules:
- Keep the original language of the CV content (do not translate).
- Dates: use "YYYY-MM" format when month is known, otherwise "YYYY". Empty string if unknown.
- For a current position (e.g. "Présent", "aujourd'hui", "Present"), set "current": true and "endDate": "".
- "skills" is a flat array of short skill names (split grouped lists).
- "technologies" in projects is a comma-separated string.
- Use empty strings "" for missing fields, empty arrays [] for missing sections. Never invent information.

CV text:
${cvText.slice(0, 15000)}

Respond with strict JSON only, in this exact shape:
{
  "personal": {"firstName": "", "lastName": "", "email": "", "phone": "", "address": "", "city": "", "postalCode": "", "country": "", "linkedin": "", "website": "", "summary": ""},
  "experiences": [{"position": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": ""}],
  "education": [{"degree": "", "institution": "", "location": "", "startDate": "", "endDate": "", "description": ""}],
  "skills": [""],
  "languages": [{"name": "", "level": ""}],
  "projects": [{"name": "", "link": "", "technologies": "", "description": ""}]
}`

    const generatedText = await chatComplete(prompt, { temperature: 0.1, jsonResponse: true })

    let parsed: unknown
    try {
      parsed = JSON.parse(generatedText)
    } catch {
      console.error("[import-cv] Invalid JSON from AI:", generatedText)
      return Response.json({ error: "L'IA a renvoyé une réponse illisible, réessayez." }, { status: 502 })
    }

    return Response.json({ profile: normalizeProfile(parsed) })
  } catch (error: any) {
    console.error("[import-cv] Error:", error)
    return Response.json(
      { error: "Erreur lors de l'analyse du CV", details: error.message },
      { status: 500 },
    )
  }
}
