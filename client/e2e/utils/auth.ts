import { Page } from '@playwright/test'

export async function login(
  page: Page,
  userCredentials: { email: string; password: string },
): Promise<void> {
  await page.goto('/login')
  await page.fill('input[placeholder="Enter your email"]', userCredentials.email)
  await page.fill('input[placeholder="Enter your password"]', userCredentials.password)

  await page.getByRole('main').getByRole('button', { name: 'Log in' }).click()
}
