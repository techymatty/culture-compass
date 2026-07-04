'use server'

import { ai, isGeminiConfigured, PROMPT_REGISTRY, SCHEMAS, runWithRetry } from '@/lib/gemini'

// =========================================================================
// STATIC OFFLINE CACHE (FALLBACK MODE DATA)
// =========================================================================

const STATIC_PHRASES = [
  {
    english: 'Hello / Good afternoon',
    translation: 'こんにちは',
    phonetic: 'Konnichiwa',
    cultural_tip: 'Say this with a slight bow. It is the most common daytime greeting.',
  },
  {
    english: 'Thank you very much',
    translation: 'ありがとうございます',
    phonetic: 'Arigatou gozaimasu',
    cultural_tip: 'Essential in restaurants and shops. Politeness is highly valued in Japan.',
  },
  {
    english: 'Excuse me / Sorry',
    translation: 'すみません',
    phonetic: 'Sumimasen',
    cultural_tip: 'Use this to get a waiter’s attention or apologize if you bump into someone.',
  },
]

const STATIC_REPLY = {
  reply: 'Konnichiwa! Welcome to our tea house. Would you like to try our matcha or sencha today?',
  feedback:
    'Great job! Your greeting "Konnichiwa" is perfectly polite. Next, you can try ordering: "Matcha o kudasai" (Matcha, please).',
  is_correct: true,
}

// =========================================================================
// AI SERVICE OPERATIONS
// =========================================================================

export async function aiGenerateSurvivalPhrases(destination: string): Promise<
  Array<{
    english: string
    translation: string
    phonetic: string
    cultural_tip: string
  }>
> {
  if (!isGeminiConfigured || !ai) {
    return STATIC_PHRASES
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.SURVIVAL_PHRASES_V1.replace('{destination}', destination)
    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: SCHEMAS.SURVIVAL_PHRASES,
      },
    })

    return JSON.parse(response.text || '[]')
  })
}

export async function aiSimulateConversation(
  scenario: string,
  history: string,
  userInput: string,
): Promise<{
  reply: string
  feedback: string
  is_correct: boolean
}> {
  if (!isGeminiConfigured || !ai) {
    return STATIC_REPLY
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.CONVERSATION_SIMULATOR_V1.replace('{scenario}', scenario)
      .replace('{history}', history)
      .replace('{userInput}', userInput)

    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: SCHEMAS.CONVERSATION,
      },
    })

    return JSON.parse(response.text || '{}')
  })
}
