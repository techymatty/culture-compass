import { test, expect } from '@playwright/test'

test.describe('Culture Compass AI - E2E Core Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly to the dashboard (Clerk middleware passes through in demo mode)
    await page.goto('/dashboard')
  })

  test('should load the dashboard summary page and check layout navigation links', async ({
    page,
  }) => {
    // Check main layout branding title
    await expect(page.locator('h1:has-text("Culture Compass")').first()).toBeVisible()

    // Check dashboard sections
    await expect(page.locator('h3:has-text("Culture DNA")')).toBeVisible()
    await expect(page.locator('h3:has-text("Quests & XP")')).toBeVisible()
    await expect(page.locator('h3:has-text("Travel Journal")')).toBeVisible()
  })

  test('should compute Culture DNA personality via the onboarding quiz', async ({ page }) => {
    // Go to profile page
    await page.goto('/dashboard/profile')
    await expect(page.locator('h3:has-text("Culture DNA Identity")')).toBeVisible()

    // Trigger quiz
    const quizBtn = page.locator(
      'button:has-text("Compute DNA Profile"), button:has-text("Retake Quiz")',
    )
    await expect(quizBtn).toBeVisible()
    await quizBtn.click()

    // Question 1
    await page.click('button:has-text("Sampling street food and historic recipes")')
    // Question 2
    await page.click('button:has-text("Structured, tracking historical timelines sequentially")')
    // Question 3
    await page.click(
      'button:has-text("Centuries-old tea houses or trattorias recommended by locals")',
    )
    // Question 4
    await page.click('button:has-text("Locally sourced spices, tea leaves, or family recipes")')

    // Quiz completes and updates persona
    await expect(page.locator('h4:has-text("Identity Strand Computed")')).toBeVisible()
  })

  test('should discover destinations and show hidden gems and safety guidelines', async ({
    page,
  }) => {
    await page.goto('/dashboard/explore')
    await expect(page.locator('h2:has-text("AI Destination Discovery")')).toBeVisible()

    // Type query
    await page.fill('input[placeholder="Where does your curiosity lead you?"]', 'Kyoto')
    await page.click('button:has-text("Discover")')

    // Verify details
    await expect(page.locator('h3:has-text("Kyoto")')).toBeVisible()
    await expect(page.locator('text=Japan').first()).toBeVisible()

    // Check hidden gems
    await expect(page.locator('h3:has-text("Hidden Gems Curation")')).toBeVisible()
    await expect(page.locator('h4:has-text("Gio-ji Temple")')).toBeVisible()

    // Check emergency guidelines
    await expect(page.locator('h3:has-text("Emergency Assistant")')).toBeVisible()
  })

  test('should plan custom itineraries and track activity completions', async ({ page }) => {
    await page.goto('/dashboard/planner')
    await expect(page.locator('h3:has-text("AI Travel Planner")')).toBeVisible()

    // Fill form details
    await page.locator('form select option').first().waitFor({ state: 'attached' })
    await page.locator('form select').first().selectOption({ index: 0 })
    await page.fill('input[placeholder="e.g. Kyoto Cherry Blossom Tour"]', 'E2E Test Tour')
    await page.fill(
      'input[placeholder="e.g. Zen gardens, street food, heritage"]',
      'Traditional, tea',
    )

    // Generate
    await page.click('button:has-text("Generate Cultural Plan")')

    // Verify generated timeline headers
    await expect(page.locator('h3:has-text("E2E Test Tour")')).toBeVisible()
    await expect(page.locator('span:has-text("Carbon Footprint")')).toBeVisible()

    // Verify activity details
    await expect(page.locator('h4:has-text("Scheduled Excursions")')).toBeVisible()
    await expect(page.locator('h5:has-text("Kinkaku-ji Temple Visit")')).toBeVisible()

    // Toggle completion status
    const checkbox = page.locator('button[aria-label="Mark activity complete"]').first()
    await checkbox.click()
    // Verify it is marked
    await expect(
      page.locator('button[aria-label="Mark activity incomplete"]').first(),
    ).toBeVisible()
  })

  test('should checkoff quests and stamp local food passports', async ({ page }) => {
    await page.goto('/dashboard/quests')
    await expect(page.locator('h2:has-text("Traveler")')).toBeVisible()
    await expect(page.locator('h3:has-text("Active Cultural Quests")')).toBeVisible()

    // Fill food passport stamp
    await page.locator('form select option').first().waitFor({ state: 'attached' })
    await page.locator('form select').first().selectOption({ index: 0 })
    await page.fill('input[placeholder="e.g. Kyoto Yudofu, Rome Carbonara"]', 'Kyoto Matcha')
    await page.fill(
      'textarea[placeholder*="Describe where it originated"]',
      'Traditional green tea served in Arashiyama ceremony.',
    )
    await page.click('button:has-text("Stamp Passport")')

    // Verify stamp card was added to the gallery
    await expect(page.locator('h4:has-text("Kyoto Matcha")').first()).toBeVisible()
    await expect(
      page.locator('text=Traditional green tea served in Arashiyama ceremony.').first(),
    ).toBeVisible()
  })

  test('should handle AI persona chat conversations and Ordering simulators', async ({ page }) => {
    await page.goto('/dashboard/chat')
    await expect(page.locator('h2:has-text("AI Travel Companion")')).toBeVisible()

    // Destination tab chat
    await page.fill(
      'input[placeholder="Ask about the architecture, clothing, traditions..."]',
      'Tell me about Kyoto',
    )
    await page.click('form button[type="submit"]')
    await expect(page.locator('text=Heian-kyo')).toBeVisible()

    // Switch tab to simulator
    await page.click('button:has-text("Conversation Simulator")')
    await page.fill(
      'input[placeholder="Type your response in the local language..."]',
      'Konnichiwa, matcha kudasai',
    )
    await page.click('form button[type="submit"]')

    // Verify merchant simulator reply
    await expect(page.locator('text=tea house').first()).toBeVisible()
    await expect(page.locator('h4:has-text("Language Coach")')).toBeVisible()
  })

  test('should log travel memoirs, narrate entries, and request Memory Book PDF compilation', async ({
    page,
  }) => {
    await page.goto('/dashboard/journal')
    await expect(page.locator('h3:has-text("Travel Memoirs")')).toBeVisible()

    // Add entry
    await page.fill('input[placeholder="e.g. Kyoto Moss Forest"]', 'Kyoto Gardens visit')
    await page.fill(
      'textarea[placeholder*="Type rough points"]',
      'Quiet walk in Gio-ji moss forest, heard birds, felt calm',
    )
    await page.click('button:has-text("Save Narrative Memoir")')

    // Verify card is added containing raw logs and generated narrative
    await expect(page.locator('h4:has-text("Kyoto Gardens visit")').first()).toBeVisible()
    await expect(page.locator('text=Kyoto was nothing short of magical').first()).toBeVisible()

    // Trigger Memory Book compilation
    await page.click('button:has-text("Compile Memory Book")')
    // Verify successful compilation feedback and download availability
    await expect(page.locator('text=Compiled Successfully')).toBeVisible()
    await expect(page.locator('button:has-text("Download PDF Book")')).toBeVisible()
  })
})
