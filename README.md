# ReleaseCheck

A release checklist tool for developers. Track every release through its lifecycle — from planned, to ongoing, to done — with a fixed 7-step checklist, editable notes, and an at-a-glance status that's always computed automatically from what's actually been checked off.

This is a single-page application built as a full-stack take-home assignment, covering a GraphQL API, a PostgreSQL database, a React frontend, Docker support, and automated tests.

## Live Demo

- **Frontend (Vercel):** _to be added after deployment_
- **Backend GraphQL API (Render):** _to be added after deployment_
- **Demo video:** _to be added_

## What it does

- **View all releases** in a table — name, date, and auto-computed status
- **Create a new release** with a name and due date, plus optional notes
- **Check off the 7 release steps** (PRs merged, changelog updated, tests passing, etc.) — status updates automatically:
  - No steps checked → **Planned**
  - Some steps checked → **Ongoing**
  - All steps checked → **Done**
- **Edit** a release's name, date, or additional notes
- **Delete** a release
- Fully **responsive** — works on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Apollo Client, React Router |
| Backend | Node.js, Apollo Server (GraphQL) |
| Database | PostgreSQL (hosted on [Neon](https://neon.tech)), Prisma ORM |
| Testing | Jest |
| Containerization | Docker + Docker Compose |
| Deployment | Vercel (frontend), Render (backend) |
| CI | GitHub Actions (validates the Docker build on every push) |

## Why this stack

- **GraphQL over REST** — required by the assignment; also meant the frontend could request exactly the fields each view needs (the list page never fetches step data it doesn't display, for example).
- **Prisma over a raw SQL client** — gives us type-safe queries and a migration history as plain, readable files, and made documenting the database schema (below) straightforward.
- **Status computed, never stored** — the `Release` table has no `status` column. It's derived from the `steps` JSON on every read, so it can never drift out of sync with what's actually been checked.
- **Plain CSS, no UI framework** — the assignment explicitly asked for a simple, usable interface rather than a polished design system, so we kept the dependency list lean.

## Project Structure

```
release-checklist/
├── backend/            # GraphQL API — see backend/README.md
│   ├── prisma/
│   ├── src/
│   ├── tests/
│   └── Dockerfile
├── frontend/           # React SPA — see frontend/README.md
│   └── src/
├── .github/
│   └── workflows/
│       └── docker-build.yml   # CI check: backend Docker image builds cleanly
├── docker-compose.yaml
└── README.md           # you are here
```

## Running it locally

Full step-by-step instructions (with expected output at each step) live in each subproject's own README:

- **[backend/README.md](./backend/README.md)** — API setup, database migration, running tests, Docker
- **[frontend/README.md](./frontend/README.md)** — dev server setup, connecting to the API

Quick start, if you just want it running:

```bash
git clone https://github.com/Syed-Ahmed-shan/release-checklist.git
cd release-checklist

# Terminal 1 — backend
cd backend
npm install
cp .env.example .env   # then add your own DATABASE_URL
npx prisma migrate dev --name init
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173`.

## API & Database Documentation

The full GraphQL schema (queries, mutations, types) and the database schema are documented in **[backend/README.md](./backend/README.md)**.

## Testing

```bash
cd backend
npm test
```

6 automated tests cover the core status-computation business logic and the `createRelease` resolver, using a mocked Prisma client so tests never touch the real database.

## Stress Testing & Performance

_To be added: results of load-testing the deployed API, the point at which performance degrades, and the optimizations applied._

## Design Decisions

- **Steps are stored as JSON on the release row**, not in a separate table — since the same 7 steps apply to every release and don't change over time, this avoids an unnecessary join for a fixed, small set of values.
- **`toggleStep` uses an atomic `jsonb_set` database update** rather than a read-then-write in application code, to prevent race conditions when multiple checkboxes are toggled in quick succession.
- **The frontend treats checklist state as local-first**: clicking a checkbox updates the UI instantly and persists in the background, rather than waiting on a network round trip — important for a checklist that's meant to feel immediate.
- **One repo, two deployable halves**: the backend and frontend are independently deployable (Render + Vercel) but live in a single GitHub repository, per the assignment's requirement.

## Author

Syed Ahmed Nawaz
[GitHub](https://github.com/Syed-Ahmed-shan) · [LinkedIn](https://www.linkedin.com/in/syed-ahmad-nawaz-31a60a271/) 