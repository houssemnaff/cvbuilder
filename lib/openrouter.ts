import { OpenRouter } from "@openrouter/sdk"

let client: OpenRouter | null = null

function getClient(): OpenRouter {
  if (client) return client

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set")
  }

  client = new OpenRouter({
    apiKey,
    httpReferer: process.env.OPENROUTER_REFERER_URL || "http://localhost:3000",
    appTitle: process.env.OPENROUTER_APP_NAME || "CV Builder AI Assistant",
  })

  return client
}

// lib/openrouter.ts
export const DEFAULT_OPENROUTER_MODEL = "openrouter/free"
interface ChatCompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  jsonResponse?: boolean
}

export async function chatComplete(prompt: string, options: ChatCompletionOptions = {}): Promise<string> {
  const result = await getClient().chat.send({
    chatRequest: {
      model: options.model ?? DEFAULT_OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature,
      // Plafond par défaut : sans lui, OpenRouter réserve le max du modèle (65k tokens)
      // et rejette la requête si le solde de crédits ne peut pas le couvrir.
      maxTokens: options.maxTokens ?? 4000,
      responseFormat: options.jsonResponse ? { type: "json_object" } : undefined,
    },
  })

  return result.choices[0]?.message?.content?.toString() ?? ""
}
