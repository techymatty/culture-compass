'use server'

import { auth } from '@clerk/nextjs/server'
import { db, Trip } from '@/lib/db'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getCurrentProfile } from '@/features/profile/actions/profileDb'

const CreateTripSchema = z.object({
  destination_id: z.string().uuid(),
  title: z.string().min(1).max(150),
  start_date: z.string().date(),
  end_date: z.string().date(),
  budget_tier: z.enum(['Budget', 'Moderate', 'Luxury']),
  travel_style: z.enum(['Fast-paced', 'Relaxed']),
})

async function getAuthUserId() {
  try {
    const { userId } = await auth()
    return userId || 'mock_user_clerk_id'
  } catch {
    return 'mock_user_clerk_id'
  }
}

export async function getUserTrips(): Promise<Trip[]> {
  const userId = await getAuthUserId()
  if (!userId) return []
  await getCurrentProfile()
  return db.trips.list(userId)
}

export async function createTripAction(payload: unknown) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return { success: false, error: 'Unauthorized' }

    await getCurrentProfile()

    const validated = CreateTripSchema.parse(payload)

    // Calculate a mock sustainability rating (will be enriched by Gemini later)
    const carbonFootprintKg = validated.travel_style === 'Relaxed' ? 85.5 : 155.0
    const sustainabilityGrade = validated.travel_style === 'Relaxed' ? 'A' : 'C'

    const trip = await db.trips.create(userId, {
      destination_id: validated.destination_id,
      title: validated.title,
      start_date: validated.start_date,
      end_date: validated.end_date,
      budget_tier: validated.budget_tier,
      travel_style: validated.travel_style,
      sustainability_grade: sustainabilityGrade,
      carbon_footprint_kg: carbonFootprintKg,
    })

    // Auto-populate itinerary days
    const start = new Date(validated.start_date)
    const end = new Date(validated.end_date)
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    for (let i = 1; i <= durationDays; i++) {
      const currentDayDate = new Date(start)
      currentDayDate.setDate(start.getDate() + i - 1)
      await db.itineraryDays.create({
        trip_id: trip.id,
        day_number: i,
        date: currentDayDate.toISOString().split('T')[0],
        notes: `Day ${i} exploring the cultural landmarks.`,
      })
    }

    revalidatePath('/dashboard')
    return { success: true, data: trip }
  } catch (error) {
    console.error('createTripAction error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten().fieldErrors }
    }
    return { success: false, error: 'Failed to create trip' }
  }
}

export async function deleteTripAction(tripId: string) {
  try {
    const userId = await getAuthUserId()
    if (!userId) return { success: false, error: 'Unauthorized' }

    await getCurrentProfile()

    const trip = await db.trips.get(tripId)
    if (!trip) return { success: false, error: 'Trip not found' }

    await db.trips.delete(tripId)
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete trip:', error)
    return { success: false, error: 'Failed to delete trip' }
  }
}
