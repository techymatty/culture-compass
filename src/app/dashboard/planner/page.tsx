'use client'

import React, { useState, useEffect, useTransition, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getDestinations } from '@/features/destinations/actions/destinationDb'
import {
  createTripAction,
  getUserTrips,
  deleteTripAction,
} from '@/features/itineraries/actions/itineraryDb'
import {
  aiGenerateItinerary,
  aiAnalyzeSustainability,
} from '@/features/itineraries/actions/itineraryAi'
import { db, Destination, Trip, ItineraryDay, ItineraryActivity } from '@/lib/db'
import {
  Calendar,
  MapPin,
  Sparkles,
  Trash2,
  CheckCircle2,
  Leaf,
  Loader2,
  DollarSign,
} from 'lucide-react'

function PlannerComponent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTripId = searchParams.get('tripId')

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedDestId, setSelectedDestId] = useState('')
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('2026-07-10')
  const [endDate, setEndDate] = useState('2026-07-13')
  const [budget, setBudget] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate')
  const [style, setStyle] = useState<'Fast-paced' | 'Relaxed'>('Relaxed')
  const [interests, setInterests] = useState('')

  // Selected Trip States
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null)
  const [days, setDays] = useState<ItineraryDay[]>([])
  const [selectedDayId, setSelectedDayId] = useState('')
  const [activities, setActivities] = useState<ItineraryActivity[]>([])

  const [isPending, startTransition] = useTransition()

  // Load destinations & active trips list
  const loadData = async () => {
    try {
      const [destList, activeTrips] = await Promise.all([getDestinations(), getUserTrips()])
      setDestinations(destList)
      setTrips(activeTrips)
      if (destList.length > 0) {
        setSelectedDestId(destList[0].id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Load details if a trip is selected
  useEffect(() => {
    if (!activeTripId) {
      setActiveTrip(null)
      setDays([])
      setActivities([])
      return
    }

    startTransition(async () => {
      try {
        const trip = trips.find((t) => t.id === activeTripId) || (await db.trips.get(activeTripId))
        if (!trip) return
        setActiveTrip(trip)

        const dayList = await db.itineraryDays.list(trip.id)
        setDays(dayList)

        if (dayList.length > 0) {
          setSelectedDayId(dayList[0].id)
          const actList = await db.itineraryActivities.list(dayList[0].id)
          setActivities(actList)
        }
      } catch (err) {
        console.error(err)
      }
    })
  }, [activeTripId, trips])

  // Load activities for selected day
  const handleDaySelect = async (dayId: string) => {
    setSelectedDayId(dayId)
    try {
      const actList = await db.itineraryActivities.list(dayId)
      setActivities(actList)
    } catch (err) {
      console.error(err)
    }
  }

  // Handle generating new trip
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    const activeDestId = selectedDestId || (destinations.length > 0 ? destinations[0].id : '')
    const destinationObj = destinations.find((d) => d.id === activeDestId)
    if (!destinationObj) return

    startTransition(async () => {
      try {
        // 1. Generate structured Itinerary via Gemini (or fallback cache)
        const durationDays =
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
          ) + 1

        const rawItinerary = await aiGenerateItinerary(
          destinationObj.name,
          durationDays,
          budget,
          style,
          interests,
        )

        // 2. Generate Carbon rating via Gemini (or fallback cache)
        const sustainability = await aiAnalyzeSustainability(JSON.stringify(rawItinerary))

        // 3. Save trip structure into DB
        const tripResult = await createTripAction({
          destination_id: activeDestId,
          title: title || `Trip to ${destinationObj.name}`,
          start_date: startDate,
          end_date: endDate,
          budget_tier: budget,
          travel_style: style,
        })

        if (tripResult.success && tripResult.data) {
          const trip = tripResult.data as Trip
          // Overwrite Sustainability grades in DB record
          await db.trips.update(trip.id, {
            sustainability_grade: sustainability.sustainability_grade,
            carbon_footprint_kg: sustainability.carbon_footprint_kg,
          })

          // Save generated activities into Database
          const dayRecords = await db.itineraryDays.list(trip.id)
          for (const rawDay of rawItinerary.days) {
            const matchedDay = dayRecords.find((d) => d.day_number === rawDay.day_number)
            if (matchedDay) {
              // Update day notes
              await db.itineraryDays.create({
                ...matchedDay,
                notes: rawDay.notes,
              } as ItineraryDay)

              // Insert activities
              for (const act of rawDay.activities) {
                await db.itineraryActivities.create({
                  itinerary_day_id: matchedDay.id,
                  start_time: act.start_time,
                  end_time: act.end_time,
                  title: act.title,
                  description: act.description,
                  activity_type: act.activity_type,
                  transport_mode: act.transport_mode,
                  cost: act.cost,
                  lat: act.lat || null,
                  lng: act.lng || null,
                })
              }
            }
          }

          // Reload trips and navigate to new trip
          const activeTrips = await getUserTrips()
          setTrips(activeTrips)
          router.push(`/dashboard/planner?tripId=${trip.id}`)
        }
      } catch (err) {
        console.error('Failed generating trip:', err)
      }
    })
  }

  // Toggle activity completion status
  const handleToggleActivity = async (activityId: string, currentStatus: boolean) => {
    try {
      await db.itineraryActivities.toggleCompletion(activityId, !currentStatus)
      const actList = await db.itineraryActivities.list(selectedDayId)
      setActivities(actList)
    } catch (e) {
      console.error(e)
    }
  }

  // Delete trip
  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this excursion?')) return
    const result = await deleteTripAction(id)
    if (result.success) {
      const activeTrips = await getUserTrips()
      setTrips(activeTrips)
      router.push('/dashboard/planner')
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Planner Panel layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column: Trips list or Generator Form */}
        <div className="space-y-6">
          {/* Active Trips Selection Card */}
          <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
              <Calendar className="h-5 w-5 text-indigo-400" />
              Active Excursions
            </h3>
            {trips.length === 0 ? (
              <p className="text-xs text-neutral-400">
                No active itineraries. Complete the planner form below to generate one.
              </p>
            ) : (
              <div className="space-y-2">
                {trips.map((t) => (
                  <div key={t.id} className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/planner?tripId=${t.id}`)}
                      className={`line-clamp-1 flex-1 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                        activeTripId === t.id
                          ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-800/80'
                      }`}
                    >
                      {t.title}
                    </button>
                    <button
                      aria-label="Delete trip"
                      onClick={() => handleDeleteTrip(t.id)}
                      className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-2 text-neutral-500 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Generator Form */}
          <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI Travel Planner
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-400">Destination</label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-400">Trip Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kyoto Cherry Blossom Tour"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-medium text-neutral-400">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-medium text-neutral-400">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-medium text-neutral-400">Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value as 'Budget' | 'Moderate' | 'Luxury')}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:outline-none"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-medium text-neutral-400">Travel Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as 'Relaxed' | 'Fast-paced')}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:outline-none"
                  >
                    <option value="Relaxed">Relaxed</option>
                    <option value="Fast-paced">Fast-paced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-400">
                  Interests (Separated by comma)
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. Zen gardens, street food, heritage"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2.5 font-semibold text-white transition hover:opacity-90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Structuring Itinerary
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate Cultural Plan
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Right Columns: Active Trip Visualizer */}
        <div className="space-y-6 lg:col-span-2">
          {isPending && !activeTrip && (
            <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/20 p-16 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-purple-400" />
              <div className="space-y-1">
                <h4 className="font-bold text-neutral-300">
                  Formulating your custom travel plan...
                </h4>
                <p className="text-xs text-neutral-400">
                  Gemini is parsing historical sites, food spots, and carbon footprint ratings.
                </p>
              </div>
            </div>
          )}

          {!isPending && !activeTrip && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/20 p-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-neutral-500">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-neutral-300">Select or generate an excursion</h4>
                <p className="mx-auto max-w-sm text-xs text-neutral-400">
                  Click on an active excursion on the sidebar or fill in the parameters to generate
                  a new itinerary.
                </p>
              </div>
            </div>
          )}

          {activeTrip && (
            <div className="space-y-6">
              {/* Trip Header Overview Card */}
              <section className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl md:flex-row md:items-center">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                <div className="relative space-y-1">
                  <h3 className="text-2xl font-black text-white">{activeTrip.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" /> Planned Trip
                    </span>
                    <span>•</span>
                    <span>
                      {activeTrip.start_date} to {activeTrip.end_date}
                    </span>
                  </div>
                </div>

                {/* Sustainability Scorecard */}
                <div className="relative flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Carbon Footprint
                      </span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-1.5 text-[10px] font-extrabold text-emerald-400">
                        Grade {activeTrip.sustainability_grade}
                      </span>
                    </div>
                    <span className="text-lg font-black text-neutral-100">
                      {activeTrip.carbon_footprint_kg} kg CO₂
                    </span>
                  </div>
                </div>
              </section>

              {/* Days Navigation Timeline */}
              {days.length > 0 && (
                <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-2">
                  {days.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleDaySelect(d.id)}
                      className={`flex-shrink-0 rounded-xl border px-4 py-2 text-xs font-bold transition ${
                        selectedDayId === d.id
                          ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-md shadow-indigo-500/5'
                          : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Day {d.day_number}
                    </button>
                  ))}
                </div>
              )}

              {/* Day Note Overview */}
              {days.find((d) => d.id === selectedDayId)?.notes && (
                <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/20 p-4 text-xs italic text-neutral-400">
                  Note: {days.find((d) => d.id === selectedDayId)?.notes}
                </div>
              )}

              {/* Activities timeline */}
              <section className="space-y-4">
                <h4 className="text-md font-bold text-neutral-200">Scheduled Excursions</h4>
                {activities.length === 0 ? (
                  <p className="text-xs text-neutral-400">No scheduled activities for this day.</p>
                ) : (
                  <div className="relative ml-2 space-y-4 border-l border-neutral-800 pl-4">
                    {activities.map((act) => (
                      <div
                        key={act.id}
                        className={`relative flex items-start gap-4 rounded-xl border p-4 transition hover:border-neutral-700/60 ${
                          act.is_completed
                            ? 'border-neutral-900 bg-neutral-950/10 opacity-60'
                            : 'border-neutral-800 bg-neutral-950/40 backdrop-blur-xl'
                        }`}
                      >
                        {/* Timeline node */}
                        <div className="absolute -left-[21px] top-[22px] h-2.5 w-2.5 rounded-full border border-neutral-800 bg-neutral-950" />

                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleActivity(act.id, act.is_completed)}
                          className="mt-0.5"
                          aria-label={
                            act.is_completed ? 'Mark activity incomplete' : 'Mark activity complete'
                          }
                        >
                          <CheckCircle2
                            className={`h-5 w-5 transition ${
                              act.is_completed
                                ? 'fill-emerald-500/10 text-emerald-500'
                                : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                          />
                        </button>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-neutral-400">
                                {act.start_time} - {act.end_time} • {act.activity_type}
                              </span>
                              <h5 className="mt-0.5 text-sm font-bold text-neutral-100">
                                {act.title}
                              </h5>
                            </div>
                            <span className="flex items-center gap-0.5 text-xs font-bold text-neutral-300">
                              <DollarSign className="h-3 w-3" /> {act.cost.toFixed(0)}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-xs leading-relaxed text-neutral-400">
                              {act.description}
                            </p>
                          )}
                          <div className="flex gap-4 text-[10px] font-medium text-neutral-500">
                            <span>Transport: {act.transport_mode || 'Walk'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-2 p-12 text-xs text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading Planner...
        </div>
      }
    >
      <PlannerComponent />
    </Suspense>
  )
}
