import { test, expect } from '@playwright/test'
import CardSetPage from './cardset-page.ts'

test.describe('update and delete a term in card set', () => {
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
  })

  test('update definition of 1st term', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Icon' }).first().click()
    await page.getByLabel('term-card--definition').first().click()
    await page.getByLabel('term-card--definition').first().fill('improve')
    await page.getByLabel('term-card--definition').first().press('Enter')

    await expect(page.getByLabel('term-card--definition').first()).toHaveValue(/improve/)
  })

  test('delete one term card', async ({ page }) => {
    await page.getByRole('button', { name: 'Add or Remove terms' }).click()
    await page
      .locator('li')
      .filter({ hasText: '1Trash Bin IconTermDefinition' })
      .getByRole('button')
      .click()
    await page.getByRole('button', { name: 'Done' }).click()
    await expect(page.getByTestId('term-card')).toHaveCount(1)
  })
})
