# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Culture Compass AI - E2E Core Journeys >> should plan custom itineraries and track activity completions
- Location: e2e\dashboard.spec.ts:62:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h3:has-text("E2E Test Tour")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h3:has-text("E2E Test Tour")')

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- complementary:
  - text: CC
  - heading "Culture Compass" [level=1]
  - text: AI Travel Agent
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
    - link "Explore":
      - /url: /dashboard/explore
    - link "Planner":
      - /url: /dashboard/planner
    - link "Quests Hub":
      - /url: /dashboard/quests
    - link "AI Chat":
      - /url: /dashboard/chat
    - link "Memoirs":
      - /url: /dashboard/journal
    - link "Culture DNA":
      - /url: /dashboard/profile
  - text: My Account
- main:
  - heading "Active Excursions" [level=3]
  - paragraph: No active itineraries. Complete the planner form below to generate one.
  - heading "AI Travel Planner" [level=3]
  - text: Destination
  - combobox:
    - option "Kyoto (Japan)" [selected]
    - option "Rome (Italy)"
    - option "Paris (France)"
  - text: Trip Title
  - textbox "e.g. Kyoto Cherry Blossom Tour": E2E Test Tour
  - text: Start Date
  - textbox: 2026-07-10
  - text: End Date
  - textbox: 2026-07-13
  - text: Budget
  - combobox:
    - option "Budget"
    - option "Moderate" [selected]
    - option "Luxury"
  - text: Travel Style
  - combobox:
    - option "Relaxed" [selected]
    - option "Fast-paced"
  - text: Interests (Separated by comma)
  - textbox "e.g. Zen gardens, street food, heritage": Traditional, tea
  - button "Generate Cultural Plan"
  - heading "Select or generate an excursion" [level=4]
  - paragraph: Click on an active excursion on the sidebar or fill in the parameters to generate a new itinerary.
- img
- text: 1 error
- button "Hide Errors":
  - img
- status:
  - img
  - text: Static route
  - button "Hide static indicator":
    - img
