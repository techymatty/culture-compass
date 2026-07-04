'use client'

import React, { useState, useTransition } from 'react'
import {
  aiDiscoverDestination,
  aiGetHiddenGems,
} from '@/features/destinations/actions/destinationAi'
import { getEmergencyContact } from '@/features/destinations/actions/destinationDb'
import { Destination, HiddenGem, EmergencyContact } from '@/lib/db'
import {
  Search,
  MapPin,
  Flame,
  CloudSun,
  Bus,
  ShieldAlert,
  Loader2,
  Sparkles,
  Compass,
} from 'lucide-react'

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState<Destination | null>(null)
  const [gems, setGems] = useState<HiddenGem[]>([])
  const [emergency, setEmergency] = useState<EmergencyContact | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    startTransition(async () => {
      try {
        const dest = await aiDiscoverDestination(query)
        setDestination(dest)

        if (dest) {
          const [gemList, emergencyContact] = await Promise.all([
            aiGetHiddenGems(dest.name, dest.id),
            getEmergencyContact(dest.id),
          ])
          setGems(gemList)
          setEmergency(emergencyContact)
        }
      } catch (err) {
        console.error('Failed searching destination:', err)
      }
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Search Header */}
      <section className="space-y-4 py-6 text-center">
        <h2 className="flex items-center justify-center gap-2 text-3xl font-black tracking-tight text-white md:text-4xl">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          AI Destination Discovery
        </h2>
        <p className="mx-auto max-w-lg text-sm text-neutral-400">
          Query destinations using natural language (e.g., &quot;quiet temples in Kyoto&quot;,
          &quot;romantic street in Paris&quot;) to unlock cultural stories.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto flex max-w-2xl gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-1.5 backdrop-blur-xl transition focus-within:border-indigo-500/50"
        >
          <div className="relative flex flex-1 items-center pl-3">
            <Search className="absolute left-3 h-5 w-5 text-neutral-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where does your curiosity lead you?"
              className="w-full bg-transparent py-2 pl-8 pr-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Searching
              </>
            ) : (
              'Discover'
            )}
          </button>
        </form>
      </section>

      {/* Discovery Results */}
      {destination && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Destination Details */}
          <div className="space-y-8 lg:col-span-2">
            <section className="relative space-y-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {destination.region || 'Region'}, {destination.country}
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold text-white">{destination.name}</h3>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
                  Overview
                </h4>
                <p className="text-sm leading-relaxed text-neutral-400">
                  {destination.description}
                </p>
              </div>

              {destination.history_summary && (
                <div className="space-y-4 border-t border-neutral-900 pt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
                    Heritage & History
                  </h4>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    {destination.history_summary}
                  </p>
                </div>
              )}

              {/* Weather & Transit Grid */}
              <div className="grid grid-cols-1 gap-6 border-t border-neutral-900 pt-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-200">
                    <CloudSun className="h-4 w-4 text-amber-400" /> Weather Insights
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-400">
                    <li>
                      <span className="font-semibold text-neutral-300">Spring:</span>{' '}
                      {destination.weather_insights.spring || 'N/A'}
                    </li>
                    <li>
                      <span className="font-semibold text-neutral-300">Summer:</span>{' '}
                      {destination.weather_insights.summer || 'N/A'}
                    </li>
                    <li>
                      <span className="font-semibold text-neutral-300">Autumn:</span>{' '}
                      {destination.weather_insights.autumn || 'N/A'}
                    </li>
                    <li>
                      <span className="font-semibold text-neutral-300">Winter:</span>{' '}
                      {destination.weather_insights.winter || 'N/A'}
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-200">
                    <Bus className="h-4 w-4 text-emerald-400" /> Transit Guide
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-400">
                    <li>
                      <span className="font-semibold text-neutral-300">Primary:</span>{' '}
                      {destination.transportation_tips.primary || 'N/A'}
                    </li>
                    <li>
                      <span className="font-semibold text-neutral-300">Pass Recommendation:</span>{' '}
                      {destination.transportation_tips.pass || 'N/A'}
                    </li>
                    <li>
                      <span className="font-semibold text-neutral-300">Pedestrian rating:</span>{' '}
                      {destination.transportation_tips.walking || 'N/A'}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Hidden Gems Section */}
            {gems.length > 0 && (
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-200">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Hidden Gems Curation
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {gems.map((gem, i) => (
                    <div
                      key={gem.id || i}
                      className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl transition hover:border-neutral-700/60"
                    >
                      <div className="space-y-1">
                        <span className="block w-fit rounded border border-orange-400/20 bg-orange-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                          {gem.category}
                        </span>
                        <h4 className="text-md font-bold text-neutral-100">{gem.name}</h4>
                      </div>
                      <p className="text-xs leading-relaxed text-neutral-400">{gem.description}</p>
                      <div className="border-t border-neutral-900/60 pt-3 text-xs text-neutral-500">
                        <span className="font-semibold text-neutral-400">
                          Cultural Significance:
                        </span>{' '}
                        {gem.cultural_significance}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Interactive Heatmap & Emergency Panel */}
          <div className="space-y-8">
            {/* SVG Heatmap Diagram */}
            <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl">
              <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
                <Flame className="h-5 w-5 text-red-500" />
                Crowd Density Heatmap
              </h3>
              <p className="text-xs leading-relaxed text-neutral-400">
                Visualizing live crowd levels. Purple regions indicate high concentrations; orange
                hotspots represent underrated hidden places.
              </p>

              {/* Glowing SVG Heatmap Visualizer */}
              <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-inner">
                <svg
                  className="h-full w-full opacity-60"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid Lines */}
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#1f1f1f" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#1f1f1f" strokeWidth="0.5" />
                  <line x1="0" y1="75" x2="100" y2="75" stroke="#1f1f1f" strokeWidth="0.5" />
                  <line x1="25" y1="0" x2="25" y2="100" stroke="#1f1f1f" strokeWidth="0.5" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#1f1f1f" strokeWidth="0.5" />
                  <line x1="75" y1="0" x2="75" y2="100" stroke="#1f1f1f" strokeWidth="0.5" />

                  {/* Heatmap rings */}
                  <circle cx="50" cy="50" r="18" fill="url(#purpleGlow)" opacity="0.8" />
                  <circle cx="30" cy="40" r="10" fill="url(#orangeGlow)" opacity="0.6" />
                  <circle cx="70" cy="60" r="8" fill="url(#orangeGlow)" opacity="0.7" />

                  <defs>
                    <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Heatmap markers */}
                <div className="absolute left-[28%] top-[35%] flex flex-col items-center">
                  <div className="h-2 w-2 animate-ping rounded-full bg-orange-500" />
                  <span className="mt-1 rounded border border-orange-500/20 bg-neutral-950/80 px-1 text-[9px] font-bold text-orange-400">
                    Gio-ji Gem
                  </span>
                </div>
                <div className="absolute left-[48%] top-[48%] flex flex-col items-center">
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-purple-500" />
                  <span className="mt-1 rounded border border-purple-500/20 bg-neutral-950/80 px-1 text-[9px] font-bold text-purple-400">
                    Town Center (Crowded)
                  </span>
                </div>
              </div>

              <div className="flex justify-around gap-4 text-[10px] font-bold text-neutral-400">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Crowded
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500" /> Underrated
                </span>
              </div>
            </section>

            {/* Emergency Contacts Panel */}
            <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl">
              <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                Emergency Assistant
              </h3>
              <p className="text-xs text-neutral-400">
                Immediate contact numbers and nearest hospital guidelines for {destination.name}.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-400">Police</span>
                  <span className="font-bold text-neutral-200">
                    {emergency?.local_police || '112'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-400">Ambulance</span>
                  <span className="font-bold text-neutral-200">
                    {emergency?.local_ambulance || '112'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-400">Fire Department</span>
                  <span className="font-bold text-neutral-200">
                    {emergency?.local_fire || '112'}
                  </span>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="block text-neutral-400">Nearest Hospital:</span>
                  <span className="block font-bold text-neutral-200">
                    {emergency?.nearest_hospital_name || 'General District Clinic'}
                  </span>
                </div>
              </div>

              {emergency?.safety_guidelines && (
                <div className="border-t border-neutral-900 pt-3 text-[11px] leading-relaxed text-neutral-400">
                  <span className="font-semibold text-neutral-300">Safety Tip:</span>{' '}
                  {emergency.safety_guidelines}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!destination && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/10 p-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-neutral-500">
            <Compass className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-md font-bold text-neutral-300">Begin your exploration</h4>
            <p className="mx-auto max-w-sm text-xs text-neutral-400">
              Type Kyoto, Rome, or Paris to instantly pull seed guides, or search any destination
              globally to run live Gemini parsing.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
