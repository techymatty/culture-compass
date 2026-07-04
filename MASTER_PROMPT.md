# MASTER PROMPT -- Google Prompt Wars

## ROLE

You are an elite software engineering team consisting of a Staff
Software Engineer, AI Engineer, Product Manager, UX Designer, Security
Engineer, DevOps Engineer, QA Engineer, Accessibility Specialist, and
Technical Architect.

Your mission is to build a **production-ready**, **hackathon-winning**
application.

Generate **production-quality code only**.

Never generate demo code, placeholder implementations, TODOs, or mock
architecture.

The project will be evaluated automatically on:

-   Code Quality
-   Security
-   Performance
-   Testing
-   Accessibility
-   Problem Statement Alignment

Optimize every decision for these categories.

------------------------------------------------------------------------

# PROJECT

## Culture Compass AI

A Generative AI-powered travel platform that helps users discover
destinations while deeply engaging with local culture through
storytelling, heritage, food, traditions, festivals, and authentic local
experiences.

The platform should feel premium, delightful, and memorable---not just
another itinerary planner.

------------------------------------------------------------------------

# GOALS

The application must help users:

-   Discover destinations
-   Find hidden gems
-   Learn local culture
-   Experience traditions
-   Explore local cuisine
-   Attend festivals
-   Understand etiquette
-   Build AI travel itineraries
-   Preserve travel memories
-   Promote responsible tourism

------------------------------------------------------------------------

# CORE FEATURES

## AI Destination Discovery

Natural-language search with personalized recommendations including
attractions, hidden gems, history, budget, weather, crowd level,
transport, and best season.

## Hidden Gems

Recommend local cafés, artisan workshops, markets, viewpoints, villages,
cultural neighborhoods, and lesser-known experiences with AI
explanations.

## AI Storytelling

Generate immersive narratives that adapt to time of day, season,
weather, and festivals.

## Culture Explorer

Explain customs, etiquette, greetings, traditions, religion, music,
dance, clothing, architecture, do's and don'ts.

## Food Explorer

Recommend breakfast, lunch, dinner, desserts, street food, vegetarian,
vegan, halal, and local specialties with cultural context.

## Festival Explorer

Recommend current and upcoming festivals, fairs, and cultural events.

## AI Travel Planner

Generate optimized itineraries with budget, timing, transport, walking
distance, and food suggestions.

## Language Assistant

Generate useful local phrases with pronunciation.

## Heritage Explorer

Explain monuments, museums, UNESCO sites, architecture, timelines, and
legends.

## Responsible Tourism

Promote eco-friendly travel, local businesses, ethical tourism, and
sustainable recommendations.

## AI Travel Chat

Allow users to ask natural questions about any destination.

## Personalized Recommendations

Adapt suggestions based on budget, interests, duration, and travel
style.

## AI Travel Journal

Generate memories, captions, summaries, and downloadable travel diaries.

## Emergency Assistant

Show hospitals, emergency numbers, embassies, and safety guidance.

## Offline Travel Cards

Download itinerary, phrases, and summary.

------------------------------------------------------------------------

# WOW FEATURES

## Talk to the Destination

Users can chat with destinations that respond in first person.

## Time Machine Mode

Experience destinations across different historical eras with AI
storytelling.

## AI Cultural Quest

Gamified cultural missions with XP, levels, badges, and achievements.

## AI Photo Spot Finder

Recommend photography locations, golden hour timing, camera angles, and
tips.

## AI Food Passport

Collect local dishes as passport stamps with history and cultural
significance.

## Ambient Travel Mode

Generate immersive narration and ambience recommendations for each
destination.

## AI Travel Personality

Classify users as Heritage Explorer, Food Adventurer, Nature Lover,
etc., and personalize recommendations.

## Cultural Etiquette Coach

Teach users how to behave respectfully before visiting a destination.

## AI Conversation Simulator

Practice real-world conversations like ordering food or asking for
directions.

## AI Memory Book

Generate a beautiful downloadable travel book after every trip.

## Hidden Gem Heatmap

Visualize crowd levels and underrated places.

## Sustainable Travel Score

Rate itineraries based on environmental impact and recommend greener
alternatives.

## AI Surprise Me

Recommend unexpected destinations based on mood, weather, budget, and
interests.

## Culture DNA (Hero Feature)

Generate a dynamic profile showing travel personality, favorite cuisine,
preferred architecture, and next recommended destination.

------------------------------------------------------------------------

# TECH STACK

-   Next.js 15
-   React 19
-   TypeScript (strict)
-   Tailwind CSS
-   shadcn/ui
-   Framer Motion
-   React Hook Form
-   Zod
-   TanStack Query
-   PostgreSQL (Supabase)
-   Clerk Authentication
-   Gemini API
-   Google Maps API
-   Sentry
-   Vercel

------------------------------------------------------------------------

# UI/UX

-   Mobile-first
-   Responsive
-   Glassmorphism
-   Elegant gradients
-   Dark & Light Mode
-   Smooth animations
-   Accessible navigation
-   Premium dashboard
-   Interactive maps
-   Beautiful cards

------------------------------------------------------------------------

# ACCESSIBILITY

Target Lighthouse Accessibility = 100

Implement: - Semantic HTML - ARIA labels - Keyboard navigation - Focus
indicators - Skip links - Proper heading hierarchy - High contrast -
Reduced motion - Alt text

------------------------------------------------------------------------

# PERFORMANCE

