import React from 'react'
import Link from 'next/link'
import SkipLink from '@/components/skip-link'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Compass,
  CalendarDays,
  Award,
  MessageSquare,
  BookOpen,
  User,
  AlertTriangle,
} from 'lucide-react'

const isClerkConfigured = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('dummy') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('ZHVtbXk')
)

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/explore', label: 'Explore', icon: Compass },
  { href: '/dashboard/planner', label: 'Planner', icon: CalendarDays },
  { href: '/dashboard/quests', label: 'Quests Hub', icon: Award },
  { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/dashboard/journal', label: 'Memoirs', icon: BookOpen },
  { href: '/dashboard/profile', label: 'Culture DNA', icon: User },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-neutral-100 md:flex-row">
      <SkipLink />

      {/* Sidebar - Desktop */}
      <aside className="sticky top-0 z-20 hidden h-screen w-64 flex-col justify-between border-r border-neutral-800 bg-neutral-950/40 p-4 backdrop-blur-xl md:flex">
        <div>
          <div className="mb-6 flex items-center gap-3 px-2 py-4">
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

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-neutral-400 transition-all hover:border-neutral-800 hover:bg-neutral-900/60 hover:text-neutral-50"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User profile footer - Desktop */}
        <div className="flex items-center justify-between border-t border-neutral-800 px-2 pt-4">
          {isClerkConfigured ? (
            <div className="flex items-center gap-3">
              <UserButton />
              <span className="text-xs font-medium text-neutral-400">My Account</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-xs font-bold uppercase text-white">
                G
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-200">Guest User</span>
                <span className="mt-0.5 w-fit rounded border border-purple-500/30 bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
                  DEMO MODE
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/40 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 text-sm font-bold text-white">
            C
          </div>
          <h1 className="text-md font-bold tracking-tight">Culture Compass</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Emergency trigger placeholder */}
          <button
            aria-label="Safety Contacts"
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-amber-500 transition hover:bg-neutral-800"
          >
            <AlertTriangle className="h-4 w-4" />
          </button>

          {isClerkConfigured ? (
            <UserButton />
          ) : (
            <span className="rounded-full border border-purple-500/20 bg-purple-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-400">
              DEMO
            </span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 overflow-y-auto p-4 pb-20 outline-none md:p-8 md:pb-8"
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-neutral-800 bg-neutral-950/60 py-2 backdrop-blur-xl md:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium text-neutral-400 hover:text-neutral-50"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
