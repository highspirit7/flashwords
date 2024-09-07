import { test, expect } from '@playwright/test'
import { login } from 'utils/auth'
import { testuserCredentials } from 'utils/config'
import Chance from 'chance'

const chance = Chance()
const testData = {
  cardsetTitle: 'new_cardset',
  firstCard: {
    term: chance.word(),
    definition: chance.word(),
  },
  secondCard: {
    term: chance.word(),
    definition: chance.word(),
  },
}

test.describe.serial('cardset', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testuserCredentials)
  })

  test('create a cardset', async ({ page }) => {
    await page.getByTestId('plus-button').click()
    await page.waitForURL('/create-cardset')
    await page
      .getByRole('textbox', { name: 'Enter a title for this cardset' })
      .fill(testData.cardsetTitle)

    await page.getByRole('button', { name: 'Add a card' }).click()
    await page.getByTestId('term-input').nth(1).fill(testData.firstCard.term)
    await page.getByTestId('definition-input').nth(1).fill(testData.firstCard.definition)
    await page.getByTestId('term-input').nth(3).fill(testData.secondCard.term)
    await page.getByTestId('definition-input').nth(3).fill(testData.secondCard.definition)
    await page.getByRole('button', { name: 'Create' }).click()
    await page.waitForURL('/cardsets')

    await expect(page.getByTestId('terms-card-title').first()).toHaveText(testData.cardsetTitle)
    await expect(page.getByTestId('terms-card-cardcount').first()).toHaveText('2 terms')
  })

  test('add one card to the newly created cardset', async ({ page }) => {
    await page.waitForURL('/cardsets')
    await page.getByTestId('terms-card').first().click()
    await page.getByRole('button', { name: 'Add or Remove terms' }).click()

    await page.getByRole('button', { name: 'Add a card' }).click()
    await page.getByTestId('term-input--edit').nth(5).fill(chance.word())
    await page.getByTestId('definition-input--edit').nth(5).fill(chance.word())

    await page.getByRole('button', { name: 'Back to cardset' }).click()

    await page.waitForURL('/new_cardset/**')
    await expect(page.getByTestId('term-card')).toHaveCount(3)
  })

  test('delete the newly created cardset', async ({ page }) => {
    await page.waitForURL('/cardsets')
    await page.getByTestId('terms-card').first().click()

    await page.locator('#dropdownMenuIconHorizontalButton').click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByTestId('delete-modal-button-to-delete').click()

    await page.waitForURL('/cardsets')
    await expect(page.getByTestId('terms-card')).toHaveCount(1)
  })
})