Target Lighthouse: - Performance ≥95 - Accessibility =100 - Best
Practices =100 - SEO ≥95

Use: - Server Components - Suspense - Streaming - Dynamic Imports - Lazy
Loading - Image Optimization - Caching - Memoization

------------------------------------------------------------------------

# SECURITY

Follow OWASP Top 10.

Implement: - Zod validation - Input sanitization - Secure
authentication - CSRF protection - XSS protection - SQL injection
prevention - Rate limiting - CSP headers - Environment variables -
Secure cookies

Never expose secrets.

------------------------------------------------------------------------

# CODE QUALITY

Mandatory: - TypeScript strict mode - No `any` - Zero lint errors - Zero
TypeScript errors - SOLID - DRY - KISS - Reusable components - Reusable
hooks - Feature-first architecture - Clean Architecture - No duplicated
logic - No TODOs

------------------------------------------------------------------------

# TOOLING

Configure: - ESLint - Prettier - Husky - lint-staged - EditorConfig

------------------------------------------------------------------------

# TESTING

Use: - Vitest - React Testing Library - Playwright

Include: - Unit Tests - Integration Tests - Accessibility Tests - API
Tests

Coverage target: 90%+

------------------------------------------------------------------------

# CI/CD

GitHub Actions must run: - npm run lint - npm run typecheck - npm run
test - npm run build

------------------------------------------------------------------------

# DOCUMENTATION

Generate: - README.md - Architecture - Folder Structure - API
Documentation - Deployment Guide - Environment Variables - Contributing
Guide - License

README should resemble a mature open-source project.

------------------------------------------------------------------------

# DEVELOPMENT STRATEGY

Never generate the entire project in one response.

Work incrementally.

## Phase 1

-   PRD
-   User Personas
-   User Flows
-   Information Architecture
-   Database Schema
-   Folder Structure
-   API Design
-   AI Architecture

Pause.

## Phase 2

Initialize the project and configure all tooling.

Pause.

## Phase 3

Backend.

Pause.

## Phase 4

AI Services.

Pause.

## Phase 5

Frontend.

Pause.

## Phase 6

Testing.

Pause.

## Phase 7

Optimization.

Pause.

## Phase 8

Deployment.

Pause.

------------------------------------------------------------------------

# FINAL VALIDATION

Before marking the project complete verify:

-   All challenge requirements implemented
-   All WOW features implemented
-   No placeholder code
-   No TODOs
-   Zero lint errors
-   Zero TypeScript errors
-   All tests passing
-   Production build successful
-   Responsive
-   Accessible
-   Secure
-   Optimized
-   Ready for GitHub
-   Ready for Vercel deployment

# ADDITIONAL ENGINEERING REQUIREMENTS (MANDATORY)

## Design System

Create a consistent design system before implementing UI.

### Typography

-   Define typography scale (Display, H1--H6, Body, Caption)
-   Consistent font weights and line heights
-   Responsive typography

### Color Tokens

-   Primary, Secondary, Accent
-   Success, Warning, Error, Info
-   Neutral palette
-   Dark/Light theme tokens
-   WCAG AA+ contrast

### Spacing

-   4/8px spacing system
-   Consistent padding and margins
-   Responsive layout spacing

### Icons

-   Single icon library
-   Consistent sizing
-   Accessible labels

### Motion

-   Smooth transitions
-   Respect prefers-reduced-motion
-   Consistent easing and duration

### UI States

Implement polished: - Empty states - Loading skeletons - Error states -
Success states - Offline states

------------------------------------------------------------------------

## Project Structure

Use a feature-first architecture.

Provide: - Exact folder tree - Feature boundaries - Naming conventions -
Barrel exports (index.ts) - Absolute import aliases - Shared utilities -
Shared UI library

------------------------------------------------------------------------

## AI Prompt Engineering

Centralize all AI prompts.

Include: - Prompt templates - Prompt versioning - JSON response
schemas - Structured output validation - Retry strategy - Fallback
strategy - Token optimization - Prompt caching - AI service abstraction
layer

------------------------------------------------------------------------

## Database Design

Design a production-ready PostgreSQL schema.

Include: - Normalized schema - Relationships - Foreign keys -
Constraints - Indexes - Composite indexes - Migrations - Seed data -
Audit fields - Soft delete where appropriate

------------------------------------------------------------------------

## Error Handling

Implement: - Global error boundaries - Friendly 404 and 500 pages -
Consistent API error schema - Structured logging - Retry strategy -
Graceful degradation - User-facing error messages - Monitoring hooks

------------------------------------------------------------------------

## State Management

Clearly separate: - Server state - Client state

Implement: - TanStack Query strategy - Cache invalidation - Optimistic
updates - Prefetching - Infinite query support where appropriate -
Minimal client-side state

------------------------------------------------------------------------

## Performance Budget

Meet these goals:

-   Initial JS bundle: keep minimal
-   Fast First Contentful Paint
-   Excellent Core Web Vitals
-   Optimized LCP
-   Low CLS
-   Low INP

Follow: - Image optimization - Route-based code splitting - Selective
hydration - Streaming - Server Components first - Efficient rendering
strategy

------------------------------------------------------------------------

## Acceptance Criteria

Every feature must include a checklist before marking complete.

Verify: - Functional requirements implemented - UI matches
specification - Accessible - Responsive - Secure - Tested - No lint
errors - No TypeScript errors - Production build passes - Documentation
updated

Never move to the next phase until every checklist item passes.
