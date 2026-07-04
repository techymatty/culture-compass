# Architecture & Folder Structure - Culture Compass AI

This document defines the Next.js 15 folder tree, API specifications, and the Generative AI integration layer.

---

## 1. Feature-First Directory Structure

We use a feature-first architecture where code is organized by domain rather than purely by technical type (e.g., placing all hooks together). This maintains high modularity, encapsulation, and scalability.

```
/
├── 📁 .github/                  # CI/CD Workflows
│   └── 📁 workflows/
│       └── 📄 ci.yml            # Linting, type-checking, tests, build
│
├── 📁 docs/                     # Design and architectural specification files
│
├── 📁 src/
│   ├── 📁 app/                  # Next.js 15 App Router pages & layout
│   │   ├── 📄 layout.tsx        # Global HTML structure, providers & viewport
│   │   ├── 📄 page.tsx          # Homepage / Landing page
│   │   ├── 📁 api/              # Rest API Endpoints (e.g., export routes)
│   │   └── 📁 dashboard/        # Authenticated dashboard pages
│   │
│   ├── 📁 components/           # Shared UI & design system components
│   │   ├── 📁 ui/               # shadcn/ui components (primitives)
│   │   ├── 📄 sidebar.tsx
│   │   ├── 📄 navbar.tsx
│   │   └── 📄 skip-link.tsx
│   │
│   ├── 📁 features/             # Feature-first modules
│   │   ├── 📁 destinations/     # AI Search, Maps, Hidden Gems
│   │   │   ├── 📁 components/   # SearchBar.tsx, GemCard.tsx, HeatMap.tsx
│   │   │   ├── 📁 hooks/        # useDestinationSearch.ts
│   │   │   ├── 📁 actions/      # destinationActions.ts
│   │   │   └── 📁 schema/       # destinationZodSchema.ts
│   │   │
│   │   ├── 📁 itineraries/      # Planner, Sustainability Score
│   │   ├── 📁 gamification/     # Quests, Food Passport
│   │   ├── 📁 storytelling/     # Time Machine, Audios
│   │   ├── 📁 journal/          # Memories, PDF exporter
│   │   └── 📁 profile/          # Culture DNA, Quiz
│   │
│   ├── 📁 lib/                  # Shared core utilities (third-party wrapper initializers)
│   │   ├── 📄 supabase.ts       # Supabase Client
│   │   ├── 📄 gemini.ts         # Google Gemini Client & abstraction
│   │   ├── 📄 db.ts             # Direct database connections or helper
│   │   └── 📄 utils.ts          # Tailwind CSS classes merger (cn helper)
│   │
│   ├── 📁 hooks/                # Shared custom React hooks (e.g., useMediaQuery)
│   │
│   ├── 📁 styles/               # Global CSS files and design system tokens
│   │   └── 📄 globals.css       # Tailwind config, theme variables, glassmorphic styles
│   │
│   └── 📁 types/                # Shared TypeScript models and definitions
│
├── 📄 package.json              # Script directives and dependency manifests
├── 📄 tsconfig.json             # Strict TypeScript settings & alias mapping
├── 📄 tailwind.config.ts        # Design tokens: animations, colors, shadows
└── 📄 vite.config.ts            # Vitest configurations
```

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 2. API Design & Next.js Server Actions

We use **Next.js Server Actions** for database-modifying actions and state-mutating requests, and **Route Handlers** for file downloads (PDF generation) or external integrations.

### 2.1 Server Action Pattern
Every Server Action must implement:
1. **Authentication Verification**: Validate user session using Clerk's `auth()` helper.
2. **Schema Validation**: Parse request payloads using Zod.
3. **Structured Response**: Return a unified object containing `{ success: boolean; data?: T; error?: string }`.
4. **Cache Invalidation**: Trigger `revalidatePath` or `revalidateTag` for dynamic UI updates.

### 2.2 Server Action Example: Create Trip
```typescript
"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

const CreateTripSchema = z.object({
  destinationId: z.string().uuid(),
  title: z.string().min(1).max(150),
  startDate: z.string().date(),
  endDate: z.string().date(),
  budgetTier: z.enum(["Budget", "Moderate", "Luxury"]),
  travelStyle: z.enum(["Fast-paced", "Relaxed"]),
})

export async function createTrip(payload: unknown) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    const validated = CreateTripSchema.parse(payload)
    
    // Insert into db & calculate sustainability grade (mock or AI service)
    const trip = await db.insertTrip({
      userClerkId: userId,
      ...validated,
      sustainabilityGrade: 'B',
      carbonFootprintKg: 120.5
    })

    revalidatePath("/dashboard")
    return { success: true, data: trip }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten().fieldErrors }
    }
    return { success: false, error: "Internal Server Error" }
  }
}
```

---

## 3. AI Architecture & Gemini API Abstraction

To ensure robust prompt maintenance and token efficiency, the Google Gemini API integration is abstracted into a dedicated service layer (`src/lib/gemini.ts`) using the official `@google/genai` SDK.

### 3.1 Prompt Management
All system prompts are centralized and versioned in a read-only object map. No raw prompt strings are allowed inside React components or standard route handlers.

```typescript
export const PROMPT_REGISTRY = {
  DESTINATION_DISCOVERY_v1: `
    You are an expert cultural guide. Provide a comprehensive summary of the destination matching: {query}.
    You must output a JSON response matching the provided schema.
  `,
  TIME_MACHINE_v1: `
    You are a historical storyteller. Narration topic: {topic}. Target Era: {era}.
    Tell the story in first-person as if the year is {era}.
  `
} as const;
```

### 3.2 Structured Output Verification
We use Gemini's native structured JSON output capability by passing `responseSchema` to the model parameters. This eliminates erratic model formatting.

```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DestinationSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    country: { type: Type.STRING },
    description: { type: Type.STRING },
    history: { type: Type.STRING },
    crowdLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    bestSeason: { type: Type.STRING }
  },
  required: ["name", "country", "description", "history", "crowdLevel", "bestSeason"]
};

export async function generateDestinationData(query: string) {
  const prompt = PROMPT_REGISTRY.DESTINATION_DISCOVERY_v1.replace("{query}", query);
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: DestinationSchema,
    }
  });

  return JSON.parse(response.text);
}
```

### 3.3 Reliability and Fallback Strategy
- **Retry Mechanism**: Wrapped in exponential backoff helper (up to 3 retries) for transient rate limits (HTTP 429) or timeouts.
- **Fail-safe Fallbacks**: In case of persistent AI failure, the system falls back to cached statically-generated destination cards (e.g., standard fallback profiles for Paris, Tokyo, New York) rather than showing a broken interface.
- **Prompt Caching**: Long context prompt templates leverage Gemini's prompt caching feature to optimize latency and minimize token costs.
