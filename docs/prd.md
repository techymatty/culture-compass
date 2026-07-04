# Product Requirements Document (PRD) - Culture Compass AI

## 1. Introduction & Project Goals
Culture Compass AI is an elite Generative AI-powered travel platform built for the Google Prompt Wars hackathon. Unlike traditional itinerary planners, it emphasizes storytelling, cultural immersion, local traditions, and heritage exploration. It offers a premium, mobile-first, glassmorphic UI with smooth Framer Motion animations.

### Core Objectives:
- Connect travelers deeply with local culture, history, traditions, and cuisine.
- Gamify travel exploration to encourage respectful and curious behavior.
- Support offline travel preparedness.
- Maintain high-end performance, 100% accessibility compliance, and robust security patterns.

---

## 2. Core Features

### 2.1 AI Destination Discovery
- **Description**: Natural language destination search engine.
- **Requirements**:
  - Search input parsing using Gemini.
  - Returns destination overview, history, local weather insights, average crowd density levels, transport tips, and optimal seasonal recommendations.
  - Interactive Map integration showing pins for main attractions.

### 2.2 Hidden Gems
- **Description**: Spotlights underrated and local-first venues.
- **Requirements**:
  - Recommends hidden cafés, artisan shops, local markets, panoramas, and lesser-known historical zones.
  - AI-generated explanation detailing *why* it is a gem and its cultural context.

### 2.3 AI Storytelling
- **Description**: Generates immersive historical or narrative audio/text guides.
- **Requirements**:
  - Story adapts dynamically to time of day, current weather, season, and active local festivals.
  - Audio playback interface simulation (using Web Speech API or generated text-to-speech).

### 2.4 Culture Explorer
- **Description**: Deep dive into local culture.
- **Requirements**:
  - Comprehensive guide covering local customs, greetings, dress codes, music, art forms, and religious/social norms.
  - Interactive "Do's and Don'ts" list.

### 2.5 Food Explorer
- **Description**: Gastronomy advisor based on local heritage.
- **Requirements**:
  - Recommends dishes across breakfast, lunch, dinner, desserts, and street food.
  - Includes dietary filter tags (vegan, vegetarian, halal, gluten-free).
  - Cultural context for each dish (origins, traditional serving style, historical anecdotes).

### 2.6 Festival Explorer
- **Description**: Alerts and details about local celebrations.
- **Requirements**:
  - Chronological timeline of upcoming local festivals, rituals, and community events.
  - Practical user guidelines (what to wear, what to expect, participation etiquette).

### 2.7 AI Travel Planner
- **Description**: Custom itinerary planner.
- **Requirements**:
  - Inputs: Destination, duration, budget, travel style, and dietary requirements.
  - Outputs: Interactive multi-day itineraries incorporating routes, transportation methods, walking distances, and curated dining breaks.

### 2.8 Language Assistant
- **Description**: Real-time phonetic helper.
- **Requirements**:
  - Categorized survival phrases (greetings, emergency, ordering food, directions).
  - Phonetic transcriptions and high-quality local pronunciation audio.

### 2.9 Heritage Explorer
- **Description**: Historical preservation guide.
- **Requirements**:
  - Details monuments, museums, and UNESCO World Heritage sites.
  - Interactive historical timelines and deep-dives into local myths and legends.

### 2.10 Responsible Tourism
- **Description**: Eco-conscious and ethical travel advisor.
- **Requirements**:
  - Renders carbon impact estimates and green alternative transport recommendations.
  - Direct links/recommendations for registered local-owned businesses and ethical craft workshops.

### 2.11 AI Travel Chat
- **Description**: Dynamic contextual companion.
- **Requirements**:
  - Real-time conversational interface to answer destination safety, navigation, and etiquette queries.

### 2.12 Personalized Recommendations
- **Description**: User profiling engine.
- **Requirements**:
  - Adapts app homepage and recommendations based on the user's saved preferences, budget tier, and historical travel style.

### 2.13 AI Travel Journal
- **Description**: Narrative-based memory capture.
- **Requirements**:
  - Users input rough bullet-point logs or upload photos (mock/real).
  - Generates polished narrative travelogues and social media captions.
  - Export functionality (PDF travel diary download).

### 2.14 Emergency Assistant
- **Description**: Real-time safety checklist.
- **Requirements**:
  - Instant access to emergency numbers (police, ambulance, fire), nearest hospital search pins, local embassies, and travel warning alerts.

### 2.15 Offline Travel Cards
- **Description**: Offline-ready PDF/Image downloads.
- **Requirements**:
  - Downloadable pocket cards containing essential phrases, emergency contact numbers, and basic offline-friendly itinerary notes.

---

## 3. WOW Features

