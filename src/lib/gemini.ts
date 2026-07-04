import { GoogleGenAI } from '@google/genai'

export const isGeminiConfigured = !!(
  process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('dummy')
)

export const ai = isGeminiConfigured
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null

// =========================================================================
// CENTRALIZED PROMPT REGISTRY
// =========================================================================

export const PROMPT_REGISTRY = {
  DESTINATION_DISCOVERY_V1: `
    You are an expert cultural guide. Provide a comprehensive summary of the destination matching: {query}.
    You must output a JSON response matching the provided schema.
    Ensure descriptions are vivid and capture local atmosphere.
  `,
  HIDDEN_GEMS_V1: `
    Spotlight 3 highly authentic, underrated, or lesser-known places (cafes, viewpoints, local workshops, small temples) in {destination}.
    Provide the name, category, geographic coords, description, and the historical/cultural significance of each gem.
  `,
  IMMERSIVE_STORY_V1: `
    Generate an immersive, atmospheric travel narrative about {destination} adapted for:
    - Season: {season}
    - Weather: {weather}
    - Time of Day: {timeOfDay}
    - Active local festivals (if any): {festival}
    Focus on sensory descriptions (sounds, smells, sights) to capture the cultural spirit.
  `,
  TIME_MACHINE_V1: `
    Act as a historical storyteller in first-person living in {destination} during the {era} era.
    Narrate a short, historically accurate story about daily life, architecture, and historical events of your time.
  `,
  ITINERARY_PLANNER_V1: `
    Generate a highly customized, culturally-immersive travel itinerary for:
    - Destination: {destination}
    - Duration: {days} days
    - Budget Tier: {budget}
    - Travel Style: {style}
    - Cultural Interests: {preferences}
    For each day, structure 3-4 sequential activities with start/end times, activity types, estimated cost, and transit suggestions.
  `,
  SURVIVAL_PHRASES_V1: `
    Generate 5 essential local language survival phrases for visitors in {destination}.
    Include the English text, local script translation, phonetic transcription, and cultural tip on when to say it.
  `,
  NARRATIVE_JOURNAL_V1: `
    Transform the following rough traveler's log entries into a polished, evocative narrative memoir:
    "{rawContent}"
    Focus on cultural insights, food experiences, and personal emotions, keeping the tone warm and reflective.
  `,
  ETIQUETTE_COACH_V1: `
    Detail 5 critical respect rules, greetings, and temple/social do's and don'ts for visitors in {destination}.
    Specify the situation, rule description, and what happens if violated (cultural context).
  `,
  CONVERSATION_SIMULATOR_V1: `
    Roleplay as a local merchant (e.g. food stall seller) in {destination} for the scenario: {scenario}.
    Review the traveler's message: "{userInput}".
    Given the dialogue history: {history}.
    Respond in character, then provide a friendly correction/tip on pronunciation, local terms, or ordering etiquette if their input can be improved.
  `,
  SUSTAINABILITY_ANALYZE_V1: `
    Analyze the carbon impact and travel methods of this itinerary: {itineraryText}.
    Calculate the total estimated carbon footprint in kilograms, assign a sustainability grade from A (excellent) to F (poor), and suggest 3 greener alternatives (e.g. train routes, walking tours, local shops).
  `,
} as const

// =========================================================================
// RESPONSE SCHEMAS FOR STRUCTURED AI OUTPUT
// =========================================================================

export const SCHEMAS = {
  DESTINATION: {
    type: 'OBJECT',
    properties: {
      name: { type: 'STRING' },
      country: { type: 'STRING' },
      region: { type: 'STRING' },
      description: { type: 'STRING' },
      history_summary: { type: 'STRING' },
      weather_insights: {
        type: 'OBJECT',
        properties: {
          spring: { type: 'STRING' },
          summer: { type: 'STRING' },
          autumn: { type: 'STRING' },
          winter: { type: 'STRING' },
        },
        required: ['spring', 'summer', 'autumn', 'winter'],
      },
      crowd_level: { type: 'STRING' },
      transportation_tips: {
        type: 'OBJECT',
        properties: {
          primary: { type: 'STRING' },
          pass: { type: 'STRING' },
          walking: { type: 'STRING' },
        },
        required: ['primary', 'pass', 'walking'],
      },
      best_season: { type: 'STRING' },
      lat: { type: 'NUMBER' },
      lng: { type: 'NUMBER' },
    },
    required: [
      'name',
      'country',
      'region',
      'description',
      'history_summary',
      'weather_insights',
      'crowd_level',
      'transportation_tips',
      'best_season',
      'lat',
      'lng',
    ],
  },
  HIDDEN_GEMS: {
    type: 'ARRAY',
    items: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING' },
        category: { type: 'STRING' },
        description: { type: 'STRING' },
        cultural_significance: { type: 'STRING' },
        lat: { type: 'NUMBER' },
        lng: { type: 'NUMBER' },
      },
      required: ['name', 'category', 'description', 'cultural_significance', 'lat', 'lng'],
    },
  },
  ITINERARY: {
    type: 'OBJECT',
    properties: {
      days: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            day_number: { type: 'INTEGER' },
            date: { type: 'STRING' },
            notes: { type: 'STRING' },
            activities: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  start_time: { type: 'STRING' },
                  end_time: { type: 'STRING' },
                  title: { type: 'STRING' },
                  description: { type: 'STRING' },
                  activity_type: { type: 'STRING' },
                  transport_mode: { type: 'STRING' },
                  cost: { type: 'NUMBER' },
                  lat: { type: 'NUMBER' },
                  lng: { type: 'NUMBER' },
                },
                required: [
                  'start_time',
                  'end_time',
                  'title',
                  'description',
                  'activity_type',
                  'transport_mode',
                  'cost',
                ],
              },
            },
          },
          required: ['day_number', 'date', 'notes', 'activities'],
        },
      },
    },
    required: ['days'],
  },
  SURVIVAL_PHRASES: {
    type: 'ARRAY',
    items: {
      type: 'OBJECT',
      properties: {
        english: { type: 'STRING' },
        translation: { type: 'STRING' },
        phonetic: { type: 'STRING' },
        cultural_tip: { type: 'STRING' },
      },
      required: ['english', 'translation', 'phonetic', 'cultural_tip'],
    },
  },
  CONVERSATION: {
    type: 'OBJECT',
    properties: {
      reply: { type: 'STRING' },
      feedback: { type: 'STRING' },
      is_correct: { type: 'BOOLEAN' },
    },
    required: ['reply', 'feedback', 'is_correct'],
  },
  SUSTAINABILITY: {
    type: 'OBJECT',
    properties: {
      carbon_footprint_kg: { type: 'NUMBER' },
      sustainability_grade: { type: 'STRING' },
      alternatives: {
        type: 'ARRAY',
        items: { type: 'STRING' },
      },
    },
    required: ['carbon_footprint_kg', 'sustainability_grade', 'alternatives'],
  },
} as const

// =========================================================================
// RETRY WITH EXPONENTIAL BACKOFF HELPER
// =========================================================================

export async function runWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    console.warn(`Gemini API call failed, retrying in ${delay}ms... (Retries left: ${retries})`)
    await new Promise((resolve) => setTimeout(resolve, delay))
    return runWithRetry(fn, retries - 1, delay * 2)
  }
}
