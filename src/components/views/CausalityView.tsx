import { useMemo, useState } from 'react'
import { EVENTS } from '../../data/dark'
import { useAppState } from '../../state/AppState'
import { levelVisible, worldVisible } from '../../lib/filter'
import { causesOf, effectsOf, eventById, walkForward } from '../../lib/causality'
import { SpoilerGate } from '../SpoilerGate'

export function CausalityView() {
  const { route, navigate } = useAppState()
  const [query, setQuery] = useState('')
  const [showChain, setShowChain] = useState(false)

  const visibleEvents = EVENTS.filter((e) => levelVisible(e.spoilerLevel, route.level) && worldVisible(e.world, route.world))
  const currentId = route.selection[0] ?? visibleEvents[0]?.id
  const current = currentId ? eventById(EVENTS, currentId) : undefined

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visibleEvents.filter((e) => !q || e.title.toLowerCase().includes(q) || String(e.year).includes(q)).slice(0, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, route.level, route.world])

  function select(id: string) {
    setShowChain(false)
    navigate('causality', [id])
  }

  const chain = current ? walkForward(EVENTS, current.id) : []

  return (
    <section aria-labelledby="causality-heading" className="mx-auto max-w-6xl px-4 py-6">
      <h2 id="causality-heading" className="text-xl font-semibold">
        Causality
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-dim">
        Pick an event to see what caused it and what it causes. Click through the chain — some of them lead right back
        to where you started.
      </p>
      <p className="sr-only">
        Screen-reader summary: a chain-of-causation explorer. Selecting an event shows its causes and effects as
        clickable links, and a subset of chains loop back to their own starting event — the bootstrap paradox made
        interactive.
      </p>

      <div className="mt-4">
        <label htmlFor="causality-search" className="sr-only">
          Search events
        </label>
        <input
          id="causality-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an event…"
          className="w-full max-w-sm rounded border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-focus"
        />
        <ul className="mt-2 flex flex-wrap gap-2">
          {candidates.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => select(e.id)}
                aria-pressed={currentId === e.id}
                className={`rounded-full border px-3 py-1 text-xs ${
                  currentId === e.id ? 'border-adam bg-adam/20 text-text' : 'border-border bg-surface text-text-dim hover:text-text'
                }`}
              >
                {e.year} — {e.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-faint">Caused by</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {causesOf(EVENTS, current)
                .filter((e) => levelVisible(e.spoilerLevel, route.level))
                .map((e) => (
                  <li key={e.id}>
                    <button type="button" onClick={() => select(e.id)} className="w-full rounded border border-border bg-surface p-2 text-left text-xs hover:bg-surface-2">
                      {e.year} — {e.title}
                    </button>
                  </li>
                ))}
              {causesOf(EVENTS, current).length === 0 && <li className="text-xs text-text-faint">Nothing precedes this — a true origin point.</li>}
            </ul>
          </div>

          <div className="md:col-span-1">
            <SpoilerGate level={current.spoilerLevel}>
              <div className="rounded-lg border border-adam bg-surface p-4">
                <p className="text-xs text-text-faint">{current.year} · {current.world}</p>
                <p className="mt-1 text-base font-semibold">{current.title}</p>
                <p className="mt-2 text-sm text-text-dim">{current.description}</p>
                {current.uncertain && <p className="mt-2 text-xs italic text-text-faint">Marked uncertain — not confidently canon.</p>}
              </div>
            </SpoilerGate>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-faint">Causes</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {effectsOf(EVENTS, current)
                .filter((e) => levelVisible(e.spoilerLevel, route.level))
                .map((e) => (
                  <li key={e.id}>
                    <button type="button" onClick={() => select(e.id)} className="w-full rounded border border-border bg-surface p-2 text-left text-xs hover:bg-surface-2">
                      {e.year} — {e.title}
                    </button>
                  </li>
                ))}
              {effectsOf(EVENTS, current).length === 0 && <li className="text-xs text-text-faint">Nothing follows — an endpoint.</li>}
            </ul>
          </div>
        </div>
      )}

      {current && (
        <div className="mt-6">
          <button type="button" onClick={() => setShowChain((v) => !v)} className="rounded bg-adam/20 px-3 py-1.5 text-sm font-medium hover:bg-adam/30">
            {showChain ? 'Hide' : 'Walk'} the forward chain
          </button>
          {showChain && (
            <ol className="mt-3 flex flex-col gap-2">
              {chain.map((step, i) => (
                <li key={i}>
                  <SpoilerGate level={step.event.spoilerLevel}>
                    <div className={`rounded border p-2 text-sm ${step.closesLoopTo ? 'border-focus bg-focus/10' : 'border-border bg-surface'}`}>
                      <span className="text-text-faint">{i + 1}.</span> {step.event.year} — {step.event.title}
                      {step.closesLoopTo && (
                        <span className="ml-2 text-xs font-medium text-focus">↻ closes the loop back to step 1</span>
                      )}
                    </div>
                  </SpoilerGate>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  )
}
