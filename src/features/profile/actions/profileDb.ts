'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { db, Profile } from '@/lib/db'
import { z } from 'zod'

const UpdateProfileSchema = z.object({
  travel_personality: z.string().min(1).max(100),
  culture_dna: z.record(z.string(), z.any()),
})

// Bypasses Clerk authentication checks if environment variables are not set (demo mode)
async function getAuthUserId() {
  try {
    const { userId } = await auth()
    return userId || 'mock_user_clerk_id'
  } catch {
    return 'mock_user_clerk_id'
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const userId = await getAuthUserId()
  if (!userId) return null

  let profile = await db.profiles.get(userId)

  // Auto-sync profile if we are in Clerk mode and it doesn't exist in our DB
  if (!profile && userId !== 'mock_user_clerk_id') {
    try {
      const user = await currentUser()
      if (user) {
        profile = await db.profiles.create({
          clerk_id: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          display_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Traveler',
          avatar_url: user.imageUrl || null,
          travel_personality: null,
          culture_dna: {},
        })
      }
    } catch (e) {
      console.error('Error syncing clerk profile:', e)
    }
  }

  // Fallback profile creation in local offline/mock mode
  if (!profile && userId === 'mock_user_clerk_id') {
    profile = await db.profiles.create({
      clerk_id: 'mock_user_clerk_id',
      email: 'explorer@culturecompass.ai',
      display_name: 'Guest Traveler',
      avatar_url: null,
      travel_personality: 'Heritage Explorer',
      culture_dna: {
        preferred_cuisines: ['Japanese', 'Italian'],
        preferred_architecture: ['Traditional', 'Renaissance'],
      },
    })
  }

  return profile
}

export async function updateCultureDna(payload: unknown) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return { success: false, error: 'Unauthorized' }

    const validated = UpdateProfileSchema.parse(payload)
    const profile = await db.profiles.update(userId, {
      travel_personality: validated.travel_personality,
      culture_dna: validated.culture_dna,
    })

    return { success: true, data: profile }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten().fieldErrors }
    }
    return { success: false, error: 'Failed to update Culture DNA' }
  }
}

export async function updateProfilePersonaAction(travelPersonality: string) {
  return updateCultureDna({
    travel_personality: travelPersonality,
    culture_dna: {},
  })
}
