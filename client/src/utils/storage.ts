const CARD_SETS_KEY = 'cardSets'
const SELECTED_CARD_KEY = 'selectedCard'

function setItem(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting item in localStorage: ', error)
  }
}

function getItem(key: string) {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : null
  } catch (error) {
    console.error('Error getting item from localStorage: ', error)
    return null
  }
}

export { setItem, getItem, CARD_SETS_KEY, SELECTED_CARD_KEY }
