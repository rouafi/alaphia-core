Alaphia Core Monorepo

This repository contains:
- `front/` — Next.js frontend
- `backend/` — NestJS backend (DDD + Hexagonal)
- `docker-compose.yml` — Postgres (pgvector), frontend, backend orchestration

## Prerequisites
- Node.js 20+
- Docker + Docker Compose
- A `.env` at repo root (you can start with these defaults):

```bash
POSTGRES_DB=alaphia
POSTGRES_USER=alaphia
POSTGRES_PASSWORD=alaphia
POSTGRES_PORT=5432
DATABASE_URL=postgresql://alaphia:alaphia@localhost:5432/alaphia
FRONT_PORT=3000
# BACKEND_PORT is optional; defaults to 4000 in the app
# OPENAI_API_KEY is required for embedding generation (text-embedding-3-small)
OPENAI_API_KEY=sk-...
```

## Quickstart (Docker Compose)

From repo root:

```bash
# Start Postgres + Frontend
npm run compose:up

# Start all (includes backend once it’s ready)
npm run compose:up:all

# Follow logs
npm run compose:logs

# Stop everything
npm run compose:down
```

Services:
- Frontend: http://localhost:3000
- Backend Swagger: http://localhost:4000/docs (once backend is running)
- Postgres: localhost:5432 (database `alaphia`)

## Frontend (front/)

Local (without Docker):

```bash
cd front
npm install
npm run dev
# http://localhost:3000
```

## Backend (backend/)

Architecture:
- NestJS + TypeScript
- DDD + Hexagonal (Ports & Adapters)
- TypeORM + PostgreSQL (pgvector)
- Swagger at `/docs`

Project scripts:

```bash
cd backend
npm install

# Development
npm run dev
# http://localhost:4000/docs

# Build & run
npm run build
npm run start
```

Database configuration:
- Reads `DATABASE_URL` from the root `.env` (e.g., `postgresql://alaphia:alaphia@localhost:5432/alaphia`).
- TypeORM config: `src/shared/database/typeorm.config.ts`

Migrations:

```bash
# Generate a migration (adjust name as needed)
npm run migrate:gen

# Run migrations
npm run migrate:run

# Revert last migration
npm run migrate:revert
```

Swagger:
- Available at `http://localhost:4000/docs` when the backend is running.
- Global API prefix: `/v1` (e.g., `/v1/ingest`, `/v1/intents`, `/v1/paths`).

Endpoints (MVP scaffold):
- POST `/v1/ingest` — Accepts contact ingestion payloads (202 Accepted; async processing placeholder).
- POST `/v1/intents` — Creates a user intent (placeholder response).
- GET `/v1/paths?intent_id=<uuid>&max_depth=2|3` — Returns warm paths (placeholder response).

## Compose Services
- `db`: `pgvector/pgvector:pg16` with healthcheck and persistent volume.
- `front`: Node 20 container mounting `front/` (runs `npm ci && npm run dev`).
- `backend`: Node 20 container mounting `backend/` (profile `backend`, starts when enabled).

## Notes
- Ensure `CREATE EXTENSION IF NOT EXISTS vector;` runs (handled in the initial migration).
- Add Auth0 JWT guard before production; a placeholder guard exists at `backend/src/shared/auth/auth.guard.ts`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
