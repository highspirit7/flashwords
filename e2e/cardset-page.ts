/* eslint-disable no-plusplus */
import type { Page } from '@playwright/test'

export default class CardSetPage {
  constructor(public readonly page: Page) {
    this.page = page
  }

  async goToCreateCardSet() {
    await this.page.goto('http://localhost:5173/create-card-set')
  }

  async createCardSetWith2Terms(
    title: string,
    firstCard: { term: string; definition: string },
    secondCard: { term: string; definition: string },
  ) {
    await this.goToCreateCardSet()
    await this.page.getByRole('textbox', { name: 'Enter a title for this cards' }).click()
    await this.page.getByRole('textbox', { name: 'Enter a title for this cards' }).fill(title)

    await this.page.getByRole('button', { name: 'Add a card' }).click()

    await this.page.getByTestId('term-input').nth(1).fill(firstCard.term)
    await this.page.getByTestId('definition-input').nth(1).fill(firstCard.definition)
    await this.page.getByTestId('term-input').nth(3).fill(secondCard.term)
    await this.page.getByTestId('definition-input').nth(3).fill(secondCard.definition)
    await this.page.getByRole('button', { name: 'Create' }).click()
  }

  async addCardToCardSet(card: { term: string; definition: string }) {
    await this.page.getByRole('button', { name: 'Add or Remove terms' }).click()
    await this.page.getByRole('button', { name: 'Add a card' }).click()
    await this.page.getByTestId('term-input--edit').last().click()
    await this.page.getByTestId('term-input--edit').last().fill(card.term)
    await this.page.getByTestId('definition-input--edit').last().click()
    await this.page.getByTestId('definition-input--edit').last().fill(card.definition)
    await this.page.getByRole('button', { name: 'Done' }).click()
  }
}
