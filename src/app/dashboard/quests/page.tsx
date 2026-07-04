'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { getDestinations } from '@/features/destinations/actions/destinationDb'
import { getCurrentProfile } from '@/features/profile/actions/profileDb'
import {
  getUserQuests,
  completeQuestAction,
  getFoodPassportEntries,
  addFoodStampAction,
} from '@/features/gamification/actions/gamificationDb'
import { Destination, Profile, UserQuest, FoodPassportEntry } from '@/lib/db'
import {
  Award,
  Flame,
  CheckCircle,
  Clock,
  UtensilsCrossed,
  BookOpen,
  MapPin,
  Camera,
  Loader2,
} from 'lucide-react'

export default function QuestsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [quests, setQuests] = useState<UserQuest[]>([])
  const [passport, setPassport] = useState<FoodPassportEntry[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])

  // Food Stamp Form States
  const [selectedDestId, setSelectedDestId] = useState('')
  const [dishName, setDishName] = useState('')
  const [culturalSignificance, setCulturalSignificance] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [userNotes, setUserNotes] = useState('')

  const [isPending, startTransition] = useTransition()

  // Load user data
  const loadData = async () => {
    try {
      const [prof, questList, stampList, destList] = await Promise.all([
        getCurrentProfile(),
        getUserQuests(),
        getFoodPassportEntries(),
        getDestinations(),
      ])
      setProfile(prof)
      setQuests(questList)
      setPassport(stampList)
      setDestinations(destList)
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

  // Trigger quest completion
  const handleCompleteQuest = async (questId: string) => {
    startTransition(async () => {
      try {
        const result = await completeQuestAction(questId)
        if (result.success) {
          // Reload profile & quests
          await loadData()
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  // Handle adding new food stamp
  const handleAddFoodStamp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dishName.trim() || !culturalSignificance.trim()) return

    startTransition(async () => {
      try {
        const activeDestId = selectedDestId || (destinations.length > 0 ? destinations[0].id : '')
        const result = await addFoodStampAction({
          destination_id: activeDestId,
          dish_name: dishName,
          cultural_significance: culturalSignificance,
          photo_url: photoUrl || undefined,
          user_notes: userNotes || undefined,
        })
        if (result.success) {
          // Reset form fields
          setDishName('')
          setCulturalSignificance('')
          setPhotoUrl('')
          setUserNotes('')
          // Reload data
          await loadData()
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Level Header Section */}
      {profile && (
        <section className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl md:flex-row md:items-center md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-orange-500/10" />
          <div className="relative space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-yellow-400">
              <Award className="h-4 w-4" />
              <span>Adventurer Level</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Level {profile.level} Traveler</h2>
            <p className="max-w-md text-sm text-neutral-400">
              Earn XP by completing daily cultural quests and stamping local specialties in your
              Food Passport.
            </p>
          </div>

          <div className="relative w-full space-y-2 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4 md:w-80">
            <div className="flex justify-between text-xs font-bold text-neutral-400">
              <span>XP Gauge</span>
              <span className="text-yellow-400">{profile.total_xp} Total XP</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full border border-neutral-800 bg-neutral-950">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-600"
                style={{ width: `${profile.total_xp % 100}%` }}
              />
            </div>
            <span className="block text-right text-[9px] font-medium text-neutral-500">
              {100 - (profile.total_xp % 100)} XP until Level {profile.level + 1}
            </span>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Quests lists */}
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-200">
              <Flame className="h-5 w-5 text-orange-500" />
              Active Cultural Quests
            </h3>

            <div className="space-y-4">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition ${
                    quest.status === 'COMPLETED'
                      ? 'border-neutral-900 bg-neutral-950/10 opacity-60'
                      : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-yellow-500/20 bg-yellow-500/10 px-1.5 py-0.5 text-[10px] font-bold text-yellow-400">
                        +{quest.xp_reward} XP
                      </span>
                      <h4 className="text-sm font-bold text-neutral-100">{quest.title}</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-400">{quest.description}</p>
                  </div>

                  {quest.status === 'COMPLETED' ? (
                    <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle className="h-4 w-4" /> Earned
                    </span>
                  ) : (
                    <button
                      disabled={isPending}
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-bold text-neutral-200 transition hover:bg-neutral-800"
                    >
                      {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      Claim XP
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Food Passport Stamp Gallery */}
          <section className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-200">
              <UtensilsCrossed className="h-5 w-5 text-indigo-400" />
              Food Passport Stamps
            </h3>

            {passport.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/20 p-12 text-center">
                <UtensilsCrossed className="h-8 w-8 text-neutral-500" />
                <h4 className="text-sm font-bold text-neutral-300">Passport is empty</h4>
                <p className="text-xs text-neutral-400">
                  Stamp your first dish using the logger on the right to start your log.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {passport.map((entry) => (
                  <div
                    key={entry.id}
                    className="relative space-y-3 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
                  >
                    <div className="absolute right-2 top-2 rounded border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-indigo-400">
                      Stamp +20 XP
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-md font-extrabold text-neutral-100">{entry.dish_name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <MapPin className="h-3 w-3 text-indigo-400" />
                        <span>Tasted on: {entry.tasted_at.split('T')[0]}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-neutral-400">
                      {entry.cultural_significance}
                    </p>
                    {entry.user_notes && (
                      <div className="border-t border-neutral-800 pt-2 text-[10px] italic text-neutral-500">
                        Notes: {entry.user_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Stamp Logger Form */}
        <section className="h-fit space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl">
          <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            Stamp Passport
          </h3>
          <p className="text-xs leading-relaxed text-neutral-400">
            Sampled a traditional culinary dish? Stamp it inside your passport to record its
            cultural background and gain 20 XP.
          </p>

          <form onSubmit={handleAddFoodStamp} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-400">Destination</label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:outline-none"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-400">Dish Name</label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Kyoto Yudofu, Rome Carbonara"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-400">
                Cultural & Historical Significance
              </label>
              <textarea
                value={culturalSignificance}
                onChange={(e) => setCulturalSignificance(e.target.value)}
                rows={3}
                placeholder="Describe where it originated, key ingredients, or the ceremony behind serving it."
                className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-400">Photo URL (Optional)</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/food.jpg"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-medium text-neutral-400">
                My Review / Tasting Notes (Optional)
              </label>
              <input
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Creamy, subtle sesame flavors"
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Stamping Passport
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" /> Stamp Passport (+20 XP)
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
