'use server'

import { db, Destination, HiddenGem, EmergencyContact } from '@/lib/db'

export async function getDestinations(): Promise<Destination[]> {
  return db.destinations.list()
}

export async function searchDestinations(query: string): Promise<Destination[]> {
  if (!query) return db.destinations.list()
  return db.destinations.search(query)
}

export async function getHiddenGems(destinationId: string): Promise<HiddenGem[]> {
  return db.hiddenGems.listByDestination(destinationId)
}

export async function getEmergencyContact(destinationId: string): Promise<EmergencyContact | null> {
  return db.emergencyContacts.get(destinationId)
}
