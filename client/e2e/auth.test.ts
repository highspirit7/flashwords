import Chance from 'chance'
import { test, expect } from '@playwright/test'
import { login } from 'utils/auth'
import { baseUrlDev } from 'utils/config'

const chance = new Chance()
const testEmail = `test_${String(chance.integer({ min: 10, max: 99 }))}_${chance.email()}`
const anotherTestEmail = `test_${chance.integer({ min: 10, max: 99 })}_${chance.email()}`
const VALID_PASSWORD = 'Testuser123'
const username = chance.name().replaceAll(' ', '')
const anotherUsername = chance.name().replaceAll(' ', '')

test.describe.serial('authentication', () => {
  test('should sign up successfully', async ({ page }) => {
    await page.goto('/signup')
    await page.fill('input[placeholder="Enter your email"]', testEmail)
    await page.fill('input[placeholder="sunshine2000"]', username)
    await page.fill('input[placeholder="Enter your password"]', VALID_PASSWORD)

    await page.getByRole('main').getByRole('button', { name: 'Sign up' }).click()

    await page.waitForURL('/login')

    expect(page.url()).toBe('http://localhost:5173/login')
  })

  test('should show validation errors for invalid inputs', async ({ page }) => {
    await page.goto('/signup')
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
    await page.goto('/signup')
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

  test('fail to log in because of using wrong password', async ({ page }) => {
    await page.goto('/login')
    await login(page, { email: testEmail, password: 'Incorrectpassword123' })

    await expect(
      page.getByText('Your login details are not correct. Please try again.'),
    ).toBeVisible()
  })

  test('fail to log in because of using wrong email', async ({ page }) => {
    await login(page, { email: 'nottestuser@example.com', password: VALID_PASSWORD })

    await expect(
      page.getByText('Your login details are not correct. Please try again.'),
    ).toBeVisible()
  })

  test('should log in successfully', async ({ page }) => {
    await page.goto('/login')
    await login(page, { email: testEmail, password: VALID_PASSWORD })
    await page.waitForURL('/')
    await expect(page.url()).toBe(`${baseUrlDev}/`)

    await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible()
  })

  test('user should log out and will be redirected to login page', async ({ page }) => {
    await login(page, { email: testEmail, password: VALID_PASSWORD })
    await page.waitForURL('/')
    await page.getByRole('button', { name: 'Log out' }).click()
    await page.waitForURL('/login')
    await expect(page.getByRole('main').getByRole('button', { name: 'Log in' })).toBeVisible()
  })
})
