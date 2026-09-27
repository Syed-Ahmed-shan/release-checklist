# ReleaseCheck — Frontend

The single-page web app for ReleaseCheck. Talks to the backend GraphQL API to list, create, edit, and delete releases, and to check off release steps.

## Tech Stack

- **React** — UI library
- **Vite** — dev server and build tool
- **Apollo Client** — GraphQL client, handles data fetching and caching
- **React Router** — client-side routing (list page ↔ detail page)

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm
- The backend running — either locally (see `backend/README.md`) or a deployed URL

## 1. Install dependencies

```bash
cd frontend
npm install
```

Expected output ends with something like:

```
added 180 packages in 8s
```

## 2. Point the app at your backend (optional)

By default, the app looks for the API at `http://localhost:4000/`. If your backend runs somewhere else (e.g. a deployed Render URL), create a `.env` file:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

Then edit `.env`:

```
VITE_API_URL=http://localhost:4000/
```

## 3. Start the dev server

Make sure the backend is running first (see `backend/README.md`), then:

```bash
npm run dev
```

Expected output:

```
  VITE v5.x.x  ready in 350 ms

  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

## 4. Build for production

```bash
npm run build
```

This outputs static files into `dist/`, ready to deploy to any static host (Vercel, Netlify, etc.). Preview the production build locally with:

```bash
npm run preview
```

---

## Features

- View all releases in a table, sorted by date, with an auto-computed status (Planned / Ongoing / Done)
- Create a new release (name + date, with optional notes)
- Open a release to check/uncheck its 7 fixed steps — saves instantly, no page reload
- Edit a release's name, date, or notes and save
- Delete a release

## Project Structure

```
frontend/
├── src/
│   ├── graphql/
│   │   ├── queries.js       # GET_RELEASES, GET_RELEASE
│   │   └── mutations.js     # create/update/toggle/delete
│   ├── pages/
│   │   ├── ReleasesListPage.jsx
│   │   └── ReleaseDetailPage.jsx  # handles both "new" and "edit" modes
│   ├── App.jsx               # routes + shared header
│   ├── main.jsx               # Apollo + Router setup
│   ├── apolloClient.js
│   └── index.css
└── package.json
```