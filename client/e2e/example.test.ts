import { test, expect } from '@playwright/test'
import { login } from 'utils/auth'
import { testuserCredentials } from 'utils/config'
import Chance from 'chance'

const chance = Chance()

test.describe('card', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testuserCredentials)
  })

  test('add an example, modify it and delete it', async ({ page }) => {
    test.setTimeout(20000)
    await page.waitForURL('/cardsets')
    await page.getByTestId('terms-card').click()
    await page.getByRole('button', { name: 'Open Term Icon' }).first().click()
    await page.waitForURL('/test_set/**/leuk/**')

    // create an example
    await page.getByRole('button', { name: 'Add example' }).click()

    await page
      .getByRole('textbox', { name: 'Type an example sentence' })
      .fill('new example for leuk')
    await page.getByRole('button', { name: 'Add', exact: true }).click()

    await expect(page.getByTestId('example-input')).toHaveValue('new example for leuk')

    const randomWord = chance.word()
    // modify an example
    await page.getByRole('button', { name: 'Edit Icon' }).click()
    await page.getByTestId('example-input').click()
    await page.getByTestId('example-input').fill(randomWord)
    await page.locator('body').click()
    await expect(page.getByTestId('example-input')).toHaveValue(randomWord)

    // delete an example
    await page.getByRole('button', { name: 'Trash Bin Icon' }).click()
    await page.getByTestId('delete-modal-button-to-delete').click()
    await expect(page.getByRole('heading', { name: 'No examples' })).toBeVisible()
  })
})
