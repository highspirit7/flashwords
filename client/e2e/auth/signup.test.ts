import { test, expect } from '@playwright/test'
import Chance from 'chance'

const chance = new Chance()
const testEmail = `test_${String(chance.integer({ min: 10, max: 99 }))}_${chance.email()}`
const anotherTestEmail = `test_${chance.integer({ min: 10, max: 99 })}_${chance.email()}`
const VALID_PASSWORD = 'Testuser123'
const username = chance.name().replaceAll(' ', '')
const anotherUsername = chance.name().replaceAll(' ', '')

test.describe.serial('signup with validation and errors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  //   await asUser()
  test('should sign up successfully', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email"]', testEmail)
    await page.fill('input[placeholder="sunshine2000"]', username)
    await page.fill('input[placeholder="Enter your password"]', VALID_PASSWORD)

    await page.getByRole('main').getByRole('button', { name: 'Sign up' }).click()

    await page.waitForURL('/login')

    expect(page.url()).toBe('http://localhost:5173/login')
  })

  test('should show validation errors for invalid inputs', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email"]', 'invalid-email')
    await page.fill('input[placeholder="sunshine2000"]', 'a')
    await page.fill('input[placeholder="Enter your password"]', 'short')

    await page.getByRole('main').getByRole('button', { name: 'Sign up' }).click()

    await expect(page.getByText('Invalid email')).toBeVisible()
    await expect(page.getByText('Username must be at least 4 characters long')).toBeVisible()
    await expect(page.getByText('Password must be at least 8 characters long')).toBeVisible()

    await page.fill('input[placeholder="Enter your password"]', 'longpassword')

    await expect(
      page.getByText('Password must include at least one uppercase letter'),
    ).toBeVisible()

    await page.fill('input[placeholder="Enter your password"]', 'longPassword')
    await page.fill('input[placeholder="sunshine2000"]', 'verylongusernamemorethan24characters')

    await expect(page.getByText('Password must include at least one number')).toBeVisible()
    await expect(page.getByText('Username must be at most 24 characters long')).toBeVisible()
  })

  test('should show server error message if signup fails', async ({ page }) => {
    await page.fill('input[placeholder="Enter your email"]', testEmail)
    await page.fill('input[placeholder="sunshine2000"]', anotherUsername)
    await page.fill('input[placeholder="Enter your password"]', VALID_PASSWORD)

    await page.getByRole('main').getByRole('button', { name: 'Sign up' }).click()

    await expect(page.getByText('User with this email already exists')).toBeVisible()

    await page.fill('input[placeholder="Enter your email"]', anotherTestEmail)
    await page.fill('input[placeholder="sunshine2000"]', username)

    await page.getByRole('main').getByRole('button', { name: 'Sign up' }).click()

    await expect(page.getByText('User with this username already exists')).toBeVisible()
  })
})
