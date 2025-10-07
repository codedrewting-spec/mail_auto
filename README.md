# FocusFlow Monorepo

FocusFlow is a dual-mode productivity platform that combines work/life task management, focus timeboxing, Proof-of-Focus, non-transferable points, and SBT badges.

## Quick start

```bash
pnpm install
cp .env.example .env # adjust secrets per app
docker compose up -d db redis
pnpm -w dev
```

## Current functionality

- **Dual Work/Life spaces**: separate navigation, dashboards, and calendars for work and personal contexts with a one-click mode switch.
- **Task hierarchy**: create projects, tasks, and subtasks with due dates, estimates, priorities, tags, and space awareness; completion triggers point awards.
- **Focus sessions & timeboxing**: schedule focus blocks on the calendar, start/pause 25/50 minute timers, and log interruptions for Proof-of-Focus.
- **Proof-of-Focus ledger**: every focus session writes an event summary (task link, timing, device, interruption metadata). Daily sessions are hashed into a Merkle root stored in Postgres, ready for optional on-chain anchoring.
- **Points & streak badges**: configurable non-transferable points for completing focus sessions (+3) and tasks (+5). Consecutive seven-day streaks mint an SBT badge (on-chain when enabled, otherwise simulated locally).
- **Analytics**: personal weekly/monthly reports aggregating total focus minutes, completed tasks, consecutive day streaks, and trailing seven-day trendlines.
- **Family sharing (Life)**: shared lists plus templates for Ramadan preparation, weekend planning, and festive checklists.
- **Internationalisation**: English and Simplified Chinese strings in place with Bahasa Melayu placeholders ready through a shared i18n scaffold.
- **Privacy-first defaults**: minimal data collection, Merkle roots only for on-chain storage, no payment flows, and no transferable tokens.

## Apps
- `apps/web`: Next.js 14 App Router web experience for work/life planning, focus sessions, and analytics.
- `apps/mobile`: Flutter client delivering cross-platform access to the FocusFlow experience.

## Packages
- `packages/api`: NestJS + Prisma service exposing REST/OpenAPI endpoints, Proof-of-Focus processing, and integrations.
- `packages/ui`: Shared React component library for consistent design tokens across web/mobile (via React Native Web coming soon).
- `packages/types`: Zod/TypeScript contracts for shared validation and typing across services.
- `packages/contracts`: Solidity smart contracts and deployment scripts for the non-transferable SBT badge.

## Tooling
- **Monorepo**: pnpm + TurboRepo for task orchestration.
- **Database**: PostgreSQL via Prisma ORM (`prisma/schema.prisma`).
- **Queue/Cache**: Redis + BullMQ (service skeleton prepared).
- **Auth**: Magic link/email OTP placeholder with JWT + refresh tokens.
- **Testing**: Jest (API), Playwright (web) scaffolds.
- **CI/CD**: GitHub Actions workflow stub for lint/test/build.

### Key API endpoints
- `POST /tasks` — create work/life scoped tasks with nested subtasks and metadata.
- `PATCH /tasks/{id}/complete` — mark tasks complete, trigger the configurable point awards (+5).
- `POST /focus/sessions` — record focus sessions, compute Proof-of-Focus merkle roots, and update streaks.
- `GET /focus/summaries/{userId}` — inspect the daily merkle root snapshot for a user (optionally for a specific date).
- `GET /stats/user/{userId}/overview` — retrieve rolling week/month focus minutes, task completions, and seven-day trendlines.

## Architecture Overview
```
root
├─ apps/
│  ├─ web/           # Next.js app router web client
│  └─ mobile/        # Flutter app
├─ packages/
│  ├─ api/           # NestJS REST API + Prisma
│  ├─ ui/            # Shared design system
│  ├─ types/         # Shared zod schemas + TypeScript types
│  └─ contracts/     # Solidity contracts & scripts
├─ prisma/           # Shared Prisma schema and migrations
├─ .github/workflows # CI workflows
├─ docker-compose.yml
├─ turbo.json
├─ pnpm-workspace.yaml
└─ README.md
```

## Contributing
1. Create feature branch.
2. `pnpm install` at repo root.
3. Start dependencies: `docker compose up -d db redis`.
4. Run `pnpm -w dev` to start web + api concurrently.
5. Execute tests via `pnpm -w test` (runs API Jest suite + web Playwright smoke tests).
