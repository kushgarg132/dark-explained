import { ERAS, EVENTS } from '../../data/dark'
import { useAppState } from '../../state/AppState'
import { worldVisible } from '../../lib/filter'
import { SpoilerGate } from '../SpoilerGate'

const OFF_CYCLE_SPOILER_LEVEL: Record<number, 1 | 2 | 3> = {
  1890: 2,
  1911: 2,
  1971: 3,
  2040: 2,
}

export function CycleView() {
  const { route, navigate } = useAppState()
  const onCycle = ERAS.filter((e) => e.onCycle)
  const offCycle = ERAS.filter((e) => !e.onCycle && worldVisible(e.worlds[0], route.world))
  const expandedYear = route.selection[0] ? Number(route.selection[0]) : null

  return (
    <section aria-labelledby="cycle-heading" className="mx-auto max-w-6xl px-4 py-6">
      <h2 id="cycle-heading" className="text-xl font-semibold">
        The 33-year cycle
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-dim">
        Six eras, each roughly 33 years apart. Winden lives through the same handful of years, over and over, with the
        same people caught in them. Tap an era to expand it.
      </p>
      <p className="sr-only">
        A screen-reader summary: this view lists six points in time, evenly spaced 33 years apart, from 1888 through
        2052, each expandable to show a short summary and its key events.
      </p>

      <ol className="mt-6 flex flex-col gap-0 md:flex-row md:items-start md:gap-0" role="list">
        {onCycle.map((era, i) => {
          const isExpanded = expandedYear === era.year
          const eraEvents = EVENTS.filter((ev) => era.keyEvents.includes(ev.id) && worldVisible(ev.world, route.world))
          return (
            <li key={era.year} className="flex flex-1 flex-col md:items-center">
              <div className="flex items-center gap-2 md:w-full md:flex-col">
                {i > 0 && (
                  <div
                    className="hidden md:block md:h-px md:w-full md:bg-border md:relative"
                    aria-hidden="true"
                  >
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] text-text-faint">
                      33 yrs
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => navigate('cycle', isExpanded ? [] : [String(era.year)])}
                aria-expanded={isExpanded}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors md:mx-1 ${
                  isExpanded ? 'border-adam bg-surface-2' : 'border-border bg-surface hover:bg-surface-2'
                }`}
              >
                <span className="text-base font-semibold">{era.label}</span>
                <p className="mt-1 text-xs text-text-dim">{isExpanded ? era.summary : `${eraEvents.length} key events`}</p>
              </button>
              {i < onCycle.length - 1 && (
                <div className="my-1 h-4 w-px bg-border md:hidden" aria-hidden="true" />
              )}
              {isExpanded && (
                <div className="mt-2 w-full rounded-lg border border-border bg-surface p-3 md:mx-1">
                  <ul className="flex flex-col gap-2">
                    {eraEvents.map((ev) => (
                      <li key={ev.id}>
                        <SpoilerGate level={ev.spoilerLevel}>
                          <div className="rounded border border-border bg-surface-2 p-2">
                            <p className="text-sm font-medium">{ev.title}</p>
                            <p className="mt-0.5 text-xs text-text-dim">{ev.description}</p>
                          </div>
                        </SpoilerGate>
                      </li>
                    ))}
                    {eraEvents.length === 0 && <li className="text-xs text-text-faint">No events for the current world filter.</li>}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {offCycle.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-dim">Off-cycle years</h3>
          <p className="text-xs text-text-faint">Specific scenes that fall outside the six main eras.</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {offCycle.map((era) => (
              <li key={era.year}>
                <SpoilerGate level={OFF_CYCLE_SPOILER_LEVEL[era.year] ?? 1}>
                  <div className="rounded border border-border bg-surface px-3 py-2 text-xs">
                    <span className="font-medium">{era.label}</span>
                    <p className="mt-0.5 text-text-dim">{era.summary}</p>
                  </div>
                </SpoilerGate>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
