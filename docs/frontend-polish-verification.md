# Frontend refinement — 21 October 2026

Release update: after approving this pass and “Restaurantes Locales” wording, the user authorized committing and pushing to main. A fail-closed catalog compatibility reader now supports the hosted schema before its additive migration. Its four new tests failed before the fix and passed afterward; independent scoped review found no material issues. Fresh production build/TypeScript and all 34 tests passed against the local application configured with the hosted beta Supabase, plus five isolated SQL suites. Hosted migration remains unapplied and ordering remains closed. The earlier pause described below is historical.

Approved scope: preserve the existing Fudi artwork and cream/petrol/orange identity while improving menu, cart, customer tracking and the operator experience. The user paused publication for review, then approved it. Functional commit ed3999f is now published; all 34 automated tests passed against the public site after deployment. No hosted database migration was applied.

## Applied guidance

Installed official Impeccable and Emil Kowalski design, animate, mobile-native and review-animations skills. Impeccable context permitted a refinement using the incumbent implementation. No project hooks or animation dependencies were added. DESIGN.md records the approved system and interaction decisions.

Menu and cart use clearer spacing/type, phone product rows, a bottom cart control, native dialog motion and an honest closed-beta state. Closed checkout does not solicit unusable contact details. Customer tracking precedes account settings, with semantic pickup steps, readable amount breakdown and action errors at the relevant task. Operator monitoring is compact, with explicit states and optional details.

## Verified

- Production build and TypeScript passed with existing dependencies.
- All 30 discovered tests passed against the local read-only transport fixture; all five isolated SQL suites passed.
- Impeccable mechanical scan returned no findings on the changed menu/account/layout markup. The operator implementer separately reported a clean scan on operator markup.
- Independent source review caught an action error appearing after all orders on mobile. It now appears before CustomerOrders; scoped re-review found no remaining material source issues.
- Actual rendered CSS inspection caught a BOM prefix becoming part of the first CSS selector. Files were normalized; the browser confirmed working flex tabs.
- Browser checks on the production build at 390px, 820px and wide viewport: menu and customer tracking stayed within page width. Food image loading was checked after decode, not inferred from an initial loading screenshot.
- Native dialogs: pointer path uses motion; keyboard opening is immediate; Escape closes and returns focus to the cart control. Enabled synthetic checkout still exposes pickup and 16px phone inputs. No purchase was submitted.
- Synthetic cart: selected BBQ, added a product, saw $189 + $10 = $199, opened/closed cart, removed the product, verified the empty state and returned to browsing. Closed beta displayed no contact fields.
- Synthetic customer states: long restaurant/address/option text wrapped; cancelled orders omitted progression; empty view offered browsing; failed reads displayed a recovery message. A cancellation action error was confirmed inside the tracking article.
- Phone and wide operator layouts were inspected, including status, controls, tabs and navigation.

## Limits and continuation

Browser viewport tests do not establish physical iPhone/Android safe-area, keyboard or touch behavior. Reduced-motion fallback is implemented in CSS; no physical-device motion claim is made. Hosted authentication, database rules and real incoming-order sound remain distinct checks. Fixture sessions are synthetic and accepted only by the loopback fixture service.

For visual preview, run the fixture with FUDI_VISUAL_FIXTURE=1. Optional local fixture session scenarios are empty, cancelled, ready, long, error and checkout. These affect synthetic responses only. Never deploy a build whose Supabase URL is localhost:54329.

Hosted method columns were absent before publication. The approved compatibility reader keeps browsing safe and reception closed. The UI review and push are complete; applying the hosted migration remains a separate pending action.