- alert
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('Culture Compass AI - E2E Core Journeys', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Navigate directly to the dashboard (Clerk middleware passes through in demo mode)
  6   |     await page.goto('/dashboard')
  7   |   })
  8   | 
  9   |   test('should load the dashboard summary page and check layout navigation links', async ({ page }) => {
  10  |     // Check main layout branding title
  11  |     await expect(page.locator('h1:has-text("Culture Compass")').first()).toBeVisible()
  12  |     
  13  |     // Check dashboard sections
  14  |     await expect(page.locator('h3:has-text("Culture DNA")')).toBeVisible()
  15  |     await expect(page.locator('h3:has-text("Quests & XP")')).toBeVisible()
  16  |     await expect(page.locator('h3:has-text("Travel Journal")')).toBeVisible()
  17  |   })
  18  | 
  19  |   test('should compute Culture DNA personality via the onboarding quiz', async ({ page }) => {
  20  |     // Go to profile page
  21  |     await page.goto('/dashboard/profile')
  22  |     await expect(page.locator('h3:has-text("Culture DNA Identity")')).toBeVisible()
  23  | 
  24  |     // Trigger quiz
  25  |     const quizBtn = page.locator('button:has-text("Compute DNA Profile"), button:has-text("Retake Quiz")')
  26  |     await expect(quizBtn).toBeVisible()
  27  |     await quizBtn.click()
  28  | 
  29  |     // Question 1
  30  |     await page.click('button:has-text("Sampling street food and historic recipes")')
  31  |     // Question 2
  32  |     await page.click('button:has-text("Structured, tracking historical timelines sequentially")')
  33  |     // Question 3
  34  |     await page.click('button:has-text("Centuries-old tea houses or trattorias recommended by locals")')
  35  |     // Question 4
  36  |     await page.click('button:has-text("Locally sourced spices, tea leaves, or family recipes")')
  37  | 
  38  |     // Quiz completes and updates persona
  39  |     await expect(page.locator('h4:has-text("Identity Strand Computed")')).toBeVisible()
  40  |   })
  41  | 
  42  |   test('should discover destinations and show hidden gems and safety guidelines', async ({ page }) => {
  43  |     await page.goto('/dashboard/explore')
  44  |     await expect(page.locator('h2:has-text("AI Destination Discovery")')).toBeVisible()
  45  | 
  46  |     // Type query
  47  |     await page.fill('input[placeholder="Where does your curiosity lead you?"]', 'Kyoto')
  48  |     await page.click('button:has-text("Discover")')
  49  | 
  50  |     // Verify details
  51  |     await expect(page.locator('h3:has-text("Kyoto")')).toBeVisible()
  52  |     await expect(page.locator('text=Japan').first()).toBeVisible()
  53  |     
  54  |     // Check hidden gems
  55  |     await expect(page.locator('h3:has-text("Hidden Gems Curation")')).toBeVisible()
  56  |     await expect(page.locator('h4:has-text("Gio-ji Temple")')).toBeVisible()
  57  | 
  58  |     // Check emergency guidelines
  59  |     await expect(page.locator('h3:has-text("Emergency Assistant")')).toBeVisible()
  60  |   })
  61  | 
  62  |   test('should plan custom itineraries and track activity completions', async ({ page }) => {
  63  |     await page.goto('/dashboard/planner')
  64  |     await expect(page.locator('h3:has-text("AI Travel Planner")')).toBeVisible()
  65  | 
  66  |     // Fill form details
  67  |     await page.locator('form select option').first().waitFor({ state: 'attached' })
  68  |     await page.locator('form select').first().selectOption({ index: 0 })
  69  |     await page.fill('input[placeholder="e.g. Kyoto Cherry Blossom Tour"]', 'E2E Test Tour')
  70  |     await page.fill('input[placeholder="e.g. Zen gardens, street food, heritage"]', 'Traditional, tea')
  71  |     
  72  |     // Generate
  73  |     await page.click('button:has-text("Generate Cultural Plan")')
  74  | 
  75  |     // Verify generated timeline headers
> 76  |     await expect(page.locator('h3:has-text("E2E Test Tour")')).toBeVisible()
      |                                                                ^ Error: expect(locator).toBeVisible() failed
  77  |     await expect(page.locator('span:has-text("Carbon Footprint")')).toBeVisible()
  78  | 
  79  |     // Verify activity details
  80  |     await expect(page.locator('h4:has-text("Scheduled Excursions")')).toBeVisible()
  81  |     await expect(page.locator('h5:has-text("Kinkaku-ji Temple Visit")')).toBeVisible()
  82  | 
  83  |     // Toggle completion status
  84  |     const checkbox = page.locator('button[aria-label="Mark activity complete"]').first()
  85  |     await checkbox.click()
  86  |     // Verify it is marked
  87  |     await expect(page.locator('button[aria-label="Mark activity incomplete"]').first()).toBeVisible()
  88  |   })
  89  | 
  90  |   test('should checkoff quests and stamp local food passports', async ({ page }) => {
  91  |     await page.goto('/dashboard/quests')
  92  |     await expect(page.locator('h2:has-text("Traveler")')).toBeVisible()
  93  |     await expect(page.locator('h3:has-text("Active Cultural Quests")')).toBeVisible()
  94  | 
  95  |     // Fill food passport stamp
  96  |     await page.locator('form select option').first().waitFor({ state: 'attached' })
  97  |     await page.locator('form select').first().selectOption({ index: 0 })
  98  |     await page.fill('input[placeholder="e.g. Kyoto Yudofu, Rome Carbonara"]', 'Kyoto Matcha')
  99  |     await page.fill('textarea[placeholder*="Describe where it originated"]', 'Traditional green tea served in Arashiyama ceremony.')
  100 |     await page.click('button:has-text("Stamp Passport")')
  101 | 
  102 |     // Verify stamp card was added to the gallery
  103 |     await expect(page.locator('h4:has-text("Kyoto Matcha")')).toBeVisible()
  104 |     await expect(page.locator('text=Traditional green tea served in Arashiyama ceremony.')).toBeVisible()
  105 |   })
  106 | 
  107 |   test('should handle AI persona chat conversations and Ordering simulators', async ({ page }) => {
  108 |     await page.goto('/dashboard/chat')
  109 |     await expect(page.locator('h2:has-text("AI Travel Companion")')).toBeVisible()
  110 | 
  111 |     // Destination tab chat
  112 |     await page.fill('input[placeholder="Ask about the architecture, clothing, traditions..."]', 'Tell me about Kyoto')
  113 |     await page.click('form button[type="submit"]')
  114 |     await expect(page.locator('text=Heian-kyo')).toBeVisible()
  115 | 
  116 |     // Switch tab to simulator
  117 |     await page.click('button:has-text("Conversation Simulator")')
  118 |     await page.fill('input[placeholder="Type your response in the local language..."]', 'Konnichiwa, matcha kudasai')
  119 |     await page.click('form button[type="submit"]')
  120 |     
  121 |     // Verify merchant simulator reply
  122 |     await expect(page.locator('text=tea house').first()).toBeVisible()
  123 |     await expect(page.locator('h4:has-text("Language Coach")')).toBeVisible()
  124 |   })
  125 | 
  126 |   test('should log travel memoirs, narrate entries, and request Memory Book PDF compilation', async ({ page }) => {
  127 |     await page.goto('/dashboard/journal')
  128 |     await expect(page.locator('h3:has-text("Travel Memoirs")')).toBeVisible()
  129 | 
  130 |     // Add entry
  131 |     await page.fill('input[placeholder="e.g. Kyoto Moss Forest"]', 'Kyoto Gardens visit')
  132 |     await page.fill('textarea[placeholder*="Type rough points"]', 'Quiet walk in Gio-ji moss forest, heard birds, felt calm')
  133 |     await page.click('button:has-text("Save Narrative Memoir")')
  134 | 
  135 |     // Verify card is added containing raw logs and generated narrative
  136 |     await expect(page.locator('h4:has-text("Kyoto Gardens visit")').first()).toBeVisible()
  137 |     await expect(page.locator('text=Kyoto was nothing short of magical').first()).toBeVisible()
  138 | 
  139 |     // Trigger Memory Book compilation
  140 |     await page.click('button:has-text("Compile Memory Book")')
  141 |     // Verify successful compilation feedback and download availability
  142 |     await expect(page.locator('text=Compiled Successfully')).toBeVisible()
  143 |     await expect(page.locator('button:has-text("Download PDF Book")')).toBeVisible()
  144 |   })
  145 | })
  146 | 
```