### 3.1 Talk to the Destination
- **Description**: Immersive AI roleplay.
- **Requirements**:
  - Chat interface where the AI system adopts the persona of the city or monument (e.g., "I am Kyoto, ancient capital of Japan...").
  - Response tone and vocabulary adapt to the location's historical background.

### 3.2 Time Machine Mode
- **Description**: Historical exploration panel.
- **Requirements**:
  - UI slider enabling users to travel back to historical eras (e.g., Edo Tokyo vs. Modern Tokyo).
  - Displays localized historical events, architecture, stories, and social structures.

### 3.3 AI Cultural Quest
- **Description**: Gamified travel quests.
- **Requirements**:
  - XP, levels, and badges earned for completing respectful cultural tasks (e.g., "Learn 3 greetings", "Support a local artisan", "Sample a traditional vegan dish").

### 3.4 AI Photo Spot Finder
- **Description**: Photography curation tool.
- **Requirements**:
  - Recommends coordinates for viewpoints, sunset spots, optimal golden hours, camera lens/angle suggestions, and crowd avoiding tips.

### 3.5 AI Food Passport
- **Description**: Gastronomy gamification.
- **Requirements**:
  - Virtual stamps earned when users check off traditional local dishes.
  - Displays cultural importance and cooking tips for unlocked foods.

### 3.6 Ambient Travel Mode
- **Description**: Multi-sensory immersive experience.
- **Requirements**:
  - Generates location-based local soundscape recommendations (e.g., temple bells, rainforest rain, crowded market noise).
  - Provides curated reading lists or local music playlists.

### 3.7 AI Travel Personality
- **Description**: Personality analyzer.
- **Requirements**:
  - A short, engaging onboarding quiz that classifies the user into categories like *Heritage Explorer*, *Food Adventurer*, *Eco-Traveler*, or *Adrenaline Seeker*.

### 3.8 Cultural Etiquette Coach
- **Description**: Interactive interactive etiquette quiz.
- **Requirements**:
  - Brief situational scenarios where users choose the most respectful action (e.g., temple behavior, tipping norms) and receive immediate feedback.

### 3.9 AI Conversation Simulator
- **Description**: Text/voice roleplay with local merchants.
- **Requirements**:
  - Interactive scenario (e.g., buying street food or hailing a cab) where users type responses in the local language, receiving helpful correction hints.

### 3.10 AI Memory Book
- **Description**: Autogenerated travel booklet.
- **Requirements**:
  - Combines the user's Travel Journal entries, Food Passport stamps, and Quest achievements into a downloadable, print-ready PDF memory book.

### 3.11 Hidden Gem Heatmap
- **Description**: Visual density mapping.
- **Requirements**:
  - Renders a visually striking heatmap overlay on the map representing tourist crowd concentrations vs. underrated hotspots.

### 3.12 Sustainable Travel Score
- **Description**: Carbon footprint calculation.
- **Requirements**:
  - Analyzes the generated travel itinerary to assign a sustainability rating (A to F) with suggestions on how to improve the score.

### 3.13 AI Surprise Me
- **Description**: Adventure recommendations.
- **Requirements**:
  - Recommends an unexpected, highly immersive cultural destination matching the user's current mood, budget, and travel personality.

### 3.14 Culture DNA (Hero Feature)
- **Description**: Dynamic user profile summary.
- **Requirements**:
  - Generates a visual DNA strand or breakdown reflecting:
    - Dominant Travel Personality
    - Favorite Cuisine Styles (spicy, street food, fine dining, etc.)
    - Preferred Architectural Eras
    - Next recommended "destiny" match based on cultural synergy.

---

## 4. Non-Functional Requirements & Performance Budget

### 4.1 Target Performance Metrics (Lighthouse Goals)
- **Performance**: $\ge$ 95
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: $\ge$ 95

### 4.2 Accessibility (WCAG 2.1 AA Compliance)
- All pages must use semantic HTML tags (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Contrast ratio minimum of 4.5:1 for normal text and 3:1 for large text.
- Full keyboard operability; focus indicators must be visible and highly stylized.
- Accurate and descriptive `aria-label` tags for all interactive components (buttons, custom select cards).
- Support for `prefers-reduced-motion` to automatically disable intensive Framer Motion animations.

### 4.3 Security Standards
- **OWASP Top 10 Compliance**:
  - Direct inputs sanitized and verified using Zod before processing.
  - CSP (Content Security Policy) headers configured to prevent XSS.
  - API rate-limiting implemented to thwart denial of service on Gemini endpoints.
  - Row Level Security (RLS) enabled on all Supabase tables, bound directly to Clerk authentication user IDs.
  - Secure, HTTP-only, SameSite cookies.
