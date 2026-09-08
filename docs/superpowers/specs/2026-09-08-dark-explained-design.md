# Dark — Explained: interactive explainer

Status: approved 2026-09-08. Single-page React app explaining Netflix's
*Dark* (2017–2020) — the 33-year cycle, four families, three worlds,
identity reveals, and the ending — to someone who watched it once and got
lost.

## Stack

React + Vite + TypeScript + Tailwind CSS. No backend, no DB, no external
API calls. Static build (`npm run build` → `dist/`), deployable to any
static host. No copyrighted media — typography, SVG, color only.

## Data model

All content lives in `src/data/dark.ts` as typed exported constants;
types live in `src/data/types.ts`. Components read from this data — no
content hardcoded in JSX. See the original build prompt (pasted into this
session, reproduced in full in git history of this file's first commit)
for the exact type definitions (`WorldId`, `Era`, `Character`, `Alias`,
`Relationship`, `Journey`, `DarkEvent`) and seed content (worlds, eras,
identity pairs, the closed bloodline, paradox edges, travel methods, the
ending).

**Data breadth decision:** "every remaining named character" from the
source series is 50+ people — out of scope for a first build. Ship a
curated set: ~35 characters (all four families, all three worlds, every
name required by the acceptance checklist below, plus well-known
supporting cast — Katharina, Egon, Woller, Regina, Peter, Franziska,
Magnus, Torben, Silja, Bartosz, the Doppler/Tiedemann/Nielsen/Kahnwald/
Tauber lines), ~45 events, ~15 journeys. Anything below full canon
confidence is marked `uncertain: true` rather than invented. The data
file is the extension point — adding a character later is a data-only
change (see README).

## Views

1. Cycle view (landing) — six eras, vertical spine mobile / horizontal
   desktop, 33 years apart, expandable summaries + events.
2. Journey view — searchable character picker, SVG timeline (x = year,
   y = world lane), up to 4 characters overlaid in distinct colors.
3. Family knot view — SVG graph of the four families; paradox edges in
   accent color with `↻`; "trace the loop" animates the Hannah → Silja →
   Agnes → Tronte → Ulrich → Mikkel → Jonas → Hannah cycle one edge at a
   time. Highest-priority view.
4. Identity view — character/alias reveal cards by season.
5. Worlds view — origin/Adam/Eva structure, Sic Mundus vs Erit Lux goals.
6. Causality view — walk `causedBy`/`causes` chains, including the
   bootstrap-paradox chain that returns to its start.

## Cross-cutting

- Spoiler gate (season 1/2/3/all, default 1) blurs content above level
  everywhere — cards, graph edges, search results.
- Global search (characters, aliases, years, events), `/` shortcut.
- World filter in header (origin/Adam/Eva/all), persistent.
- Deep links: view + selection reflected in `location.hash`, hand-rolled
  parser — no `react-router` dependency, the state shape is small enough
  that a library isn't worth the weight.
- Spoiler level + world filter persist via `localStorage`.

## Rendering approach

SVG graphs hand-built with plain coordinate math — no d3/visx/chart
library. Layouts are fixed-shape enough (era timeline, 3-lane swimlane,
generational family tree) that a library adds weight without buying
anything. `role="img"` + `<title>`/`<desc>` + a screen-reader text summary
per view.

## State management

React context for spoiler level + world filter, synced to `localStorage`
and `location.hash`. No Redux/Zustand — two small pieces of global state
don't need a state library.

## Theming

Dark by default + light toggle, both WCAG AA. Two typefaces max (system
stack). One neutral ramp + two accents (Adam's world, Eva's world);
origin world stays neutral. No gradients/glow/noise. Motion limited to
loop-trace animation + view transitions, gated on
`prefers-reduced-motion`.

## Testing

No backend/DB, so no integration-test ceremony. Non-trivial logic (hash
router parse/serialize, spoiler-level filter, causality chain walker
including cycle termination, family-loop trace ordering) gets a minimal
vitest smoke test — assertions, no framework ceremony beyond vitest
itself. Type-check (`tsc -b`) and `npm run build` must be clean. Manual
verification: run the dev server, click through all 6 views + the
acceptance checklist at 360px and 1440px viewport widths.

## Repo

`/home/ubuntu/projects/dark-explained`, scaffolded via
`npm create vite@latest . -- --template react-ts`, Tailwind added on top.
Pushed to `github.com/kushgarg132/dark-explained` (public) once the first
build is green.
