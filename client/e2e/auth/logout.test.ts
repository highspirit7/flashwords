import { test, expect } from '@playwright/test'
import { login } from 'utils/auth'
import { testuserCredentials } from 'utils/config'

test.beforeEach(async ({ page }) => {
  await login(page, testuserCredentials)
  await page.waitForURL('/')
})

test.describe('logout', () => {
  test('user should log out and will be redirected to login page', async ({ page }) => {
    await page.getByRole('button', { name: 'Log out' }).click()
    await page.waitForURL('/login')
    await expect(page.getByRole('main').getByRole('button', { name: 'Log in' })).toBeVisible()
  })
})
