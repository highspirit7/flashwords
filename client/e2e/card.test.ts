import { test, expect } from '@playwright/test'
import { login } from 'utils/auth'
import { testuserCredentials } from 'utils/config'
import Chance from 'chance'

const chance = Chance()

test.describe.serial('card', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testuserCredentials)
  })

  test('update one card by clicking a pen icon', async ({ page }) => {
    // add a new card first
    await page.waitForURL('/cardsets')

    await page.goto('/test_set/1')
    await page.getByRole('button', { name: 'Add or Remove terms' }).click()

    await page.getByRole('button', { name: 'Add a card' }).click()
    await page.getByTestId('term-input--edit').nth(5).fill(chance.word())
    await page.getByTestId('definition-input--edit').nth(5).fill(chance.word())

    await page.getByRole('button', { name: 'Back to cardset' }).click()

    await page.waitForURL('/test_set/**')

    // Choose the last card and update
    await page.getByTestId('card-edit-button').last().waitFor()

    await page.getByTestId('card-edit-button').last().click()
    await page.getByLabel('term-card--term').last().fill('goed')
    await page.getByLabel('term-card--definition').last().fill('good')
    await page.locator('body').click()

    await expect(page.getByLabel('term-card--term').last()).toHaveValue('goed')
    await expect(page.getByLabel('term-card--definition').last()).toHaveValue('good')
  })

  test('delete the newly updated card', async ({ page }) => {
    await page.waitForURL('/cardsets')

    await page.goto('/test_set/1')
    await page.getByRole('button', { name: 'Add or Remove terms' }).click()

    await page.getByTestId('remove-card-button').last().click()
    await page.getByRole('button', { name: 'Back to cardset' }).click()

    await expect(page.getByTestId('term-card')).toHaveCount(2)
  })
})
