import { OpenRouter } from "@openrouter/sdk"

let client: OpenRouter | null = null

function getClient(): OpenRouter {
  if (client) return client

  const apiKey = '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'
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

export const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-v4-flash"

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
      maxTokens: options.maxTokens,
      responseFormat: options.jsonResponse ? { type: "json_object" } : undefined,
    },
  })

  return result.choices[0]?.message?.content?.toString() ?? ""
}
