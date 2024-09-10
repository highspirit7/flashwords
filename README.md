## Setup

1. `npm install`
2. Create a PostgreSQL database (or use an existing one).
3. Setup `.env` files in `client` and `server` based on `.env.example` files.

## Tests

```bash
# front end E2E tests
npm run test:e2e -w client

# back end tests with an in-memory database
npm test -w server
```

## Running the project in development

```bash
# automatically restarts the server
npm run dev -w server

# client can be started separately
npm run dev -w client
```

## Running the project in production

Client (when not using a dedicated server application):

```bash
npm run build -w client
npm run preview -w client
```

Server:

```bash
npm run build -w server
npm run start -w server
```

## Trpc panel

Once you run a dev server, you also can check and use all the apis on trpc.panel(http://localhost:3000/api/v1/trpc-panel)

1. Execute signup mutation
2. Execute login mutation with the credentials you used for signup : you will receive userId, accessToken.
3. Set the accesstoken on headers : you can set 'Authorization' on key and the accesstoken on value
<img width="480" alt="Screenshot 2024-09-08 at 10 51 38 AM" src="https://github.com/user-attachments/assets/55f128f7-c290-45f4-883f-3ba911e18419">

4. Then you can try all other Apis on trpc.panel


## Test account

You also can just try this app with a test account as below:
```
dutch@test.com / Dutch1234
```
      
---

## Features

- CRUD for card sets, terms in card set, examples in each term
- Learn terms on flashcards
- Get a hint(one ramdonly chosed example of the term) on a flashcard
- Dark/light mode
- Responsive design

## Design prototypes
   
https://www.figma.com/file/qEP8i8slhP189EQ1RlE3Es/Word-flashcard?type=design&node-id=0%3A1&mode=design&t=Yk8WIRYZA6X8lMvn-1

## Pages design

### cardsets page
<img width="640" alt="Screenshot 2024-09-08 at 10 37 57 AM" src="https://github.com/user-attachments/assets/97ab9030-5435-4410-9e59-c680576e7dc9">

### each cardset page
<img width="640" alt="Screenshot 2024-09-08 at 10 38 26 AM" src="https://github.com/user-attachments/assets/cd7ce52a-15a5-4b80-b47b-2d2fcbf67a69">

### each card page
<img width="640" alt="Screenshot 2024-09-08 at 10 38 53 AM" src="https://github.com/user-attachments/assets/8df69dce-c1bd-43d6-8b0d-3d585f51ee70">

## Deployed App URL
https://flashwords-container.h4b71er768rva.ap-northeast-2.cs.amazonlightsail.com/
