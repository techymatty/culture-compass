'use client'

import React, { useState, useTransition } from 'react'
import { aiTimeMachineStory } from '@/features/storytelling/actions/storytellingAi'
import { aiSimulateConversation } from '@/features/gamification/actions/gamificationAi'
import { Sparkles, Send, Loader2, CheckCircle2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  feedback?: string
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<'destination' | 'simulator'>('destination')

  // Destination Chat States
  const [selectedDest, setSelectedDest] = useState('Kyoto')
  const [selectedEra, setSelectedEra] = useState('Heian')
  const [destMessages, setDestMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Greetings, traveler. I am Heian Kyoto, the imperial capital of Japan. Ask me anything about my moss gardens, shrines, or Heian-era poetry.',
    },
  ])
  const [destInput, setDestInput] = useState('')

  // Simulator States
  const [selectedScenario, setSelectedScenario] = useState('tea_house')
  const [simMessages, setSimMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Konnichiwa! Welcome to our tea house. What would you like to order today?',
    },
  ])
  const [simInput, setSimInput] = useState('')
  const [correctionFeedback, setCorrectionFeedback] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  // Handle Destination Persona Chat Submit
  const handleDestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destInput.trim()) return

    const userMsg = destInput.trim()
    setDestInput('')
    setDestMessages((prev) => [...prev, { role: 'user', content: userMsg }])

    startTransition(async () => {
      try {
        const response = await aiTimeMachineStory(selectedDest, selectedEra)
        setDestMessages((prev) => [...prev, { role: 'assistant', content: response }])
      } catch (err) {
        console.error(err)
        setDestMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Forgive me, traveler. The winds of time are currently blocked. Please try again shortly.',
          },
        ])
      }
    })
  }

  // Handle Conversation Simulator Submit
  const handleSimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!simInput.trim()) return

    const userMsg = simInput.trim()
    setSimInput('')
    setSimMessages((prev) => [...prev, { role: 'user', content: userMsg }])

    const historyText = simMessages
      .map((m) => `${m.role === 'user' ? 'Traveler' : 'Merchant'}: ${m.content}`)
      .join('\n')

    startTransition(async () => {
      try {
        const result = await aiSimulateConversation(selectedScenario, historyText, userMsg)
        setSimMessages((prev) => [...prev, { role: 'assistant', content: result.reply }])
        if (result.feedback) {
          setCorrectionFeedback(result.feedback)
        }
      } catch (err) {
        console.error(err)
        setSimMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Ah! I did not catch that. Could you repeat it?' },
        ])
      }
    })
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-180px)] max-w-4xl flex-col justify-between space-y-6">
      {/* Header and Mode Selector */}
      <section className="flex-shrink-0 space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-white">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              AI Travel Companion
            </h2>
            <p className="text-xs text-neutral-400">
              Roleplay with destinations across historical eras or practice conversation simulations
              with local merchants.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex w-fit rounded-xl border border-neutral-800 bg-neutral-900/60 p-1">
            <button
              onClick={() => setActiveTab('destination')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                activeTab === 'destination'
                  ? 'bg-purple-500 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Talk to Destination
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                activeTab === 'simulator'
                  ? 'bg-purple-500 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Conversation Simulator
            </button>
          </div>
        </div>
      </section>

      {/* Main chat layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 py-2 md:grid-cols-4">
        {/* Left column: Selectors & Settings */}
        <div className="space-y-4 md:col-span-1">
          {activeTab === 'destination' ? (
            <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4 text-xs backdrop-blur-xl">
              <h3 className="text-sm font-bold text-neutral-200">Destination Persona</h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block font-medium text-neutral-400">City</label>
                  <select
                    value={selectedDest}
                    onChange={(e) => setSelectedDest(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-neutral-200 focus:outline-none"
                  >
                    <option value="Kyoto">Kyoto (Japan)</option>
                    <option value="Rome">Rome (Italy)</option>
                    <option value="Paris">Paris (France)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-neutral-400">Historical Era</label>
                  <select
                    value={selectedEra}
                    onChange={(e) => setSelectedEra(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-neutral-200 focus:outline-none"
                  >
                    <option value="Heian">Heian Era (794–1185)</option>
                    <option value="Renaissance">Renaissance (14th-17th Century)</option>
                    <option value="Belle Epoque">Belle Époque (1871–1914)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 text-[10px] leading-relaxed text-neutral-500">
                The AI adopts the speech patterns, vocabulary, and cultural context of the selected
                era.
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4 text-xs backdrop-blur-xl">
              <h3 className="text-sm font-bold text-neutral-200">Simulator Settings</h3>

              <div className="space-y-1">
                <label className="block font-medium text-neutral-400">Scenario</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-neutral-200 focus:outline-none"
                >
                  <option value="tea_house">Ordering Tea in Kyoto</option>
                  <option value="gelato">Buying Gelato in Rome</option>
                  <option value="bakery">Ordering Croissants in Paris</option>
                </select>
              </div>

              {correctionFeedback && (
                <div className="space-y-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-[11px] leading-relaxed text-indigo-300">
                  <h4 className="flex items-center gap-1 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Language Coach
                  </h4>
                  <p>{correctionFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Chat Conversation Window */}
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 backdrop-blur-xl md:col-span-3">
          {/* Messages list */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-xs">
            {(activeTab === 'destination' ? destMessages : simMessages).map((m, i) => (
              <div
                key={i}
                className={`flex max-w-[85%] gap-3 ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase text-white ${
                    m.role === 'user'
                      ? 'bg-indigo-500'
                      : 'bg-gradient-to-tr from-indigo-500 to-pink-500'
                  }`}
                >
                  {m.role === 'user' ? 'U' : 'AI'}
                </div>

                <div
                  className={`rounded-2xl p-3.5 leading-relaxed ${
                    m.role === 'user'
                      ? 'border border-indigo-500/20 bg-indigo-600/10 text-indigo-100'
                      : 'border border-neutral-800 bg-neutral-900/60 text-neutral-200'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex max-w-[85%] gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 animate-pulse items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-[10px] text-white">
                  AI
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3 text-neutral-500">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <form
            onSubmit={activeTab === 'destination' ? handleDestSubmit : handleSimSubmit}
            className="flex gap-2 border-t border-neutral-900 bg-neutral-950/60 p-3"
          >
            <input
              type="text"
              value={activeTab === 'destination' ? destInput : simInput}
              onChange={(e) =>
                activeTab === 'destination'
                  ? setDestInput(e.target.value)
                  : setSimInput(e.target.value)
              }
              placeholder={
                activeTab === 'destination'
                  ? 'Ask about the architecture, clothing, traditions...'
                  : 'Type your response in the local language...'
              }
              className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs text-neutral-200 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center rounded-xl bg-indigo-600 p-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
