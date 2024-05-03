import { test, expect } from '@playwright/test'
import CardSetPage from './cardset-page.ts'

test.describe('CRUD for a card set', () => {
  test.beforeEach(async ({ page }) => {
    const cardSetPage = new CardSetPage(page)
    await cardSetPage.goToCreateCardSet()
    await cardSetPage.createCardSetWith2Terms(
      'Italki lesson with Elisa',
      { term: 'verbeteren', definition: 'to improve' },
      { term: 'oplossen', definition: 'to solve' },
    )
  })

  test('delete the card set', async ({ page }) => {
    await expect(page.getByTestId('terms-card')).toHaveCount(1)

    await page.getByRole('link', { name: 'Italki lesson with Elisa 2' }).click()
    await page.locator('#dropdownMenuIconHorizontalButton').click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByTestId('delete-modal-button-to-delete').click()

    await expect(page.getByRole('heading', { name: 'No card sets' })).toBeVisible()
  })

  test('check if it has 2 terms', async ({ page }) => {
    await page.getByRole('link', { name: 'Italki lesson with Elisa 2' }).click()
    await page.waitForURL('http://localhost:5173/card-set/**')
    await expect(page.getByTestId('term-card')).toHaveCount(2)
  })

  test('update the title of card set', async ({ page }) => {
    await page.getByRole('link', { name: 'Italki lesson with Elisa 2' }).click()
    await page.waitForURL('http://localhost:5173/card-set/**')

    await page.getByRole('button', { name: 'Add or Remove terms' }).click()
    await page.getByRole('textbox', { name: 'Enter a title for this cards' }).click()
    await page
      .getByRole('textbox', { name: 'Enter a title for this cards' })
      .fill('Italki lesson with Jeroen')
    await page.getByRole('button', { name: 'Done' }).click()
    await expect(page.getByTestId('cardset-title')).toHaveText(/Italki lesson with Jeroen/)
  })
})
