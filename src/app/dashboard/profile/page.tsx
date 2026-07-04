'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { getCurrentProfile, updateProfilePersonaAction } from '@/features/profile/actions/profileDb'
import {
  getUserQuests,
  getFoodPassportEntries,
} from '@/features/gamification/actions/gamificationDb'
import { Profile } from '@/lib/db'
import { User, Compass, Award, Sparkles, Loader2 } from 'lucide-react'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is your primary interest when traveling?',
    options: [
      { text: 'Uncovering ancient ruins and historical monuments', score: 'Historical Explorer' },
      { text: 'Sampling street food and historic recipes', score: 'Culinary Scribe' },
      { text: 'Zen temples and meditating in quiet gardens', score: 'Mindful Wanderer' },
      { text: 'Local traditional crafts and art festivals', score: 'Artisan Collector' },
    ],
  },
  {
    id: 2,
    question: 'What is your preferred pace when visiting a new city?',
    options: [
      { text: 'Slow, spending half a day in a single moss forest', score: 'Mindful Wanderer' },
      {
        text: 'Structured, tracking historical timelines sequentially',
        score: 'Historical Explorer',
      },
      { text: 'Spontaneous, wandering between food stalls', score: 'Culinary Scribe' },
      { text: 'Active, attending local artisan workshops', score: 'Artisan Collector' },
    ],
  },
  {
    id: 3,
    question: 'How do you choose where to eat?',
    options: [
      {
        text: 'Centuries-old tea houses or trattorias recommended by locals',
        score: 'Culinary Scribe',
      },
      {
        text: 'Whatever is nearest to the museum or castle I am visiting',
        score: 'Historical Explorer',
      },
      { text: 'Quiet vegetarian temple dining or organic local farms', score: 'Mindful Wanderer' },
      {
        text: 'Design-centric cafes featuring local ceramic tablewares',
        score: 'Artisan Collector',
      },
    ],
  },
  {
    id: 4,
    question: 'What do you hope to bring home from a trip?',
    options: [
      {
        text: 'Traditional textiles, handmade papers, or local ceramics',
        score: 'Artisan Collector',
      },
      {
        text: 'Evocative stories and logs of historic architectures',
        score: 'Historical Explorer',
      },
      { text: 'Locally sourced spices, tea leaves, or family recipes', score: 'Culinary Scribe' },
      { text: 'A deep sense of peace and mental clarity', score: 'Mindful Wanderer' },
    ],
  },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [questCount, setQuestCount] = useState(0)
  const [stampCount, setStampCount] = useState(0)

  // Quiz States
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const [isPending, startTransition] = useTransition()

  const loadData = async () => {
    try {
      const [prof, quests, stamps] = await Promise.all([
        getCurrentProfile(),
        getUserQuests(),
        getFoodPassportEntries(),
      ])
      setProfile(prof)
      setQuestCount(quests.filter((q) => q.status === 'COMPLETED').length)
      setStampCount(stamps.length)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle Quiz selection
  const handleSelectOption = (scoreType: string) => {
    const nextAnswers = [...answers, scoreType]
    setAnswers(nextAnswers)

    if (currentQuestionIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate dominant personality type
      const counts: Record<string, number> = {}
      let dominant = 'Zen Historical Wanderer'
      let maxCount = 0

      for (const ans of nextAnswers) {
        counts[ans] = (counts[ans] || 0) + 1
        if (counts[ans] > maxCount) {
          maxCount = counts[ans]
          dominant = ans
        }
      }

      // Save dominant personality type
      startTransition(async () => {
        try {
          const result = await updateProfilePersonaAction(dominant)
          if (result.success) {
            setQuizStarted(false)
            setCurrentQuestionIndex(0)
            setAnswers([])
            await loadData()
          }
        } catch (err) {
          console.error(err)
        }
      })
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Profile Overview Card */}
      {profile && (
        <section className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl md:flex-row md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />

          {/* Avatar Graphic */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-2xl font-extrabold uppercase text-white shadow-lg shadow-purple-500/10">
            {profile.display_name?.charAt(0) || 'G'}
          </div>

          <div className="relative flex-1 space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-white">
              {profile.display_name || 'Guest User'}
            </h2>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400 md:justify-start">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Level {profile.level}
              </span>
              <span>•</span>
              <span>Joined July 2026</span>
            </div>
          </div>
        </section>
      )}

      {/* Grid Layout for Profile DNA Quiz & User Statistics */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Culture DNA Card & Quiz Trigger */}
        <div className="space-y-6 md:col-span-2">
          <section className="relative space-y-6 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
                <Compass className="h-5 w-5 text-indigo-400" />
                Culture DNA Identity
              </h3>
              {profile?.travel_personality && (
                <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  {profile.travel_personality}
                </span>
              )}
            </div>

            {quizStarted ? (
              // Quiz Active State
              <div className="space-y-6 text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-neutral-500">
                  <span>
                    Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span>{answers.length} Answered</span>
                </div>

                <h4 className="text-sm font-extrabold leading-snug text-neutral-200">
                  {QUIZ_QUESTIONS[currentQuestionIndex].question}
                </h4>

                <div className="space-y-2">
                  {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt.score)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 text-left font-medium text-neutral-300 transition hover:border-indigo-500/40 hover:bg-neutral-800 hover:text-white"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Quiz Inactive State
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {/* DNA Helix Double-Strand SVG Animation */}
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
                    <svg
                      className="h-16 w-16"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-indigo-400"
                      >
                        {/* Strand 1 */}
                        <path
                          d="M 10 50 Q 25 20, 40 50 T 70 50 T 100 50"
                          className="animate-[dash_4s_linear_infinite]"
                        />
                        {/* Strand 2 */}
                        <path
                          d="M 10 50 Q 25 80, 40 50 T 70 50 T 100 50"
                          stroke="#a78bfa"
                          className="animate-[dash_4s_linear_infinite]"
                        />
                        {/* Connecting base-pairs */}
                        <line x1="25" y1="35" x2="25" y2="65" stroke="#f472b6" strokeWidth="1" />
                        <line
                          x1="55"
                          y1="35"
                          x2="55"
                          y2="65"
                          stroke="#f472b6"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                      </g>
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-md font-extrabold text-neutral-200">
                      {profile?.travel_personality
                        ? 'Identity Strand Computed'
                        : 'Culture DNA Profile Pending'}
                    </h4>
                    <p className="text-xs leading-relaxed text-neutral-400">
                      {profile?.travel_personality
                        ? `Your current identity is aligned to: ${profile.travel_personality}. Take the onboarding quiz again to re-compute.`
                        : 'Answer 4 simple questions about your travel preferences to map your Culture DNA personality helix.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setQuizStarted(true)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Strand
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      {profile?.travel_personality ? 'Retake Quiz' : 'Compute DNA Profile'}
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Profile Stats */}
        <section className="h-fit space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl">
          <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
            <Award className="h-5 w-5 text-yellow-400" />
            Heritage Stats
          </h3>
          <p className="text-xs text-neutral-400">
            A comprehensive breakdown of your achievements, logs, and passport stamps.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-400">XP Points</span>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-bold text-neutral-200">
                {profile?.total_xp || 0} XP
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-400">Quests Completed</span>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-bold text-neutral-200">
                {questCount} Missions
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-400">Food Passport Stamps</span>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-bold text-neutral-200">
                {stampCount} Dishes
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-400">Unlocked Trophies</span>
              <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-bold text-neutral-200">
                {profile && profile.level >= 2 ? 1 : 0} / 5
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
