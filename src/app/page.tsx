import React from 'react'
import Link from 'next/link'
import { Compass, Sparkles, BookOpen, ArrowRight, Award, TreePine, Languages } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-neutral-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/40 bg-neutral-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 font-bold text-white shadow-lg shadow-purple-500/20">
              CC
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-lg font-bold leading-none text-transparent">
                Culture Compass
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                AI Travel Agent
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:opacity-90 hover:shadow-purple-500/35"
            >
              Enter App <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-16 text-center lg:pt-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing next-gen travel planning</span>
          </div>

          <h2 className="bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-4xl font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Immerse in Local Heritage <br />
            with Culture Compass AI
          </h2>

          <p className="mx-auto max-w-2xl text-base text-neutral-400 sm:text-lg">
            An elite Generative AI-powered travel companion. Go beyond generic itineraries—discover
            hidden local gems, listen to adaptive historical storytelling, and master cultural
            etiquette.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.02] hover:opacity-90 sm:w-auto"
            >
              Start Your Journey <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard/explore"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-8 py-4 text-base font-semibold text-neutral-200 backdrop-blur transition hover:border-neutral-700 hover:bg-neutral-800 sm:w-auto"
            >
              Explore Destinations
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-24 space-y-12">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">
              Engineered for Deep Cultural Discovery
            </h3>
            <p className="mx-auto max-w-md text-sm text-neutral-400">
              Explore the unique feature ecosystem designed to connect you authentically with the
              places you visit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 text-left backdrop-blur transition-all duration-300 hover:border-neutral-700/60 hover:bg-neutral-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white">
                <Compass className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-neutral-200">AI Destination Discovery</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Deep natural language search parsing history, crowd densities, weather patterns, and
                local transport networks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 text-left backdrop-blur transition-all duration-300 hover:border-neutral-700/60 hover:bg-neutral-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-neutral-200">Hidden Gems Finder</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Spotlight underrated local businesses, small artisan shops, viewing points, and
                neighborhood stories.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 text-left backdrop-blur transition-all duration-300 hover:border-neutral-700/60 hover:bg-neutral-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-neutral-200">Adaptive Storytelling</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Immersive narratives configured dynamically based on current weather, season, local
                holidays, and eras.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 text-left backdrop-blur transition-all duration-300 hover:border-neutral-700/60 hover:bg-neutral-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white">
                <Languages className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-neutral-200">Survival Phrasings</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Master local languages with survival terms, phonetics, and speech assistant
                roleplaying tools.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group relative rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 text-left backdrop-blur transition-all duration-300 hover:border-neutral-700/60 hover:bg-neutral-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white">
                <TreePine className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-neutral-200">Responsible Tourism</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Calculate itinerary carbon footprint, get green route options, and support
                local-owned merchants.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group relative rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 text-left backdrop-blur transition-all duration-300 hover:border-neutral-700/60 hover:bg-neutral-900/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-neutral-200">Heritage Gamification</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Earn experience points, level up, and unlock regional passport badges for culinary
                and historical discoveries.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-black/60 py-12 text-center text-xs text-neutral-500">
        <p>© 2026 Culture Compass AI. Built with Next.js 15, Clerk, and Google Gemini.</p>
      </footer>
    </div>
  )
}
