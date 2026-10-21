# Pickup readiness implementation plan

> **For agentic workers:** Use superpowers:subagent-driven-development or executing-plans. Track completed checks below.

**Goal:** Complete milestone 1 of the approved pickup readiness design.

**Architecture:** Keep Next.js and Supabase RPC authorization. Add method flags at the database boundary, use authenticated read-only polling for freshness, and preserve price/reservation/idempotency guarantees.

**Tech Stack:** Existing Next.js, React, TypeScript, Supabase, Node test runner. No dependency upgrades.

**Spec:** C:/Users/hp/Documents/ChatGPT/fudiBOX/docs/superpowers/specs/2026-10-21-pickup-readiness-design.md

## Global constraints

- General reception remains closed. No production orders or pilot grants.
- America/Mexico_City for displayed dates.
- Preserve approved home artwork and existing transaction protections.
- Production migrations and public launch are distinct release steps.
- Milestone 2 incident-policy decisions and milestone 3 visual redesign are outside this implementation.

## Task 1: method controls

Files: new supabase/migrations/202610210001_order_methods.sql, tests/order-methods.sql; src/lib/catalog.ts, src/app/chicanito/catalog.tsx, src/app/chicanito/page.tsx, src/app/restaurantes/[slug]/page.tsx.

Interface: Business gains pickup_enabled:boolean and delivery_enabled:boolean. RPC signature remains create_customer_order(uuid,jsonb); flags default true/false respectively. Existing pilot only overrides the overall reception switch, never pickup_enabled.

- [x] Add rollback SQL tests: disabled delivery denied even with coordinator; disabled pickup/pilot denied; ordinary pickup and pilot retries remain successful; flags cannot be set by customer roles.
- [x] Verify failure against old schema if an isolated PostgreSQL runtime is available; otherwise explicitly record database validation as pending.
- [x] Add flags, replace RPC and my_pickup_pilot checks, preserve grants and existing locking. Filter checkout methods using server-returned flags; do not default missing flags to enabled.
- [x] Run TypeScript/build and inspect migration diff for only the added method gates. Document application/rollback sequencing.

## Task 2: customer tracking

Files: src/app/cuenta/page.tsx, new read-only status route and refresh client, tracking tests.

Interface: authenticated no-store refresh response uses server timestamps and returns no foreign orders. Page shows restaurant, short reference, date, address, estimate, totals, and operator-only navigation. Support uses a verified configured contact or clear unavailable message.

- [x] Add behavior tests for unauthorized status requests and real refresh state transitions, including failure and pause.
- [x] Build tracking with visible-only 20-second polling, manual refresh and successful-check/failure feedback. Preserve cancellation forms and avoid overwriting user interaction.
- [x] Verify local tests, TypeScript, anonymous access checks; document authenticated/device checks requiring real participation.

## Task 3: operator monitoring

Files: src/app/admin/order-watch.tsx and minimal read-only status integration/shared polling utility as appropriate.

Interface: existing OrderWatch ids prop remains. Editing pauses automatic monitoring with explicit resume. Freshness records only successful read completion; failed refresh stays visibly stale. Existing observed IDs never beep again.

- [x] Test new ID detection, failed reads, visibility and form pause/resume behavior through actual production controller logic.
- [x] Implement explicit status feedback and safe manual resume, retaining opt-in audio.
- [x] Run tests, TypeScript and component review.

## Task 4: test entry points and documentation

Files: run-fudibox.ps1, package.json if needed, README.md, docs/HOW-TO-GUIDE.md, docs/arquitectura.md, supabase/README.md, CONTINUIDAD/HANDOFF_ACTUAL.md.

- [x] Run complete test entry point against a running candidate server; all .test.mjs suites must be discovered.
- [x] Separate local unit, HTTP and SQL instructions. Correct outdated domain/monitoring/RPC statements with dated historical context.
- [x] Record migration pending/applied status accurately, open release gates and verification results.
- [x] Review diff, run TypeScript/build/local+HTTP tests, obtain independent code review, fix material findings, and leave a reviewable branch without publishing.

## Progress and decisions

- Approved milestone 1; implementing in linked active-repository checkout on codex/pickup-readiness-20261021.
- Baseline: TypeScript and three local message/offline tests passed during initial review. No active-project changes preceded this branch.
- No local PostgreSQL or Docker command found; SQL execution availability remains under investigation. Never use production as the substitute test database.

- Final evidence: docs/pickup-readiness-verification.md. Five SQL suites run in isolated PGlite; hosted/multi-session/device checks remain explicit release gates. Independent source review and scoped re-review passed. No publishing.
