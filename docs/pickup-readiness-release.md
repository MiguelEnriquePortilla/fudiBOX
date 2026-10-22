# Pickup readiness release checklist — 21 October 2026

Published on the single main branch on 21 October 2026: functional commit ed3999f. Vercel reported success and the public site showed the approved branding. All 34 automated tests passed against https://fudibox.app after deployment. BETA: no restaurants operating; general reception stays closed. The hosted migration below remains unapplied.

## Compatibility before migration

The beta catalog reader retries the legacy projection only when a method column is missing (42703). It returns both methods and reception disabled, preserving browsing without enabling checkout. Other database errors remain errors. Both catalog routes use this reader and suppress pilot access when pickup is disabled. Four regression tests cover this compatibility path. Therefore this UI may be deployed before the additive migration while reception remains closed.

The migration is still required before enabling and claiming the new database method guards. Compatibility in the reader does not replace that server-side migration or modify the hosted schema.

## Database migration before enabling orders

1. Validate `202610210001_order_methods.sql` in an isolated database first. The migration adds `pickup_enabled=true`, `delivery_enabled=false`, preserves the overall reception switch, and enforces method gates in the order RPC and pilot visibility RPC.
2. Back up the target schema/function definitions and record current restaurant reception values.
3. Apply only this new migration through the normal authorized database release process. Do not repeat historical migrations.
4. Confirm the new flags, unchanged `accepting_orders`, and the restricted RPC grants before enabling ordering. The current beta application safely supports either schema.
5. Keep general reception closed. No test permission or order is created by this migration.

Rollback: first restore the previous application deployment, leaving the additive columns and stricter database checks in place. Do not drop the columns while this candidate is running. If a database rollback is necessary, restore both prior RPC definitions from `202610060001_pickup_pilot.sql` under a separate reviewed transaction while keeping reception closed; only then consider removing the columns. Do not replay that entire migration, which also creates existing tables.

## Automated checks

- `./run-fudibox.ps1 build` and `./run-fudibox.ps1 typecheck`.
- With the candidate server running: set `TEST_BASE_URL=http://localhost:3000`, then `./run-fudibox.ps1 test`. This discovers every `tests/*.test.mjs` file, including HTTP, monitoring, tracking, message, method and PWA checks.
- Local behavior tests without a server: run Node `--test tests/order-methods.test.mjs tests/customer-tracking.test.mjs tests/order-monitor.test.mjs tests/order-message.test.mjs`. The worker test is in `pwa.test.mjs`; use `--test-name-pattern=worker` to run it without HTTP.
- SQL is separate: `tests/run-sql.mjs` starts an in-memory PostgreSQL/WASM instance, bootstraps isolated auth roles/users, applies the migrations and runs five rollback suites. It never reads `.env` or connects to Supabase. Install `@electric-sql/pglite` as an external test tool, or set `PGLITE_MODULE` to its local `dist/index.js`, then run Node `tests/run-sql.mjs`. PostgreSQL/WASM does not establish multi-session concurrency or hosted Supabase configuration.
- `tests/order-methods.sql` also runs against an isolated full PostgreSQL test database with the authorized fixture user. Never use a production order as a fixture.

## Checks requiring real participation

- Customer and operator authenticated views, account isolation, correct Mi panel visibility, cancellation and pause/resume.
- A controlled real incoming pickup: visible panel update, enabled sound, manual WhatsApp draft, preparation, ready, closure, exactly one fee and correct reservation outcome.
- Physical Android and iPhone installation, foreground/background behavior and connection loss. No closed-app notification promise.
- Configure a verified support contact before public opening. The candidate honestly shows contact unavailable until then.

## Still separate

Failed-pickup policies, post-completion corrections, weekly restaurant balances/payment recording, delivery workflow, remain later milestones; the approved frontend refinement is already published. Do not describe the candidate as generally open or financially reconciled.
