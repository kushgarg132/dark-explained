# Dark — Explained

An interactive, spoiler-gated explainer for Netflix's *Dark* (2017–2020): the
33-year cycle, the four families' tangled bloodline, the three worlds, every
identity reveal, and the ending. No backend, no external calls, no
copyrighted media — everything is typography, SVG, and color.

## Run it

```bash
npm install
npm run dev      # dev server
npm run build    # type-checks (tsc -b) then builds dist/
npm run preview  # serve the production build locally
npx vitest run    # smoke tests for the non-trivial logic
```

## Data model

All content lives in `src/data/dark.ts` as typed constants; the types live
in `src/data/types.ts`. Components only ever read from this data — nothing
is hardcoded in JSX.

- `WORLDS` — the three worlds (origin, Adam's, Eva's).
- `ERAS` — the six 33-year-cycle eras plus a few off-cycle years.
- `CHARACTERS` — one entry per *person*. Someone known by more than one name
  at different ages (Jonas/the Stranger/Adam, Martha/Eva, Claudia/the White
  Devil, Hanno/Noah, Helge at three ages) is a **single** character record
  with multiple `aliases`. The one exception is Mikkel Nielsen / Michael
  Kahnwald, which is **two** separate character records linked by a
  `same-person` relationship — because his family and the visual position he
  needs in the family-knot graph genuinely change (Nielsen child →
  Kahnwald adult), a single record can't hold both positions in that graph.
- `RELATIONSHIPS` — edges between character ids. `isParadox: true` marks an
  edge that closes a time loop (a person who is, impossibly, their own
  ancestor or descendant) — the family-knot view styles these in accent
  color with a `↻` marker.
- `JOURNEYS` — per-character lists of time-travel legs, each with a method,
  a year/world on both ends, a reason, and the season it's revealed in.
- `EVENTS` — plot events with `causedBy`/`causes` edges. A handful
  (`ev-loop-adam-*`) form a closed 3-event cycle on purpose, so the
  causality view has a real bootstrap paradox to walk through.
- `LOOP_TRACE` — the exact 8-step Hannah → Silja → Agnes → Tronte → Ulrich →
  Mikkel → Michael → Jonas → Hannah path used by the family-knot view's
  "trace the loop" animation. It's listed explicitly rather than derived,
  since it's the one thing in the app that has to be exactly right.

Anything not confidently canon is marked `uncertain: true` on the record
rather than invented outright.

### Adding a character

1. Add a `Character` to `CHARACTERS` in `src/data/dark.ts`.
2. Add a fixed `{ x, y }` for them in `FAMILY_LAYOUT`
   (`src/lib/familyLayout.ts`) if they should appear in the family-knot
   graph — positions are hand-placed, not force-directed, so a mutual-parent
   pair (like Charlotte/Elisabeth) can never break the layout.
3. Add `Relationship` edges connecting them to existing characters.
4. Optionally add a `Journey` if they time-travel, and any `DarkEvent`s they
   cause or are caused by.
5. Run `npx vitest run` — `src/data/dark.test.ts` checks that every id you
   referenced actually resolves, and that the loop trace still forms a
   single closed cycle.

## Spoiler gating

Every character, alias, relationship, event, and journey leg carries a
`spoilerLevel` (1–3). The header's season selector (default: 1) filters all
of it through `src/lib/filter.ts`'s `levelVisible`. Content above the
selected level renders behind `<SpoilerGate>` (`src/components/
SpoilerGate.tsx`) — blurred, with a "reveals a season N twist — tap to
show" overlay — rather than being hidden outright, so a search hit still
resolves to something on the page. At spoiler level 1 the header's world
filter also hides the "Adam" and "Eva" options entirely, since naming them
is itself the season 2 twist.

## Routing and persistence

`src/lib/route.ts` parses/serializes the URL hash (`#/<view>/<selection…
>?level=<1|2|3|all>&world=<origin|adam|eva|all>`) — no router dependency,
the state shape is small enough that hand-rolling it is simpler than
pulling one in. `src/state/AppState.tsx` is the single context provider:
it owns the current route, keeps it in sync with `location.hash` and
`localStorage`, and exposes `navigate`/`setLevel`/`setWorld`/`toggleTheme`.

## Views

- **Cycle** (`CycleView`) — the six eras as a spine (vertical on mobile,
  horizontal on desktop), expandable to their key events.
- **Journey** (`JourneyView`) — up to four characters overlaid on an SVG
  timeline (years × world lanes), with a plain-text leg list underneath for
  anything the diagram can't label at 360px.
- **Family Knot** (`FamilyKnotView`) — the hand-laid-out family graph and
  the "trace the loop" step-through. Read this file first if you're
  changing anything paradox-related.
- **Identity** (`IdentityView`) — one card per character with aliases.
- **Worlds** (`WorldsView`) — the origin/Adam/Eva split and the ending.
- **Causality** (`CausalityView`) — click through `causedBy`/`causes`
  edges; "walk the forward chain" uses `src/lib/causality.ts`'s
  `walkForward`, which stops the moment it revisits an id it's already
  seen — that's the bootstrap paradox made clickable.
