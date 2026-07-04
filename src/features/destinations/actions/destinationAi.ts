'use server'

import { ai, isGeminiConfigured, PROMPT_REGISTRY, SCHEMAS, runWithRetry } from '@/lib/gemini'
import { Destination, HiddenGem } from '@/lib/db'

// =========================================================================
// STATIC OFFLINE CACHE (FALLBACK MODE DATA)
// =========================================================================

const STATIC_DESTINATIONS: Record<string, Destination> = {
  kyoto: {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Kansai',
    description:
      'The cultural heart of Japan, famous for its classical Buddhist temples, Zen gardens, imperial palaces, Shinto shrines, and traditional wooden houses.',
    history_summary:
      'Kyoto was the imperial capital of Japan for over a millennium (794 to 1869) and was known as Heian-kyo. Because of its historical value, it was largely spared from bombing during World War II.',
    weather_insights: {
      spring: 'Mild and cherry blossoms',
      summer: 'Hot and humid',
      autumn: 'Cool and colorful maples',
      winter: 'Cold with light snow',
    },
    crowd_level: 'High',
    transportation_tips: {
      primary: 'Subway & Bus Network',
      pass: 'Kansai One Pass',
      walking: 'Very pedestrian-friendly',
    },
    best_season: 'Spring / Autumn',
    lat: 35.0116,
    lng: 135.7681,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  rome: {
    id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Rome',
    country: 'Italy',
    region: 'Lazio',
    description:
      'A potent blend of haunting ruins, awe-inspiring art, and vibrant street life, Italy’s hot-blooded capital is one of the world’s most romantic cities.',
    history_summary:
      'Rome’s history spans more than 2,500 years. Founded in 753 BC by Romulus, it grew to become the capital of the Roman Empire, the cradle of Western civilization, and the center of the Catholic Church.',
    weather_insights: {
      spring: 'Warm and sunny',
      summer: 'Very hot',
      autumn: 'Pleasantly cool',
      winter: 'Mild and wet',
    },
    crowd_level: 'High',
    transportation_tips: {
      primary: 'Metro & Walking',
      pass: 'Roma Pass',
      warning: 'Buses can be unreliable',
    },
    best_season: 'April to June',
    lat: 41.9028,
    lng: 12.4964,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  paris: {
    id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    description:
      'A global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is interlaced by wide boulevards and the River Seine.',
    history_summary:
      'Settled by the Parisii tribe in the 3rd century BC, Paris became a Roman town, the center of the French Revolution, and a capital of artistic movements like Impressionism.',
    weather_insights: {
      spring: 'Fresh and pleasant',
      summer: 'Warm and busy',
      autumn: 'Cool with gold leaves',
      winter: 'Cold and rainy',
    },
    crowd_level: 'High',
    transportation_tips: {
      primary: 'Paris Métro',
      pass: 'Navigo Card',
      biking: 'Vélib shares everywhere',
    },
    best_season: 'May to September',
    lat: 48.8566,
    lng: 2.3522,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

const STATIC_GEMS: Record<string, HiddenGem[]> = {
  kyoto: [
    {
      id: 'g1111111-1111-1111-1111-111111111111',
      destination_id: 'd1111111-1111-1111-1111-111111111111',
      name: 'Gio-ji Temple',
      category: 'Temple / Garden',
      description:
        'A tiny, quiet Buddhist temple tucked in the Arashiyama forest, famous for its lush moss garden and maple trees.',
      cultural_significance:
        'Gio-ji is mentioned in the Heike Monogatari. It was a sanctuary for dancers who became nuns after losing favor with power.',
      lat: 35.0215,
      lng: 135.6703,
      created_at: new Date().toISOString(),
    },
    {
      id: 'g1111111-1111-1111-1111-111111111112',
      destination_id: 'd1111111-1111-1111-1111-111111111111',
      name: 'Otagi Nenbutsu-ji',
      category: 'Temple',
      description:
        'A temple featuring over 1,200 whimsical stone sculptures representing Rakan, each with a different facial expression.',
      cultural_significance:
        'The statues were carved by amateur sculptors from across Japan in the 1980s under the guidance of Kocho Nishimura.',
      lat: 35.0298,
      lng: 135.6631,
      created_at: new Date().toISOString(),
    },
  ],
  rome: [
    {
      id: 'g2222222-2222-2222-2222-222222222222',
      destination_id: 'd2222222-2222-2222-2222-222222222222',
      name: 'Quartiere Coppedè',
      category: 'Architecture',
      description:
        'An enchanting neighborhood displaying a whimsical mixture of Art Nouveau, Gothic, Baroque, and medieval styles.',
      cultural_significance:
        'Designed by Gino Coppedè in the 1920s, this area is a departure from Rome’s classical ruins, showcasing unique curved facades and outdoor chandeliers.',
      lat: 41.9189,
      lng: 12.5021,
      created_at: new Date().toISOString(),
    },
  ],
}

// =========================================================================
// AI SERVICE OPERATIONS
// =========================================================================

export async function aiDiscoverDestination(query: string): Promise<Destination> {
  const normalizedQuery = query.toLowerCase().trim()

  // Fallback to static cache if Gemini is offline
  if (!isGeminiConfigured || !ai) {
    const key = Object.keys(STATIC_DESTINATIONS).find(
      (k) =>
        normalizedQuery.includes(k) ||
        STATIC_DESTINATIONS[k].country.toLowerCase().includes(normalizedQuery),
    )
    return STATIC_DESTINATIONS[key || 'kyoto']
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.DESTINATION_DISCOVERY_V1.replace('{query}', query)
    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: SCHEMAS.DESTINATION,
      },
    })

    const data = JSON.parse(response.text || '{}')
    return {
      id: crypto.randomUUID(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  })
}

export async function aiGetHiddenGems(
  destinationName: string,
  destinationId: string,
): Promise<HiddenGem[]> {
  const normalizedName = destinationName.toLowerCase().trim()

  if (!isGeminiConfigured || !ai) {
    const key = Object.keys(STATIC_GEMS).find((k) => normalizedName.includes(k))
    return STATIC_GEMS[key || 'kyoto'].map((g) => ({ ...g, destination_id: destinationId }))
  }

  const activeAi = ai

  return runWithRetry(async () => {
    const prompt = PROMPT_REGISTRY.HIDDEN_GEMS_V1.replace('{destination}', destinationName)
    const response = await activeAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: SCHEMAS.HIDDEN_GEMS,
      },
    })

    const rawGems = JSON.parse(response.text || '[]') as Array<{
      name: string
      category: string
      description: string
      cultural_significance: string
      lat: number
      lng: number
    }>
    return rawGems.map((g) => ({
      id: crypto.randomUUID(),
      destination_id: destinationId,
      name: g.name,
      category: g.category,
      description: g.description,
      cultural_significance: g.cultural_significance,
      lat: g.lat,
      lng: g.lng,
      created_at: new Date().toISOString(),
    }))
  })
}
