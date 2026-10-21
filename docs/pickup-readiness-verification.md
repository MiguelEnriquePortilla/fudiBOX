# Verification — 21 October 2026

Candidate branch: codex/pickup-readiness-20261021, based on 907a713.

## Established locally

- Production build passed with the existing application dependencies; TypeScript passed separately.
- Complete Windows test launcher discovered and passed 30 tests, with no skipped tests, against the candidate at localhost:3011 and the explicit read-only local Supabase transport fixture.
- Five SQL suites passed in isolated PostgreSQL/WASM (PGlite 0.5.11): order-transactions, pickup-ready, complete-pickup, pickup-pilot and order-methods. The pre-change schema passed the four historical suites but failed the new method suite because the method flags were absent. After the migration all five passed.
- Method behavior tests failed before implementation and passed after implementing the gates.
- Independent source review caught a stale customer read overwriting cancellation state after resume. Generation-based invalidation fixed it; seven customer tests now cover cancellation, superseded requests and hidden completion. Re-review found no remaining material issues.
- Browser transport-fixture checks: customer view showed restaurant/reference/date/address/estimate/$85 products + $10 fee = $95 total; customer had no Mi panel and was denied /admin; operator saw Mi panel and reached the panel. Cancellation focus visibly paused customer updates; resume restored updates. Editing operator minutes paused monitoring visibly; resume succeeded. Stopping the local fixture showed a failed/stale warning without advancing successful-read time; restarting it restored monitoring. Operator layout was inspected at 390px width and normal viewport. No browser console errors were observed during the checked flow.

## Reproduce fixture checks

The fixture binds only 127.0.0.1:54329 and has no real-service connection. It uses synthetic sessions solely to exercise application rendering and transport branches. It is not an authentication service or a substitute for Supabase RLS verification.

1. Run Node `tests/fixtures/read-only-backend.mjs`.
2. For build and start, set `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54329` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_fixture_only`. Build then start on port 3011. These Next.js public values are included at build time; do not publish this fixture build.
3. Set `TEST_BASE_URL=http://localhost:3011` and run `run-fudibox.ps1 test`. On this machine script execution required a process-scoped invocation: `powershell -NoProfile -ExecutionPolicy Bypass -File ./run-fudibox.ps1 test`; no persistent execution-policy setting was changed.
4. Browser-only synthetic sessions: navigate to `http://localhost:54329/fixture/session?role=customer` or `?role=operator`, which sets a local fixture cookie and redirects to the candidate account page. Do not use real credentials. Do not send orders; the fixture rejects business writes.
5. SQL runner: set PGLITE_MODULE to a local PGlite 0.5.11 `dist/index.js` and run Node `tests/run-sql.mjs`. Its database is in-memory and independent of all `.env` configuration.

## Not established by these checks

Hosted Supabase migration/authentication configuration, genuine multi-session stock concurrency, a real incoming purchase/audio notification, physical Android/iPhone installation, real restaurant settlement, and a configured support contact. No migration, pilot grant, real order, financial entry, push or deployment was performed in production.

## Environment notes

The initial local build failed because Turbopack rejects a dependency junction outside its filesystem root. Replacing the junction with a local dependency copy resolved it; no application workaround or dependency upgrade was needed. Node reports the pre-existing MODULE_TYPELESS_PACKAGE_JSON warning for direct TypeScript imports in tests; all test assertions still pass. Module packaging was kept unchanged to avoid an unrelated configuration change.
