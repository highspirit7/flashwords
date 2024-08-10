# flashwords

This project is a flashcard application based on Vue 3, Vite and TypeScript.

---

## How to run & test this project

```sh
npm install
npm run dev
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- e2e/cardset.spec.ts
```
