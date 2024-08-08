## Setup

1. `npm install`
2. Create a PostgreSQL database (or use an existing one).
3. Setup `.env` files in `client` and `server` based on `.env.example` files.

## Tests

```bash
# front end unit and E2E tests
npm test -w client

# front end unit tests
npm run test:unit -w client

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

### Card set page

![Screenshot 2024-05-03 at 11 10 05 PM](https://github.com/highspirit7/flashwords/assets/37180000/a2de64b5-c91c-4ac7-8b6b-f7d13db313b9)
![Screenshot 2024-05-03 at 11 09 55 PM](https://github.com/highspirit7/flashwords/assets/37180000/880a384e-aa07-4a72-a9ba-4968d72477a1)

## To-dos current progress to make it fullstack project

- [x] Change project set up to be monorepo
- [x] Jwt authentication(server)
- [x] Jwt authentication(client)
- [ ] db migrations(cardset, card, example)
  - example table is not created yet
- [x] create cardset endpoints(server)
- [ ] adopt cardset endpoints(client)
- [x] create card endpoints(server)
- [ ] adopt card endpoints(client)
- [ ] create example endpoint(server)
- [ ] adopt example endpoint(client)
- [ ] e2e testings on client
