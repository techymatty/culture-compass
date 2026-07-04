'use server'

import { ai, isGeminiConfigured, PROMPT_REGISTRY, SCHEMAS, runWithRetry } from '@/lib/gemini'

// =========================================================================
// STATIC OFFLINE CACHE (FALLBACK MODE DATA)
// =========================================================================

const STATIC_ITINERARY = {
  days: [
    {
      day_number: 1,
      date: 'Day 1',
      notes: 'Focus on classical shrines and moss temples.',
      activities: [
        {
          start_time: '09:00',
          end_time: '11:00',
          title: 'Kinkaku-ji Temple Visit',
          description: 'Explore the stunning golden pavilion and its Zen garden reflection pond.',
          activity_type: 'Sightseeing',
          transport_mode: 'Bus',
          cost: 5.0,
          lat: 35.0394,
          lng: 135.7292,
        },
        {
          start_time: '12:00',
          end_time: '13:30',
          title: 'Traditional Soba Lunch',
          description: 'Sample local buckwheat soba noodles in a centuries-old machiya house.',
          activity_type: 'Food',
          transport_mode: 'Walk',
          cost: 15.0,
          lat: 35.0321,
          lng: 135.7311,
        },
        {
          start_time: '14:30',
          end_time: '16:30',
          title: 'Gio-ji Temple moss tour',
          description: 'Visit the peaceful Gio-ji moss forest and study Heian-era poetry scrolls.',
          activity_type: 'Culture',
          transport_mode: 'Train',
          cost: 4.0,
          lat: 35.0215,
          lng: 135.6703,
        },
      ],
    },
  ],
}

const STATIC_SUSTAINABILITY = {
  carbon_footprint_kg: 42.8,
  sustainability_grade: 'A',
  alternatives: [
    'Replace the taxi rides on Day 1 with the Keifuku Electric Railroad tram.',
    'Eat at the local organic farm-to-table restaurant in Arashiyama.',
    'Opt for a guided walking tour of the Gion historical preservation district instead of a bus tour.',
  ],
}

export interface GeneratedItinerary {
  days: Array<{
    day_number: number
    date: string
    notes: string
    activities: Array<{
      start_time: string
      end_time: string
      title: string
      description: string
      activity_type: string
      transport_mode: string
      cost: number
      lat?: number
      lng?: number
    }>
  }>
}

export interface SustainabilityReport {
  carbon_footprint_kg: number
  sustainability_grade: string
  alternatives: string[]
}

// =========================================================================
// AI SERVICE OPERATIONS
// =========================================================================

export async function aiGenerateItinerary(
  destination: string,
  days: number,
  budget: string,
  style: string,
  preferences: string,
): Promise<GeneratedItinerary> {
  if (!isGeminiConfigured || !ai) {
    return STATIC_ITINERARY as unknown as GeneratedItinerary
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.ITINERARY_PLANNER_V1.replace('{destination}', destination)
      .replace('{days}', String(days))
      .replace('{budget}', budget)
      .replace('{style}', style)
      .replace('{preferences}', preferences || 'None')

    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: SCHEMAS.ITINERARY,
      },
    })

    return JSON.parse(response.text || '{}') as GeneratedItinerary
  })
}

export async function aiAnalyzeSustainability(
  itineraryText: string,
): Promise<SustainabilityReport> {
  if (!isGeminiConfigured || !ai) {
    return STATIC_SUSTAINABILITY
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.SUSTAINABILITY_ANALYZE_V1.replace(
      '{itineraryText}',
      itineraryText,
    )
    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: SCHEMAS.SUSTAINABILITY,
      },
    })

    return JSON.parse(response.text || '{}') as SustainabilityReport
  })
}
