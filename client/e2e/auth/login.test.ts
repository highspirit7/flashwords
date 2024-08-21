import { baseUrlDev } from 'utils/config'
import { test, expect } from '@playwright/test'
import { login } from 'utils/auth'
import { testuserCredentials } from 'utils/config'

test.describe('login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should log in successfully', async ({ page }) => {
    await login(page, testuserCredentials)
    await page.waitForURL('/')
    await expect(page.url()).toBe(`${baseUrlDev}/`)

    await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible()
  })

  test('fail to log in because of using wrong password', async ({ page }) => {
    await login(page, { email: testuserCredentials.email, password: 'Incorrectpassword123' })

    await expect(
      page.getByText('Your login details are not correct. Please try again.'),
    ).toBeVisible()
  })

  test('fail to log in because of using wrong email', async ({ page }) => {
    await login(page, { email: 'nottestuser@example.com', password: testuserCredentials.email })

    await expect(
      page.getByText('Your login details are not correct. Please try again.'),
    ).toBeVisible()
  })
})
