import { describe, it, expect } from 'vitest'
import {
  aiDiscoverDestination,
  aiGetHiddenGems,
} from '@/features/destinations/actions/destinationAi'
import {
  aiGenerateImmersiveStory,
  aiTimeMachineStory,
} from '@/features/storytelling/actions/storytellingAi'
import {
  aiGenerateItinerary,
  aiAnalyzeSustainability,
} from '@/features/itineraries/actions/itineraryAi'
import {
  aiGenerateSurvivalPhrases,
  aiSimulateConversation,
} from '@/features/gamification/actions/gamificationAi'
import { aiNarrateJournalLog } from '@/features/journal/actions/journalAi'

describe('AI Services Offline Fallback Layer', () => {
  it('should resolve destination discovery cache when offline', async () => {
    const destination = await aiDiscoverDestination('Kyoto')
    expect(destination.name).toBe('Kyoto')
    expect(destination.country).toBe('Japan')
    expect(destination.weather_insights).toHaveProperty('spring')
    expect(destination.lat).toBe(35.0116)
  })

  it('should resolve hidden gems cache when offline', async () => {
    const gems = await aiGetHiddenGems('Kyoto', 'd1111111-1111-1111-1111-111111111111')
    expect(gems.length).toBeGreaterThan(0)
    expect(gems[0].name).toBe('Gio-ji Temple')
    expect(gems[0].destination_id).toBe('d1111111-1111-1111-1111-111111111111')
  })

  it('should resolve immersive narrative stories when offline', async () => {
    const story = await aiGenerateImmersiveStory('Kyoto', 'Spring', 'Sunny', 'Evening', 'None')
    expect(story).toContain('incense')
    expect(story).toContain('Arashiyama')
  })

  it('should resolve Time Machine historical stories when offline', async () => {
    const story = await aiTimeMachineStory('Kyoto', 'Heian')
    expect(story).toContain('Heian-kyo')
    expect(story).toContain('Emperor')
  })

  it('should resolve itinerary planner when offline', async () => {
    const itinerary = await aiGenerateItinerary('Kyoto', 3, 'Moderate', 'Relaxed', 'History')
    expect(itinerary).toHaveProperty('days')
    expect(itinerary.days.length).toBeGreaterThan(0)
    expect(itinerary.days[0].activities.length).toBeGreaterThan(0)
  })

  it('should resolve sustainability analysis when offline', async () => {
    const analysis = await aiAnalyzeSustainability('Kyoto itinerary details')
    expect(analysis.sustainability_grade).toBe('A')
    expect(analysis.carbon_footprint_kg).toBeGreaterThan(0)
    expect(analysis.alternatives.length).toBeGreaterThan(0)
  })

  it('should resolve survival phrases when offline', async () => {
    const phrases = await aiGenerateSurvivalPhrases('Kyoto')
    expect(phrases.length).toBe(3)
    expect(phrases[0]).toHaveProperty('english')
    expect(phrases[0]).toHaveProperty('phonetic')
  })

  it('should resolve conversation simulation when offline', async () => {
    const response = await aiSimulateConversation('Order food', '', 'Matcha please')
    expect(response).toHaveProperty('reply')
    expect(response).toHaveProperty('feedback')
    expect(response.is_correct).toBe(true)
  })

  it('should resolve narrative journal writing when offline', async () => {
    const memoir = await aiNarrateJournalLog(
      'Visited Gio-ji temple moss garden, quiet, met kind monk',
    )
    expect(memoir).toContain('Kyoto')
    expect(memoir).toContain('moss')
  })
})
