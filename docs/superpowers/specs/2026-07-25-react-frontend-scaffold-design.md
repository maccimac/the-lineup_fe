# The Lineup — React Frontend Scaffold — Design

**Date:** 2026-07-25
**Status:** Approved

## Purpose

Stand up a minimal React frontend for The Lineup that will eventually connect to a Java backend (backend scaffolding is deferred to a later, separate task). This first pass is intentionally small: one scaffold, one placeholder page, and connection-ready plumbing pointed at a backend that doesn't exist yet.

## Scope

In scope:
- Vite + React + TypeScript project scaffold, created directly inside the existing `the-lineup_fe` directory (alongside `MASTER-TODO.md`, `README.md`, and the spec file already there)
- A single placeholder page showing the site name and tagline
- A small backend-connection widget that proves the wiring works, even with no backend present yet
- Env-based configuration for the backend base URL

Out of scope (explicitly deferred):
- The Java backend itself
- Any real page content, design system, or routing (per `MASTER-TODO.md`: React scaffold first, design system and pages come later)
- Auth, data fetching beyond the health check, styling polish

## Architecture & Setup

- Scaffold via Vite's `react-ts` template, merged into the current directory.
- Standard Vite structure: `src/main.tsx`, `src/App.tsx`, `src/index.css`, `index.html`, `vite.config.ts`, `tsconfig.json`.
- Package manager: npm.
- `.env.example` with `VITE_API_BASE_URL=http://localhost:8080` — documents the expected backend location without requiring it to exist. Real `.env` is gitignored.

## Health-check connection widget

- `src/lib/api.ts` — a small fetch wrapper that reads `import.meta.env.VITE_API_BASE_URL` and exposes `checkHealth()`, which performs `GET {baseUrl}/api/health` and returns a simple status result (ok / unreachable), catching network errors rather than throwing.
- `src/components/BackendStatus.tsx` — calls `checkHealth()` on mount (`useEffect`), and renders a status pill with three states: "Checking…", "Connected", or "Backend unreachable". Since no backend exists yet, "Backend unreachable" is the expected steady state for now.
- `App.tsx` renders one placeholder page: site name ("The Lineup"), tagline ("Content · Sustainability · Board sports"), and the `BackendStatus` widget. No routing, no navigation, no additional pages.

## Testing / Verification

- `npm run dev` starts the app without errors.
- `npm run build` and `tsc` typecheck succeed.
- Manual check: the status widget correctly settles on "Backend unreachable" (since there's no backend running) without crashing the app.

## Follow-up (not part of this task)

- Java backend scaffold with a real `/api/health` endpoint (separate future task).
- Design system and additional pages per `MASTER-TODO.md`.
