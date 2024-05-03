# flashwords

This project is a flashcard application based on Vue 3, Vite and TypeScript.


***

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

***
## Features
- CRUD for card sets, terms in card set, examples in each term
- Learn terms on flashcards
- Get a hint(one ramdonly chosed example of the term) on a flashcard
- Dark/light mode
- Responsive design

***
## Design prototypes
https://www.figma.com/file/qEP8i8slhP189EQ1RlE3Es/Word-flashcard?type=design&node-id=0%3A1&mode=design&t=Yk8WIRYZA6X8lMvn-1




