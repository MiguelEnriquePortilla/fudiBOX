# Pickup readiness release checklist — 21 October 2026

Branch: codex/pickup-readiness-20261021. This candidate is not published.

## Database before application

1. Validate `202610210001_order_methods.sql` in an isolated database first. The migration adds `pickup_enabled=true`, `delivery_enabled=false`, preserves the overall reception switch, and enforces method gates in the order RPC and pilot visibility RPC.
2. Back up the target schema/function definitions and record current restaurant reception values.
3. Apply only this new migration through the normal authorized database release process. Do not repeat historical migrations.
4. Confirm the new flags, unchanged `accepting_orders`, and the restricted RPC grants before publishing the application that selects these columns.
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

Failed-pickup policies, post-completion corrections, weekly restaurant balances/payment recording, delivery workflow, and frontend redesign remain later milestones. Do not describe the candidate as generally open or financially reconciled.
