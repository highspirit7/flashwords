import { test, expect } from '@playwright/test'
import CardSetPage from './cardset-page.ts'

test.describe('flashcard test', () => {
  test.beforeEach(async ({ page }) => {
    const cardSetPage = new CardSetPage(page)
    await cardSetPage.goToCreateCardSet()
    await cardSetPage.createCardSetWith2Terms(
      'Italki lesson with Elisa',
      { term: 'verbeteren', definition: 'to improve' },
      { term: 'oplossen', definition: 'to solve' },
    )
    await page.getByRole('link', { name: 'Italki lesson with Elisa 2' }).click()
    await page.waitForURL('http://localhost:5173/card-set/**')

    await cardSetPage.addCardToCardSet({ term: 'voordeel', definition: 'advantage' })
  })

  test('flip the first card in flashcards', async ({ page }) => {
    await page.getByTestId('flashcard-term').first().click()
    await expect(page.getByTestId('flashcard-definition').first()).toBeVisible()
  })

  test('click next button in flashcards', async ({ page }) => {
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByTestId('flashcard-definition').first()).toBeVisible()
  })
})
