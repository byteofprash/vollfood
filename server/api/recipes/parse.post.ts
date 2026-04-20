import Anthropic from '@anthropic-ai/sdk'

export default defineEventHandler(async (event) => {
  const { transcript } = await readBody(event)
  if (!transcript?.trim()) {
    throw createError({ statusCode: 400, message: 'No transcript provided' })
  }

  const config = useRuntimeConfig()
  const client = new Anthropic({ apiKey: config.anthropicApiKey })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Extract recipe information from this spoken description and return valid JSON only — no markdown, no explanation.

Transcript: "${transcript}"

Return exactly this JSON structure:
{
  "name": "Recipe name",
  "category": "Category (e.g. Curry, Rice, Side Dish, Dessert)",
  "cooktime": 30,
  "serves": 4,
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": ["Step 1 description", "Step 2 description"]
}

Rules:
- cooktime is total minutes as a number, null if not mentioned
- serves is a number, null if not mentioned
- ingredients and steps are arrays of strings
- Be concise in step descriptions`,
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '{}'
  try {
    return JSON.parse(text)
  } catch {
    throw createError({ statusCode: 500, message: 'Failed to parse AI response' })
  }
})
