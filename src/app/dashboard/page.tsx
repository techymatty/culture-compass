import React from 'react'
import Link from 'next/link'
import { getCurrentProfile } from '@/features/profile/actions/profileDb'
import { getUserTrips } from '@/features/itineraries/actions/itineraryDb'
import { getUserQuests } from '@/features/gamification/actions/gamificationDb'
import {
  Calendar,
  Compass,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const profile = await getCurrentProfile()
  const trips = await getUserTrips()
  const quests = await getUserQuests()

  const completedQuests = quests.filter((q) => q.status === 'COMPLETED').length
  const activeQuests = quests.filter((q) => q.status === 'IN_PROGRESS')

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome Banner */}
      <section className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl md:flex-row md:items-center md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-400">
            <Sparkles className="h-4 w-4" />
            <span>Welcome back</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Where to next, {profile?.display_name || 'Traveler'}?
          </h2>
          <p className="max-w-lg text-sm text-neutral-400 md:text-base">
            Immerse yourself in history, culture, and traditions. Explore custom itineraries and
            unlock heritage achievements.
          </p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Link
            href="/dashboard/planner"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:opacity-90"
          >
            <Calendar className="h-4 w-4" />
            Plan Itinerary
          </Link>
          <Link
            href="/dashboard/explore"
            className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-800"
          >
            <Compass className="h-4 w-4" />
            Explore Places
          </Link>
        </div>
      </section>

      {/* Grid Layout for Profile DNA & Quests progress */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Culture DNA Card */}
        <section className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl transition-all hover:border-neutral-700/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
                <Compass className="h-5 w-5 text-indigo-400" />
                Culture DNA
              </h3>
              <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Active
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-neutral-400">Travel Personality:</div>
              <div className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-xl font-black text-neutral-100 text-transparent">
                {profile?.travel_personality || 'Unanalyzed'}
              </div>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400">
              Your profile reflects culinary curiosity and historical depth. Retake the onboarding
              quiz to refine your recommendations.
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 transition-all hover:text-indigo-300 group-hover:gap-2.5"
          >
            View DNA Strand <ArrowRight className="h-3 w-3" />
          </Link>
        </section>

        {/* Quests Summary Card */}
        <section className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl transition-all hover:border-neutral-700/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
                <Award className="h-5 w-5 text-yellow-400" />
                Quests & XP
              </h3>
              <span className="rounded border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-xs font-bold text-yellow-400">
                Level {profile?.level || 1}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-neutral-400">
                <span>XP Progress</span>
                <span>{profile?.total_xp || 0} XP</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-600"
                  style={{ width: `${(profile?.total_xp || 0) % 100}%` }}
                />
              </div>
              <p className="text-right text-[10px] text-neutral-400">
                {100 - ((profile?.total_xp || 0) % 100)} XP until Level {(profile?.level || 1) + 1}
              </p>
            </div>
            <p className="text-xs text-neutral-400">
              Completed <span className="font-bold text-neutral-200">{completedQuests}</span>{' '}
              cultural tasks.
            </p>
          </div>
          <Link
            href="/dashboard/quests"
            className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-yellow-400 transition-all hover:text-yellow-300 group-hover:gap-2.5"
          >
            Go to Quests Hub <ArrowRight className="h-3 w-3" />
          </Link>
        </section>

        {/* Travel Memoirs summary */}
        <section className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl transition-all hover:border-neutral-700/60">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
                <BookOpen className="h-5 w-5 text-pink-400" />
                Travel Journal
              </h3>
              <span className="rounded border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-pink-400">
                Memoirs
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-neutral-400">Preserved Stories</div>
              <div className="text-3xl font-black text-neutral-100">
                {profile?.level === 1 ? 0 : 2}
              </div>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400">
              Refine your rough journals into polished narratives with Gemini storytelling to
              compile your custom Memory Book.
            </p>
          </div>
          <Link
            href="/dashboard/journal"
            className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-pink-400 transition-all hover:text-pink-300 group-hover:gap-2.5"
          >
            Review Journal entries <ArrowRight className="h-3 w-3" />
          </Link>
        </section>
      </div>

      {/* Active Trips / Itineraries Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-neutral-200">Active Excursions</h3>
          {trips.length > 0 && (
            <Link
              href="/dashboard/planner"
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              All Trips <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/20 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-neutral-500">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-md font-semibold text-neutral-200">
                No active excursions planned
              </h4>
              <p className="mx-auto max-w-sm text-xs text-neutral-400">
                Generate a custom, carbon-analyzed itinerary tailored to your interests and budget
                parameters.
              </p>
            </div>
            <Link
              href="/dashboard/planner"
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-200 transition hover:bg-neutral-800"
            >
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 backdrop-blur-xl transition-all hover:border-neutral-700/60"
              >
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="line-clamp-1 text-lg font-bold leading-tight text-neutral-200">
                      {trip.title}
                    </h4>
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-400">
                      Grade {trip.sustainability_grade}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Active Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">{trip.start_date}</span>
                      <span>to</span>
                      <span className="font-semibold text-neutral-200">{trip.end_date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-900 bg-neutral-950/60 px-5 py-3.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    {trip.budget_tier} • {trip.travel_style}
                  </span>
                  <Link
                    href={`/dashboard/planner?tripId=${trip.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300"
                  >
                    Itinerary <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Quests List */}
      {activeQuests.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight text-neutral-200">
            Daily Cultural Quests
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeQuests.map((quest) => (
              <div
                key={quest.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl transition hover:border-neutral-700/60"
              >
                <div className="space-y-1">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-100">
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                    {quest.title}
                  </h4>
                  <p className="text-xs text-neutral-400">{quest.description}</p>
                </div>
                <Link
                  href="/dashboard/quests"
                  className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition hover:bg-neutral-800"
                >
                  Verify <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
