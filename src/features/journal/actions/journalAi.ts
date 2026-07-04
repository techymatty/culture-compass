'use server'

import { ai, isGeminiConfigured, PROMPT_REGISTRY, runWithRetry } from '@/lib/gemini'

// =========================================================================
// STATIC OFFLINE CACHE (FALLBACK MODE DATA)
// =========================================================================

const STATIC_NARRATIVE =
  'Our day in Kyoto was nothing short of magical. We started our journey wandering down the quiet paths of Gio-ji, where the vibrant moss seemed to absorb the sounds of the surrounding forest. Later, we found ourselves laughing and bowing with a local shopkeeper as we tasted authentic matcha. These moments of quiet connection are what truly define travel.'

// =========================================================================
// AI SERVICE OPERATIONS
// =========================================================================

export async function aiNarrateJournalLog(rawContent: string): Promise<string> {
  if (!isGeminiConfigured || !ai) {
    return STATIC_NARRATIVE
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.NARRATIVE_JOURNAL_V1.replace('{rawContent}', rawContent)
    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    return response.text || 'Failed to generate narrative.'
  })
}

export async function aiCompileMemoryBook(
  tripId: string,
): Promise<{ success: boolean; book_title: string; pages: Record<string, unknown>[] }> {
  // Simulates gathering database records for a trip and preparing them for a PDF book compilation layout
  return {
    success: true,
    book_title: `My Culture Compass Memory Book (Trip: ${tripId})`,
    pages: [
      {
        page_type: 'cover',
        title: 'Memories of Kyoto',
        subtitle: 'A Journey of Cultural Immersion',
      },
      {
        page_type: 'journal',
        title: 'Moss & Quiet Temples',
        content: STATIC_NARRATIVE,
      },
    ],
  }
}
