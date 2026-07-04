'use server'

import { ai, isGeminiConfigured, PROMPT_REGISTRY, runWithRetry } from '@/lib/gemini'

// =========================================================================
// STATIC OFFLINE CACHE (FALLBACK MODE DATA)
// =========================================================================

const STATIC_STORIES: Record<string, string> = {
  kyoto:
    'The faint scent of incense mingles with the damp moss in the cool evening air. Somewhere in the distance, a temple bell rings, reverberating through the bamboo groves of Arashiyama. Lanterns flicker on, casting warm, dancing shadows on wood-paneled machiya townhouses.',
  rome: 'The golden Roman sun is dipping below the ancient brick arches of the Colosseum. The smell of fresh espresso and warm pizza dough drifts from the trattorias. You step onto cobbles laid down by empire builders two millennia ago, hearing the steady murmur of fountains.',
  paris:
    'Raindrops glisten on the black wrought-iron balconies of Saint-Germain-des-Prés in the morning light. The scent of buttery croissants drafts from corner bakeries as cyclists pedal down wide tree-lined boulevards.',
}

const STATIC_HISTORY: Record<string, string> = {
  heian:
    'Greetings, traveler. I am Kajiwara, a scribe of Heian-kyo. You stand in Heian-kyo in the year 805. The streets are structured in a grand grid matching Chang’an. Monks practice esoteric rituals at To-ji Temple to protect our Emperor Saga. Our ladies wear complex twelve-layered robes and write poetry in hiragana.',
  empire:
    'Welcome. I am Marcus, a citizen of the Roman Empire in 125 AD. The Emperor Hadrian has just completed our Pantheon, a concrete dome of marvel. We gather in the Roman Forum to debate politics, bathe at the public thermae, and enjoy chariot races at the Circus Maximus.',
}

// =========================================================================
// AI SERVICE OPERATIONS
// =========================================================================

export async function aiGenerateImmersiveStory(
  destination: string,
  season: string,
  weather: string,
  timeOfDay: string,
  festival: string,
): Promise<string> {
  const norm = destination.toLowerCase()

  if (!isGeminiConfigured || !ai) {
    const key = Object.keys(STATIC_STORIES).find((k) => norm.includes(k))
    return STATIC_STORIES[key || 'kyoto']
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.IMMERSIVE_STORY_V1.replace('{destination}', destination)
      .replace('{season}', season)
      .replace('{weather}', weather)
      .replace('{timeOfDay}', timeOfDay)
      .replace('{festival}', festival || 'None')

    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    return response.text || 'No story generated.'
  })
}

export async function aiTimeMachineStory(destination: string, era: string): Promise<string> {
  const normDest = destination.toLowerCase()
  const normEra = era.toLowerCase()

  if (!isGeminiConfigured || !ai) {
    if (normEra.includes('heian') || normDest.includes('kyoto')) {
      return STATIC_HISTORY.heian
    }
    return STATIC_HISTORY.empire
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.TIME_MACHINE_V1.replace('{destination}', destination).replace(
      '{era}',
      era,
    )

    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    return response.text || 'No history generated.'
  })
}
