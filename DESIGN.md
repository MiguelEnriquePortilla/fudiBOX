# fudiBOX interface direction

Approved refinement, 21 October 2026. The product is in beta; the user states there are no live restaurants. Existing catalogue content supports development and demonstrations, not a claim that orders are open.

## Identity

Preserve the approved Fudi motorcycle illustration, cream Mexican food pattern, and home composition. Use the existing Manrope headings and DM Sans body text. Primary petrol `#063849`, cream `#fff8ed`, orange `#f36b21`, supporting ink `#425f66`, warm surface `#fffdf8`, and line `#dbe3df`. Never invent availability, restaurant counts, delivery times, or endorsements.

## Task hierarchy

The menu emphasizes food, product names, choices and prices. On phones use readable horizontal product rows and an accessible bottom cart control. Keep categories horizontally scrollable without page overflow. Reserve space below the menu for the fixed cart and device safe area.

The cart shows products, options, the single service fee and the total before any contact fields. When ordering is unavailable, explain beta status and provide a return to browsing rather than asking for personal details the user cannot submit.

Customer accounts lead with tracking, not account settings. Keep a semantic pickup progression, recorded address, honest preparation estimate, products and totals. Cancelled/expired orders have no misleading completion progression. Place action errors alongside the relevant tracking UI.

The operator panel prioritizes status, new-order counts and actions. Keep monitoring information compact with optional detail; paused/error states and the last successful read must remain explicit. No purely decorative dashboard animations.

## Interaction and motion

Use native dialogs for focus containment and Escape behavior. Pointer-triggered cart/product dialogs may use transform/opacity transitions lasting 240ms; drawer curve `cubic-bezier(0.32, 0.72, 0, 1)` and ease-out `cubic-bezier(0.23, 1, 0.32, 1)`. Keyboard activation and Escape remain immediate. Reduced motion removes movement. Browsers without discrete dialog transitions fall back to native immediate opening/closing.

Pointer presses may receive immediate subtle scale feedback with a 120ms release. Do not animate lists, totals or progress on the 20-second data polling cycle. Preserve visible keyboard focus, at least 44px primary touch targets, 16px mobile form inputs, zoom and safe-area padding. No new animation dependency is required.

## Verification boundaries

Inspect phone, intermediate and wide layouts, native dialog keyboard behavior, long content, empty/cancelled/error states and failure recovery. Local synthetic sessions verify application rendering only. Physical phone behavior and hosted authentication/database rules require their own evidence. The user approved this pass, requested “Restaurantes Locales” branding, and authorized committing and pushing to main.
