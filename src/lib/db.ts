// =========================================================================
// TYPES DEFINITIONS
// =========================================================================

export interface Profile {
  id: string
  clerk_id: string
  email: string
  display_name: string
  avatar_url: string | null
  travel_personality: string | null
  culture_dna: Record<string, unknown>
  total_xp: number
  level: number
  created_at: string
  updated_at: string
}

export interface Destination {
  id: string
  name: string
  country: string
  region: string | null
  description: string
  history_summary: string | null
  weather_insights: Record<string, string>
  crowd_level: string
  transportation_tips: Record<string, string>
  best_season: string | null
  lat: number
  lng: number
  created_at: string
  updated_at: string
}

export interface HiddenGem {
  id: string
  destination_id: string
  name: string
  category: string
  description: string
  cultural_significance: string
  lat: number
  lng: number
  created_at: string
}

export interface Trip {
  id: string
  user_id: string
  destination_id: string
  title: string
  start_date: string
  end_date: string
  budget_tier: string
  travel_style: string
  sustainability_grade: string
  carbon_footprint_kg: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ItineraryDay {
  id: string
  trip_id: string
  day_number: number
  date: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ItineraryActivity {
  id: string
  itinerary_day_id: string
  start_time: string
  end_time: string
  title: string
  description: string | null
  activity_type: string
  transport_mode: string | null
  cost: number
  lat: number | null
  lng: number | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface UserQuest {
  id: string
  user_id: string
  quest_key: string
  title: string
  description: string
  xp_reward: number
  status: 'IN_PROGRESS' | 'COMPLETED'
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface FoodPassportEntry {
  id: string
  user_id: string
  destination_id: string
  dish_name: string
  cultural_significance: string
  photo_url: string | null
  user_notes: string | null
  tasted_at: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  trip_id: string | null
  title: string
  raw_content: string
  generated_narrative: string | null
  photo_urls: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface EmergencyContact {
  id: string
  destination_id: string
  local_police: string
  local_ambulance: string
  local_fire: string
  nearest_hospital_name: string
  hospital_lat: number
  hospital_lng: number
  safety_guidelines: string | null
  updated_at: string
}

// =========================================================================
// MOCK DATABASE & SEED DATA DEFINITIONS
// =========================================================================

const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Kansai',
    description:
      'The cultural heart of Japan, famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.',
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
  {
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
  {
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
]

const SEED_HIDDEN_GEMS: HiddenGem[] = [
  {
    id: 'g1111111-1111-1111-1111-111111111111',
    destination_id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Gio-ji Temple',
    category: 'Temple / Garden',
    description:
      'A tiny, quiet Buddhist temple tucked in the Arashiyama forest, famous for its lush moss garden and maple trees.',
    cultural_significance:
      'Gio-ji is mentioned in the "Tale of the Heike," a medieval epic. It was a refuge for Gio, a dancer who became a nun after losing the favor of a powerful warlord.',
    lat: 35.0215,
    lng: 135.6703,
    created_at: new Date().toISOString(),
  },
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
]

const SEED_EMERGENCY: EmergencyContact[] = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    destination_id: 'd1111111-1111-1111-1111-111111111111',
    local_police: '110',
    local_ambulance: '119',
    local_fire: '119',
    nearest_hospital_name: 'Kyoto University Hospital',
    hospital_lat: 35.0264,
    hospital_lng: 135.7766,
    safety_guidelines:
      'In Japan, stand on the left side of escalators in Kyoto. Heat stroke warning in July/August.',
    updated_at: new Date().toISOString(),
  },
]

// Global ref pattern to persist memory database in Next.js dev server hot reloads
const globalRef = globalThis as unknown as {
  profiles: Profile[]
  trips: Trip[]
  itineraryDays: ItineraryDay[]
  itineraryActivities: ItineraryActivity[]
  userQuests: UserQuest[]
  foodPassport: FoodPassportEntry[]
  journalEntries: JournalEntry[]
}

if (!globalRef.profiles) {
  globalRef.profiles = []
  globalRef.trips = []
  globalRef.itineraryDays = []
  globalRef.itineraryActivities = []
  globalRef.userQuests = []
  globalRef.foodPassport = []
  globalRef.journalEntries = []
}

// =========================================================================
// MOCK DATABASE OPERATION METHODS
// =========================================================================

const mockDb = {
  profiles: {
    async get(clerkId: string): Promise<Profile | null> {
      const p = globalRef.profiles.find((x) => x.clerk_id === clerkId)
      return p || null
    },
    async create(
      data: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'total_xp' | 'level'>,
    ): Promise<Profile> {
      const existing = await this.get(data.clerk_id)
      if (existing) return existing
      const p: Profile = {
        id: crypto.randomUUID(),
        ...data,
        total_xp: 0,
        level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      globalRef.profiles.push(p)
      return p
    },
    async update(clerkId: string, data: Partial<Profile>): Promise<Profile> {
      const index = globalRef.profiles.findIndex((x) => x.clerk_id === clerkId)
      if (index === -1) throw new Error('Profile not found')
      const updated = {
        ...globalRef.profiles[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      globalRef.profiles[index] = updated
      return updated
    },
    async addXp(clerkId: string, amount: number): Promise<Profile> {
      const profile = await this.get(clerkId)
      if (!profile) throw new Error('Profile not found')
      const newXp = profile.total_xp + amount
      // Level formula: Level = Math.floor(XP / 100) + 1
      const newLevel = Math.floor(newXp / 100) + 1
      return this.update(clerkId, { total_xp: newXp, level: newLevel })
    },
  },

  destinations: {
    async list(): Promise<Destination[]> {
      return SEED_DESTINATIONS
    },
    async get(id: string): Promise<Destination | null> {
      return SEED_DESTINATIONS.find((x) => x.id === id) || null
    },
    async search(query: string): Promise<Destination[]> {
      const normalized = query.toLowerCase()
      return SEED_DESTINATIONS.filter(
        (x) =>
          x.name.toLowerCase().includes(normalized) || x.country.toLowerCase().includes(normalized),
      )
    },
  },

  hiddenGems: {
    async listByDestination(destinationId: string): Promise<HiddenGem[]> {
      return SEED_HIDDEN_GEMS.filter((x) => x.destination_id === destinationId)
    },
  },

  trips: {
    async list(userClerkId: string): Promise<Trip[]> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) return []
      return globalRef.trips.filter((x) => x.user_id === profile.id && !x.deleted_at)
    },
    async get(id: string): Promise<Trip | null> {
      return globalRef.trips.find((x) => x.id === id && !x.deleted_at) || null
    },
    async create(
      userClerkId: string,
      data: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>,
    ): Promise<Trip> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) throw new Error('Profile not found')
      const t: Trip = {
        id: crypto.randomUUID(),
        user_id: profile.id,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      }
      globalRef.trips.push(t)
      return t
    },
    async update(id: string, data: Partial<Trip>): Promise<Trip> {
      const index = globalRef.trips.findIndex((x) => x.id === id)
      if (index === -1) throw new Error('Trip not found')
      const updated = {
        ...globalRef.trips[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      globalRef.trips[index] = updated
      return updated
    },
    async delete(id: string): Promise<void> {
      const index = globalRef.trips.findIndex((x) => x.id === id)
      if (index !== -1) {
        globalRef.trips[index].deleted_at = new Date().toISOString()
      }
    },
  },

  itineraryDays: {
    async list(tripId: string): Promise<ItineraryDay[]> {
      return globalRef.itineraryDays
        .filter((x) => x.trip_id === tripId)
        .sort((a, b) => a.day_number - b.day_number)
    },
    async create(
      data: Omit<ItineraryDay, 'id' | 'created_at' | 'updated_at'>,
    ): Promise<ItineraryDay> {
      const day: ItineraryDay = {
        id: crypto.randomUUID(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      globalRef.itineraryDays.push(day)
      return day
    },
  },

  itineraryActivities: {
    async list(dayId: string): Promise<ItineraryActivity[]> {
      return globalRef.itineraryActivities
        .filter((x) => x.itinerary_day_id === dayId)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
    },
    async create(
      data: Omit<ItineraryActivity, 'id' | 'is_completed' | 'created_at' | 'updated_at'>,
    ): Promise<ItineraryActivity> {
      const act: ItineraryActivity = {
        id: crypto.randomUUID(),
        ...data,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      globalRef.itineraryActivities.push(act)
      return act
    },
    async toggleCompletion(id: string, isCompleted: boolean): Promise<ItineraryActivity> {
      const index = globalRef.itineraryActivities.findIndex((x) => x.id === id)
      if (index === -1) throw new Error('Activity not found')
      const updated = {
        ...globalRef.itineraryActivities[index],
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
      }
      globalRef.itineraryActivities[index] = updated
      return updated
    },
  },

  quests: {
    async list(userClerkId: string): Promise<UserQuest[]> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) return []
      return globalRef.userQuests.filter((x) => x.user_id === profile.id)
    },
    async create(
      userClerkId: string,
      data: Omit<
        UserQuest,
        'id' | 'user_id' | 'status' | 'completed_at' | 'created_at' | 'updated_at'
      >,
    ): Promise<UserQuest> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) throw new Error('Profile not found')
      const q: UserQuest = {
        id: crypto.randomUUID(),
        user_id: profile.id,
        status: 'IN_PROGRESS',
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      }
      globalRef.userQuests.push(q)
      return q
    },
    async complete(id: string, userClerkId: string): Promise<UserQuest> {
      const index = globalRef.userQuests.findIndex((x) => x.id === id)
      if (index === -1) throw new Error('Quest not found')
      const quest = globalRef.userQuests[index]
      if (quest.status === 'COMPLETED') return quest

      const updated: UserQuest = {
        ...quest,
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      globalRef.userQuests[index] = updated
      // Award XP
      await mockDb.profiles.addXp(userClerkId, quest.xp_reward)
      return updated
    },
  },

  foodPassport: {
    async list(userClerkId: string): Promise<FoodPassportEntry[]> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) return []
      return globalRef.foodPassport.filter((x) => x.user_id === profile.id)
    },
    async create(
      userClerkId: string,
      data: Omit<FoodPassportEntry, 'id' | 'user_id' | 'tasted_at' | 'created_at'>,
    ): Promise<FoodPassportEntry> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) throw new Error('Profile not found')
      const entry: FoodPassportEntry = {
        id: crypto.randomUUID(),
        user_id: profile.id,
        ...data,
        tasted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
      globalRef.foodPassport.push(entry)
      // Stamp awards 20 XP
      await mockDb.profiles.addXp(userClerkId, 20)
      return entry
    },
  },

  journalEntries: {
    async list(userClerkId: string): Promise<JournalEntry[]> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) return []
      return globalRef.journalEntries.filter((x) => x.user_id === profile.id && !x.deleted_at)
    },
    async create(
      userClerkId: string,
      data: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>,
    ): Promise<JournalEntry> {
      const profile = await mockDb.profiles.get(userClerkId)
      if (!profile) throw new Error('Profile not found')
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        user_id: profile.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        ...data,
      }
      globalRef.journalEntries.push(entry)
      return entry
    },
    async update(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
      const index = globalRef.journalEntries.findIndex((x) => x.id === id)
      if (index === -1) throw new Error('Journal not found')
      const updated = {
        ...globalRef.journalEntries[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      globalRef.journalEntries[index] = updated
      return updated
    },
    async delete(id: string): Promise<void> {
      const index = globalRef.journalEntries.findIndex((x) => x.id === id)
      if (index !== -1) {
        globalRef.journalEntries[index].deleted_at = new Date().toISOString()
      }
    },
  },

  emergencyContacts: {
    async get(destinationId: string): Promise<EmergencyContact | null> {
      return SEED_EMERGENCY.find((x) => x.destination_id === destinationId) || null
    },
  },
}

// =========================================================================
// PUBLIC GATEWAY EXPORT (LIVE OR FALLBACK)
// =========================================================================

// In the current stage, we return the mock implementation directly.
// If live Supabase is configured later, we query Supabase, otherwise fall back to mock.
export const db = mockDb
