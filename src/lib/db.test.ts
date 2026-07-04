import { describe, it, expect, beforeEach } from 'vitest'
import { db } from './db'

describe('Mock Database & Fallback Layer', () => {
  const testClerkId = 'test_user_clerk_id'

  beforeEach(async () => {
    // Sync/Create profile for test user
    await db.profiles.create({
      clerk_id: testClerkId,
      email: 'test@culturecompass.ai',
      display_name: 'Test Explorer',
      avatar_url: null,
      travel_personality: null,
      culture_dna: {},
    })
  })

  describe('Profiles Operations', () => {
    it('should retrieve a synced profile', async () => {
      const profile = await db.profiles.get(testClerkId)
      expect(profile).not.toBeNull()
      expect(profile?.email).toBe('test@culturecompass.ai')
      expect(profile?.total_xp).toBe(0)
      expect(profile?.level).toBe(1)
    })

    it('should award XP and level up', async () => {
      let profile = await db.profiles.addXp(testClerkId, 50)
      expect(profile.total_xp).toBe(50)
      expect(profile.level).toBe(1)

      profile = await db.profiles.addXp(testClerkId, 100)
      expect(profile.total_xp).toBe(150)
      // Level = Math.floor(150 / 100) + 1 = 2
      expect(profile.level).toBe(2)
    })

    it('should update travel personality and culture DNA', async () => {
      const dna = { cuisines: ['Italian'], monuments: ['Colosseum'] }
      const profile = await db.profiles.update(testClerkId, {
        travel_personality: 'Heritage Explorer',
        culture_dna: dna,
      })

      expect(profile.travel_personality).toBe('Heritage Explorer')
      expect(profile.culture_dna).toEqual(dna)
    })
  })

  describe('Trips Operations', () => {
    it('should create and list trips', async () => {
      const trip = await db.trips.create(testClerkId, {
        destination_id: 'd1111111-1111-1111-1111-111111111111',
        title: 'Kyoto Cultural Spring',
        start_date: '2026-04-10',
        end_date: '2026-04-17',
        budget_tier: 'Moderate',
        travel_style: 'Relaxed',
        sustainability_grade: 'A',
        carbon_footprint_kg: 85.0,
      })

      expect(trip.title).toBe('Kyoto Cultural Spring')

      const activeTrips = await db.trips.list(testClerkId)
      expect(activeTrips.length).toBeGreaterThan(0)
      expect(activeTrips[0].title).toBe('Kyoto Cultural Spring')
    })

    it('should soft delete trips', async () => {
      const trip = await db.trips.create(testClerkId, {
        destination_id: 'd1111111-1111-1111-1111-111111111111',
        title: 'Trip to Delete',
        start_date: '2026-05-01',
        end_date: '2026-05-05',
        budget_tier: 'Moderate',
        travel_style: 'Relaxed',
        sustainability_grade: 'B',
        carbon_footprint_kg: 100.0,
      })

      const beforeDelete = await db.trips.list(testClerkId)
      expect(beforeDelete.some((t) => t.id === trip.id)).toBe(true)

      await db.trips.delete(trip.id)

      const afterDelete = await db.trips.list(testClerkId)
      expect(afterDelete.some((t) => t.id === trip.id)).toBe(false)

      const rawTripObj = await db.trips.get(trip.id)
      expect(rawTripObj).toBeNull() // Excluded from active getters
    })
  })

  describe('Gamification & Passport Quests', () => {
    it('should assign and complete quests and award XP', async () => {
      const quest = await db.quests.create(testClerkId, {
        quest_key: 'test_badge',
        title: 'Test Quest',
        description: 'Complete a unit test.',
        xp_reward: 75,
      })

      expect(quest.status).toBe('IN_PROGRESS')

      const profileBefore = await db.profiles.get(testClerkId)
      const initialXp = profileBefore?.total_xp || 0

      const completed = await db.quests.complete(quest.id, testClerkId)
      expect(completed.status).toBe('COMPLETED')
      expect(completed.completed_at).not.toBeNull()

      const profileAfter = await db.profiles.get(testClerkId)
      expect(profileAfter?.total_xp).toBe(initialXp + 75)
    })
  })
})
