# fudiBOX pickup readiness — proposed design

Date: 2026-10-21

Active implementation: C:/Users/hp/Desktop/FUDIGPT/fudiBOX.
This file is a review artifact in the historical support workspace, not a second application.

## Purpose and sequence

Make one restaurant's pickup operation dependable before public ordering. Preserve the approved home design. Implement functionality first; apply the frontend design skill after the operational changes are verified.

The accepted review identified seven work areas. Deliver them as three milestones:

1. Pickup availability, customer tracking, operator monitoring, test entry points, and current documentation.
2. Pickup exceptions and weekly restaurant reconciliation.
3. Frontend design across the resulting customer and operator flows.

Delivery quotations, drivers, delivery codes, expiry jobs, and push notifications are separate future work. General reception remains closed throughout development. No production orders or pilot grants are created as test fixtures.

## Milestone 1: dependable pickup visibility

### Availability

Retain accepting_orders as the overall restaurant switch. Add independent server-owned pickup_enabled and delivery_enabled flags, initially pickup enabled and delivery disabled. The overall switch remains false for existing businesses. These flags never open reception by themselves.

An ordinary order requires an approved restaurant, accepting_orders, and its requested method enabled. The existing account-specific pilot remains a one-use, time-limited exception to the overall closed switch for pickup; it must also respect pickup_enabled. Delivery requires delivery_enabled in addition to its existing checks. The browser only offers permitted methods; RPC validation remains authoritative for direct API calls.

When enabling these flags in a migration, replace the existing order RPC without changing its transaction, price, reservation, request-key, or pilot-consumption guarantees. Preserve function grants. Do not apply any migration automatically to production.

### Customer order view

Show the restaurant name, readable order reference, placement time in America/Mexico_City, products and options, product subtotal, service fee, total, recorded pickup address, and current status. Show the preparation estimate as the restaurant's estimate, not a promised collection deadline.

Refresh the order view every 20 seconds while visible, with an explicit refresh button, last successful refresh time, and connection/failure feedback. Pause refresh when a customer is interacting with a cancellation form. Do not claim that a failed refresh is current information. No background purchase retries or private-page caching.

Provide a help action that clearly tells the customer how to contact fudiBOX. Use a verified support contact if one is already configured; otherwise show an honest unavailable-contact message rather than inventing a number or showing an unusable button. Support contact configuration must be resolved before public opening.

Add Mi panel to the account page only after a successful operator_access check. A failed permission check must hide the link without exposing operator data.

### Operator monitoring

Keep visible-page polling and opt-in sound. Display an explicit paused state after form editing, with a Resume monitoring action. Show successful refresh time and refresh failures. New-order sounds remain tied to newly observed requested order IDs; an ordinary refresh or status change must not repeat the alert for an already-seen order.

Do not promise alerts with the panel hidden, the phone locked, or the app closed. A controlled incoming-order test on real devices remains a release check requiring the participating user and restaurant.

### Documentation and checks

Make run-fudibox.ps1 test run the complete automated suite, matching the package test command. Separate local tests from tests that need a running HTTP server in the documentation. SQL transaction tests remain a separate explicit operation against an isolated test database.

Update README, HOW-TO-GUIDE, the database README, architecture status notes, and handoff so they agree about the domain, completed pickup capabilities, manual WhatsApp, monitoring limits, and remaining release checks. Archive historical decisions with dates rather than representing them as current instructions. Replace outdated account copy that conflicts with the approved clear Mexican Spanish.

Acceptance: TypeScript and build pass; local tests pass; HTTP access tests pass against the candidate application; disabled delivery is rejected at the database boundary; pilot and ordinary pickup retain existing protections. Browser checks cover customer tracking, monitoring pause/resume, and operator-only navigation. A database test environment is required to claim migration behavior verified.

## Milestone 2: exceptions and reconciliation

### Exceptions

Do not loosen the existing customer cancellation rule. Add an administrator-only exception action for preparing or ready pickups, requiring a reason and a declared outcome. Store actor, timestamp, reason, prior state, and outcome atomically with the state transition.

Record a failed pickup separately from successful delivery. Prepared food is not automatically returned to saleable stock. Unused reserved items may be released only through an explicit operator decision with an audit trail. A failed pickup creates no normal completion fee. Retrying the same action cannot release stock or change charges twice.

For already completed pickups, preserve the original completion event and charge. A deliberate correction records a linked incident and, when justified, one reversal rather than deleting or rewriting financial history. No automatic customer penalty or restaurant payment is inferred.

Before implementation, confirm the exact business treatment for no-shows and post-completion corrections with Miguel. The historical plan leaves incident charges undecided; software must not invent that policy.

### Reconciliation

Add an operator balance view by restaurant showing completion fees, recorded reversals, recorded payments, and outstanding balance. Show a weekly movement view using America/Mexico_City with explicit date bounds, and distinguish period movements from the all-time outstanding balance.

Record restaurant payments through a server-authorized transaction with amount, paid-at date, reference, and actor. Preserve the existing uniqueness constraint on restaurant/reference and reject mismatched retries. A payment is an operator record of a real payment, not an online payment integration. Do not mark an order as paid or a restaurant as settled solely because it was delivered.

Acceptance: database tests cover unauthorized actions, invalid transitions, repeated requests, inventory decisions, single reversal, payment duplicate prevention, and computed balances. Browser checks cover the operator workflows without fabricating real financial records.

## Milestone 3: frontend design

Use the installed frontend-design skill, or inspect the requested alternative plugin when this milestone begins. Start from the approved Fudi motorcycle, cream food pattern, typography/colors already in use, and clear Mexican Spanish. Apply design to the actual finalized flows, with mobile-first customer ordering and an operator view that makes new orders and paused monitoring unmistakable.

Create a reviewable design before broad visual changes. Verify narrow and wide screens, keyboard use, dialogs, forms, loading/error states, and legible status/amount displays. Do not replace the approved home artwork without a specific design decision from Miguel.

## Implementation and release boundaries

Use the active repository and a codex/ branch. Do not implement in the historical Documents prototype. Prepare database migrations and rollback/recovery notes for review; production changes are a distinct step after checks. Never repeat previously applied migrations.

An authenticated full pickup test, physical Android/iPhone installation, actual incoming-order sound, and financial reconciliation are not established by a build or anonymous HTTP tests. Report each separately with its evidence and any remaining requirement.

## Review decisions

The first milestone is ready for implementation review. The second milestone requires Miguel's incident-policy decision before its financial and inventory behavior is finalized. The third follows functional verification, as requested.
