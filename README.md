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

***
## Pages design
### Card set page

![Screenshot 2024-05-03 at 11 10 05 PM](https://github.com/highspirit7/flashwords/assets/37180000/a2de64b5-c91c-4ac7-8b6b-f7d13db313b9)
![Screenshot 2024-05-03 at 11 09 55 PM](https://github.com/highspirit7/flashwords/assets/37180000/880a384e-aa07-4a72-a9ba-4968d72477a1)
