'use server'

import { auth } from '@clerk/nextjs/server'
import { db, UserQuest, FoodPassportEntry } from '@/lib/db'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getCurrentProfile } from '@/features/profile/actions/profileDb'

const AddFoodStampSchema = z.object({
  destination_id: z.string().uuid(),
  dish_name: z.string().min(1).max(100),
  cultural_significance: z.string().min(1),
  photo_url: z.string().url().nullable().optional(),
  user_notes: z.string().nullable().optional(),
})

async function getAuthUserId() {
  try {
    const { userId } = await auth()
    return userId || 'mock_user_clerk_id'
  } catch {
    return 'mock_user_clerk_id'
  }
}

export async function getUserQuests(): Promise<UserQuest[]> {
  const userId = await getAuthUserId()
  if (!userId) return []

  await getCurrentProfile()
  const quests = await db.quests.list(userId)

  // Seed initial quests if empty
  if (quests.length === 0) {
    await db.quests.create(userId, {
      quest_key: 'learn_greetings',
      title: 'Local Conversationalist',
      description: 'Learn and practice 3 common local greetings with pronunciation.',
      xp_reward: 50,
    })
    await db.quests.create(userId, {
      quest_key: 'taste_cuisine',
      title: 'Gastronomy Discovery',
      description: 'Taste a traditional dish and record its origin in your Food Passport.',
      xp_reward: 50,
    })
    await db.quests.create(userId, {
      quest_key: 'visit_heritage',
      title: 'Heritage Chronicler',
      description: 'Explore a UNESCO World Heritage site or historical monument.',
      xp_reward: 100,
    })
    return db.quests.list(userId)
  }

  return quests
}

export async function completeQuestAction(questId: string) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return { success: false, error: 'Unauthorized' }

    await getCurrentProfile()

    const quest = await db.quests.complete(questId, userId)
    revalidatePath('/dashboard/quests')
    revalidatePath('/dashboard/profile')
    return { success: true, data: quest }
  } catch (error) {
    console.error('Failed to complete quest:', error)
    return { success: false, error: 'Failed to complete quest' }
  }
}

export async function addFoodStampAction(payload: unknown) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return { success: false, error: 'Unauthorized' }

    await getCurrentProfile()

    const validated = AddFoodStampSchema.parse(payload)

    const stamp = await db.foodPassport.create(userId, {
      destination_id: validated.destination_id,
      dish_name: validated.dish_name,
      cultural_significance: validated.cultural_significance,
      photo_url: validated.photo_url || null,
      user_notes: validated.user_notes || null,
    })

    revalidatePath('/dashboard/quests/food-passport')
    revalidatePath('/dashboard/profile')
    return { success: true, data: stamp }
  } catch (error) {
    console.error('addFoodStampAction error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten().fieldErrors }
    }
    return { success: false, error: 'Failed to add food stamp' }
  }
}

export async function getFoodPassportEntries(): Promise<FoodPassportEntry[]> {
  const userId = await getAuthUserId()
  if (!userId) return []
  await getCurrentProfile()
  return db.foodPassport.list(userId)
}
