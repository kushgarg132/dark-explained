import { useMemo, useState } from 'react'
import { CHARACTERS, JOURNEYS } from '../../data/dark'
import { useAppState } from '../../state/AppState'
import { levelVisible, worldVisible } from '../../lib/filter'
import type { WorldId } from '../../data/types'

const LANES: { id: WorldId; label: string; y: number }[] = [
  { id: 'eva', label: "Eva's world", y: 60 },
  { id: 'origin', label: 'Origin world', y: 160 },
  { id: 'adam', label: "Jonas's (Adam's) world", y: 260 },
]

const COLORS = ['#f2c14e', '#6bcb77', '#e07a5f', '#9b8afb']
const MIN_YEAR = 1880
const MAX_YEAR = 2060
const MARGIN_X = 60
const CHART_WIDTH = 900

function yearToX(year: number): number {
  return MARGIN_X + ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * (CHART_WIDTH - MARGIN_X * 2)
}

function laneY(world: WorldId): number {
  return LANES.find((l) => l.id === world)?.y ?? 160
}

const MAX_SELECTED = 4

export function JourneyView() {
  const { route, navigate } = useAppState()
  const [query, setQuery] = useState('')
  const selected = route.selection

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CHARACTERS.filter((c) => levelVisible(c.spoilerLevel, route.level) && worldVisible(c.world, route.world))
      .filter((c) => !q || c.displayName.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, route.level, route.world])

  function toggle(id: string) {
    if (selected.includes(id)) {
      navigate('journey', selected.filter((s) => s !== id))
    } else if (selected.length < MAX_SELECTED) {
      navigate('journey', [...selected, id])
    }
  }

  const selectedJourneys = selected
    .map((id) => ({ character: CHARACTERS.find((c) => c.id === id), journey: JOURNEYS.find((j) => j.characterId === id) }))
    .filter((x): x is { character: NonNullable<typeof x.character>; journey: NonNullable<typeof x.journey> } => !!x.character && !!x.journey)

  return (
    <section aria-labelledby="journey-heading" className="mx-auto max-w-6xl px-4 py-6">
      <h2 id="journey-heading" className="text-xl font-semibold">
        Journey view
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-dim">
        Pick up to four characters to see their path across years and worlds. Each leg names how they traveled and why.
      </p>

      <div className="mt-4">
        <label htmlFor="journey-search" className="sr-only">
          Search characters
        </label>
        <input
          id="journey-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a character…"
          className="w-full max-w-sm rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-focus"
        />
        <ul className="mt-2 flex flex-wrap gap-2">
          {candidates.map((c) => {
            const isSelected = selected.includes(c.id)
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-pressed={isSelected}
                  disabled={!isSelected && selected.length >= MAX_SELECTED}
                  className={`rounded-full border px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected ? 'border-adam bg-adam/20 text-text' : 'border-border bg-surface text-text-dim hover:text-text'
                  }`}
                >
                  {c.displayName}
                </button>
              </li>
            )
          })}
        </ul>
        {selected.length >= MAX_SELECTED && <p className="mt-1 text-xs text-text-faint">Four selected — remove one to add another.</p>}
      </div>

      {selectedJourneys.length === 0 ? (
        <p className="mt-8 text-sm text-text-faint">No character selected yet. Try “Jonas”.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface p-3">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} 320`}
            role="img"
            className="w-full min-w-[640px]"
            aria-labelledby="journey-svg-title journey-svg-desc"
          >
            <title id="journey-svg-title">Character journeys across time and worlds</title>
            <desc id="journey-svg-desc">
              A timeline chart. The horizontal axis is years from 1880 to 2060. The vertical axis has three lanes, one
              per world. Lines trace each selected character moving between years and worlds.
            </desc>
            {LANES.map((lane) => (
              <g key={lane.id}>
                <line x1={MARGIN_X} x2={CHART_WIDTH - MARGIN_X} y1={lane.y} y2={lane.y} stroke="var(--color-border)" strokeWidth={1} />
                <text x={4} y={lane.y + 4} fontSize={12} fill="var(--color-text-dim)">
                  {lane.label}
                </text>
              </g>
            ))}
            {[1888, 1921, 1954, 1987, 2020, 2053].map((year) => (
              <g key={year}>
                <line x1={yearToX(year)} x2={yearToX(year)} y1={40} y2={280} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="2 4" />
                <text x={yearToX(year)} y={296} fontSize={12} textAnchor="middle" fill="var(--color-text-faint)">
                  {year}
                </text>
              </g>
            ))}
            {selectedJourneys.map(({ journey }, idx) => {
              const color = COLORS[idx % COLORS.length]
              const legs = journey.legs.filter((leg) => levelVisible(leg.season, route.level))
              return (
                <g key={journey.characterId}>
                  {legs.map((leg, i) => (
                    <line
                      key={i}
                      x1={yearToX(leg.fromYear)}
                      y1={laneY(leg.fromWorld)}
                      x2={yearToX(leg.toYear)}
                      y2={laneY(leg.toWorld)}
                      stroke={color}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                  ))}
                  {legs.map((leg, i) => (
                    <circle key={`p${i}`} cx={yearToX(leg.toYear)} cy={laneY(leg.toWorld)} r={5} fill={color} />
                  ))}
                </g>
              )
            })}
          </svg>

          <ul className="mt-4 flex flex-col gap-3">
            {selectedJourneys.map(({ character, journey }, idx) => {
              const legs = journey.legs.filter((leg) => levelVisible(leg.season, route.level))
              return (
                <li key={character.id}>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                    {character.displayName}
                  </p>
                  <ol className="mt-1 flex flex-col gap-1 pl-5 text-xs text-text-dim">
                    {legs.map((leg, i) => (
                      <li key={i} className="list-decimal">
                        {leg.fromYear} ({leg.fromWorld}) → {leg.toYear} ({leg.toWorld}) via <strong className="text-text">{leg.method}</strong> — {leg.reason}
                      </li>
                    ))}
                    {legs.length === 0 && <li className="list-none text-text-faint">No legs visible at the current spoiler level.</li>}
                  </ol>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
