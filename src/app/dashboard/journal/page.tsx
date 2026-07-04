'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  getJournalEntries,
  createJournalEntryAction,
  deleteJournalEntryAction,
} from '@/features/journal/actions/journalDb'
import { getUserTrips } from '@/features/itineraries/actions/itineraryDb'
import { aiNarrateJournalLog, aiCompileMemoryBook } from '@/features/journal/actions/journalAi'
import { JournalEntry, Trip } from '@/lib/db'
import { BookOpen, Sparkles, Trash2, Download, Loader2, FileText, CheckCircle2 } from 'lucide-react'

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [trips, setTrips] = useState<Trip[]>([])

  // Form States
  const [title, setTitle] = useState('')
  const [rawContent, setRawContent] = useState('')
  const [selectedTripId, setSelectedTripId] = useState('')

  // Memory Book Compilation State
  const [compileTripId, setCompileTripId] = useState('personal')
  const [compilingBook, setCompilingBook] = useState(false)
  const [bookDownloadUrl, setBookDownloadUrl] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  // Load diaries & trips
  const loadData = async () => {
    try {
      const [entryList, activeTrips] = await Promise.all([getJournalEntries(), getUserTrips()])
      setEntries(entryList)
      setTrips(activeTrips)
      if (activeTrips.length > 0) {
        setSelectedTripId(activeTrips[0].id)
        if (compileTripId === 'personal' || !compileTripId) {
          setCompileTripId(activeTrips[0].id)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle diary save
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !rawContent.trim()) return

    startTransition(async () => {
      try {
        // 1. Refine narrative using Gemini
        const generatedNarrative = await aiNarrateJournalLog(rawContent)

        // 2. Save inside DB
        await createJournalEntryAction({
          trip_id: selectedTripId || null,
          title: title,
          raw_content: rawContent,
          generated_narrative: generatedNarrative,
          photo_urls: [],
        })

        // Reset
        setTitle('')
        setRawContent('')
        await loadData()
      } catch (err) {
        console.error(err)
      }
    })
  }

  // Handle entry delete
  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this memoir?')) return
    try {
      await deleteJournalEntryAction(entryId)
      await loadData()
    } catch (e) {
      console.error(e)
    }
  }

  // Handle memory book compilation
  const handleCompileBook = async () => {
    if (!compileTripId) return
    setCompilingBook(true)
    setBookDownloadUrl(null)
    try {
      const result = await aiCompileMemoryBook(compileTripId)
      if (result.success) {
        // Simulate PDF rendering delay
        setTimeout(() => {
          setCompilingBook(false)
          setBookDownloadUrl('mock-download-url')
        }, 2000)
      }
    } catch (e) {
      console.error(e)
      setCompilingBook(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Entries List */}
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-200">
              <BookOpen className="h-5 w-5 text-pink-400" />
              Travel Memoirs
            </h3>

            {entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/20 p-12 text-center">
                <BookOpen className="h-8 w-8 text-neutral-500" />
                <h4 className="text-sm font-bold text-neutral-300">No memoirs recorded</h4>
                <p className="text-xs text-neutral-400">
                  Write down your daily observations on the right to compile your travel memories.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 transition hover:border-neutral-700/60"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="text-md font-extrabold text-neutral-100">{entry.title}</h4>
                        <span className="block text-[10px] font-bold text-neutral-500">
                          Recorded on: {entry.created_at.split('T')[0]}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-1.5 text-neutral-500 transition hover:text-red-400"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                      {/* Raw Log */}
                      <div className="space-y-1.5 rounded-xl border border-neutral-900 bg-neutral-950/40 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Traveler Log
                        </span>
                        <p className="italic leading-relaxed text-neutral-400">
                          &quot;{entry.raw_content}&quot;
                        </p>
                      </div>

                      {/* AI Narrative */}
                      <div className="relative space-y-1.5 overflow-hidden rounded-xl border border-pink-500/10 bg-pink-500/5 p-3">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent" />
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-pink-400">
                          <Sparkles className="h-3 w-3" /> Gemini Narrative
                        </span>
                        <p className="font-medium leading-relaxed text-neutral-200">
                          {entry.generated_narrative}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Entry Form & Memory Book Compiler */}
        <div className="space-y-6">
          {/* Add Journal Entry Form */}
          <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
              <Sparkles className="h-5 w-5 text-pink-400" />
              Write Entry
            </h3>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-400">Link to Trip</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:outline-none"
                >
                  <option value="">None (Personal Log)</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-400">Entry Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kyoto Moss Forest"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium text-neutral-400">
                  Rough Logs / Observations
                </label>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  rows={4}
                  placeholder="Type rough points, sounds, smells, or raw experiences. Gemini will formulate this into an atmospheric memoir."
                  className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2.5 font-semibold text-white transition hover:opacity-90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Narration in Progress
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Save Narrative Memoir
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Memory Book Compiler */}
          <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-200">
              <FileText className="h-5 w-5 text-indigo-400" />
              Memory Book
            </h3>
            <p className="text-xs leading-relaxed text-neutral-400">
              Compile your logs, passport stamps, and quest achievements into a beautiful
              downloadable travel book.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-medium text-neutral-400">Select Excursion</label>
                <select
                  value={compileTripId}
                  onChange={(e) => setCompileTripId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-200 focus:outline-none"
                >
                  <option value="personal">None (All Memoirs)</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {bookDownloadUrl ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Compiled Successfully!
                  </div>
                  <button
                    onClick={() => {
                      alert('Download started! Generating PDF memory_book.pdf...')
                      setBookDownloadUrl(null)
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 py-2 font-bold text-neutral-200 transition hover:bg-neutral-800"
                  >
                    <Download className="h-4 w-4" /> Download PDF Book
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCompileBook}
                  disabled={compilingBook || !compileTripId}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {compilingBook ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Compiling Pages...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" /> Compile Memory Book
                    </>
                  )}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
