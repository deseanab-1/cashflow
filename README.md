# Cashflow

A budgeting-focused personal finance app (manual transactions + monthly category budgets).

## Stack
- Web: React + TypeScript + Vite
- API: Node.js + TypeScript + Express
- DB: MongoDB (Docker) + Prisma
- Auth: email/password + JWT access token + refresh token cookie

## Local dev
1) Start MongoDB:
```bash
npm run db:up
```

2) Install deps (workspace):
```bash
npm install
```

3) Set up API env:
```bash
cp apps/api/.env.example apps/api/.env
```

4) Sync Prisma schema to MongoDB:
```bash
npm run db:push
npm run db:seed
```

5) Run everything:
```bash
npm run dev
```

## What’s included (scaffold)
- Web app with Tailwind wired (`apps/web`)
- API skeleton with Express + routing (`apps/api`)
- Prisma schema for the core finance models (no full feature implementation yet)
- Shared Zod schemas/types package (`packages/shared`)

