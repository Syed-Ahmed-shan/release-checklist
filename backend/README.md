# ReleaseCheck — Backend

The GraphQL API for ReleaseCheck, a release checklist tool. Built with Apollo Server, Prisma, and PostgreSQL.

## Tech Stack

- **Node.js** — runtime
- **Apollo Server** — GraphQL API layer
- **Prisma ORM** — database access and migrations
- **PostgreSQL** — database (hosted on [Neon](https://neon.tech))
- **Jest** — automated tests
- **Docker** — containerized local/production runs

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)
- A PostgreSQL connection string (we use Neon's free tier — you can create your own project at neon.tech, or use MySQL/another Postgres host if you prefer)

## 1. Clone the repo

```bash
git clone https://github.com/Syed-Ahmed-shan/release-checklist.git
cd release-checklist/backend
```

## 2. Install dependencies

```bash
npm install
```

Expected output ends with something like:

```
added 210 packages in 6s
```

## 3. Configure environment variables

Copy the example file:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

Open the new `.env` file and paste in your own database connection string:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
PORT=4000
```

## 4. Run the database migration

This creates the `Release` table in your database.

```bash
npx prisma migrate dev --name init
```

Expected output:

```
Applying migration `..._init`
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

## 5. Start the server

```bash
npm run dev
```

Expected output:

```
🚀 ReleaseCheck API ready at http://localhost:4000/
```

Open that URL in your browser — it loads **Apollo Sandbox**, an interactive GraphQL playground where you can run the example query below.

## 6. Run the automated tests

```bash
npm test
```

Expected output:

```
Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
```

## 7. Run with Docker (alternative to steps 4–5)

From the **repo root** (one level up from `backend/`), not from inside `backend/`:

```bash
docker compose up --build
```

This builds the backend into a container and starts it on `http://localhost:4000`, using the same `DATABASE_URL` from your `.env` file.

---

## API Reference

Single GraphQL endpoint: `POST http://localhost:4000/`

### Queries

| Query | Returns | Description |
|---|---|---|
| `releases` | `[Release!]!` | All releases, ordered by date |
| `release(id: ID!)` | `Release` | One release by id |

### Mutations

| Mutation | Returns | Description |
|---|---|---|
| `createRelease(name: String!, date: String!, additionalInfo: String)` | `Release!` | Creates a new release with all steps unchecked |
| `updateRelease(id: ID!, name: String, date: String, additionalInfo: String)` | `Release!` | Updates one or more fields |
| `toggleStep(id: ID!, stepKey: String!, completed: Boolean!)` | `Release!` | Checks/unchecks a single step |
| `deleteRelease(id: ID!)` | `Boolean!` | Deletes a release |

### Types

```graphql
type Release {
  id: ID!
  name: String!
  date: String!            # ISO 8601 string
  status: ReleaseStatus!   # PLANNED | ONGOING | DONE — always computed, never set directly
  additionalInfo: String
  steps: [Step!]!
  createdAt: String!
}

type Step {
  key: String!
  label: String!
  completed: Boolean!
}

enum ReleaseStatus {
  PLANNED
  ONGOING
  DONE
}
```

### Example: try this in Apollo Sandbox

```graphql
mutation {
  createRelease(name: "Version 1.0.1", date: "2022-09-20T00:00:00.000Z") {
    id
    status
    steps {
      key
      completed
    }
  }
}
```

Expected result: `status: "PLANNED"`, all 7 steps `completed: false`.

---

## Database Schema

Single table: **`Release`**

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` (PK) | auto-generated |
| `name` | `text` | required |
| `date` | `timestamp` | required |
| `additionalInfo` | `text` | nullable |
| `steps` | `jsonb` | e.g. `{"prs_merged": true, "tests_passing": false, ...}` |
| `createdAt` | `timestamp` | defaults to creation time |
| `updatedAt` | `timestamp` | auto-updated on every write |

**Note:** `status` is intentionally **not** a database column — it's a derived value, computed from `steps` every time a `Release` is read (see `computeStatus` in `src/steps.js`). This guarantees it can never fall out of sync with the actual checklist state.

The 7 fixed steps (defined in `src/steps.js`, shared across all releases):

1. All relevant GitHub pull requests have been merged
2. CHANGELOG.md files have been updated
3. All tests are passing
4. Releases in Github created
5. Deployed in demo
6. Tested thoroughly in demo
7. Deployed in production

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Release model definition
├── src/
│   ├── index.js            # Server entrypoint
│   ├── schema.js           # GraphQL type definitions
│   ├── resolvers.js        # Query/Mutation logic
│   └── steps.js            # Fixed step list + status computation
├── tests/
│   ├── steps.test.js
│   └── resolvers.test.js
├── Dockerfile
├── .env.example
└── package.json
```