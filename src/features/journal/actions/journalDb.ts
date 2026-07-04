'use server'

import { auth } from '@clerk/nextjs/server'
import { db, JournalEntry } from '@/lib/db'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getCurrentProfile } from '@/features/profile/actions/profileDb'

const CreateJournalSchema = z.object({
  trip_id: z.string().nullable().optional(),
  title: z.string().min(1).max(150),
  raw_content: z.string().min(1),
  generated_narrative: z.string().nullable().optional(),
  photo_urls: z.array(z.string().url()).default([]),
})

async function getAuthUserId() {
  try {
    const { userId } = await auth()
    return userId || 'mock_user_clerk_id'
  } catch {
    return 'mock_user_clerk_id'
  }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const userId = await getAuthUserId()
  if (!userId) return []
  await getCurrentProfile()
  return db.journalEntries.list(userId)
}

export async function createJournalEntryAction(payload: unknown) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return { success: false, error: 'Unauthorized' }

    await getCurrentProfile()

    const validated = CreateJournalSchema.parse(payload)

    const entry = await db.journalEntries.create(userId, {
      trip_id: validated.trip_id || null,
      title: validated.title,
      raw_content: validated.raw_content,
      generated_narrative: validated.generated_narrative || null,
      photo_urls: validated.photo_urls,
    })

    revalidatePath('/dashboard/journal')
    return { success: true, data: entry }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten().fieldErrors }
    }
    return { success: false, error: 'Failed to create journal entry' }
  }
}

export async function deleteJournalEntryAction(entryId: string) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return { success: false, error: 'Unauthorized' }

    await getCurrentProfile()

    await db.journalEntries.delete(entryId)
    revalidatePath('/dashboard/journal')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete journal entry:', error)
    return { success: false, error: 'Failed to delete journal entry' }
  }
}
