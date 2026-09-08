import { useEffect, useRef, useState } from 'react'
import { CHARACTERS, LOOP_TRACE, RELATIONSHIPS } from '../../data/dark'
import { useAppState } from '../../state/AppState'
import { levelVisible, worldVisible } from '../../lib/filter'
import { FAMILY_LAYOUT, FAMILY_VIEWBOX } from '../../lib/familyLayout'
import { SpoilerGate } from '../SpoilerGate'
import type { WorldId } from '../../data/types'

const WORLD_COLOR: Record<WorldId, string> = {
  origin: 'var(--color-origin)',
  adam: 'var(--color-adam)',
  eva: 'var(--color-eva)',
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function FamilyKnotView() {
  const { route } = useAppState()
  const [traceStep, setTraceStep] = useState<number>(-1)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    if (prefersReducedMotion()) {
      setPlaying(false)
      return
    }
    timerRef.current = window.setInterval(() => {
      setTraceStep((prev) => {
        if (prev >= LOOP_TRACE.length - 1) {
          setPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1600)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [playing])

  const visibleCharacterIds = new Set(
    CHARACTERS.filter((c) => levelVisible(c.spoilerLevel, route.level) && worldVisible(c.world, route.world) && FAMILY_LAYOUT[c.id]).map(
      (c) => c.id,
    ),
  )

  const visibleRelationships = RELATIONSHIPS.filter(
    (r) =>
      levelVisible(r.spoilerLevel, route.level) &&
      visibleCharacterIds.has(r.from) &&
      visibleCharacterIds.has(r.to) &&
      r.type !== 'kills' &&
      r.type !== 'mentor',
  )

  const activeSteps = LOOP_TRACE.slice(0, traceStep + 1)
  const traceEdgeKeys = new Set(activeSteps.flatMap((s) => [`${s.from}->${s.to}`, `${s.to}->${s.from}`]))
  const activeStep = traceStep >= 0 ? LOOP_TRACE[traceStep] : null

  function startTrace() {
    setTraceStep(0)
    setPlaying(!prefersReducedMotion())
  }

  function reset() {
    setPlaying(false)
    setTraceStep(-1)
  }

  function step(delta: number) {
    setPlaying(false)
    setTraceStep((prev) => Math.min(LOOP_TRACE.length - 1, Math.max(0, prev + delta)))
  }

  return (
    <section aria-labelledby="knot-heading" className="mx-auto max-w-6xl px-4 py-6">
      <h2 id="knot-heading" className="text-xl font-semibold">
        The family knot
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-dim">
        Four families, tangled into one. Thin gray lines are ordinary parent/sibling/partner ties. Accent lines marked{' '}
        <span aria-hidden="true">↻</span> close a causal loop — the same person is, impossibly, their own ancestor or
        descendant.
      </p>
      <p className="sr-only">
        Screen-reader summary: a node-and-line diagram of the four families. A handful of highlighted lines form a loop
        running from Hannah Kahnwald through six generations back to Jonas, her own son — the central paradox of the
        series.
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-3">
        <svg viewBox={FAMILY_VIEWBOX} role="img" className="w-full min-w-[720px]" aria-labelledby="knot-svg-title knot-svg-desc">
          <title id="knot-svg-title">Family relationship graph for the four families</title>
          <desc id="knot-svg-desc">
            Nodes represent characters, positioned near their closest relatives. Gray lines are ordinary family ties.
            Accent-colored lines mark relationships that close a time-loop paradox.
          </desc>
          {visibleRelationships.map((r, i) => {
            const from = FAMILY_LAYOUT[r.from]
            const to = FAMILY_LAYOUT[r.to]
            if (!from || !to) return null
            const isTraceActive = traceEdgeKeys.has(`${r.from}->${r.to}`)
            const isLoopEdge = LOOP_TRACE.some((s) => (s.from === r.from && s.to === r.to) || (s.from === r.to && s.to === r.from))
            const dim = traceStep >= 0 && r.isParadox && !isTraceActive && isLoopEdge
            return (
              <g key={i} opacity={dim ? 0.25 : 1}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={r.isParadox ? 'var(--color-focus)' : 'var(--color-border)'}
                  strokeWidth={r.isParadox ? (isTraceActive ? 4 : 2) : 1}
                  strokeDasharray={r.type === 'same-person' ? '6 4' : undefined}
                />
                {r.isParadox && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2}
                    fontSize={16}
                    textAnchor="middle"
                    fill="var(--color-focus)"
                    className="select-none"
                  >
                    ↻
                  </text>
                )}
              </g>
            )
          })}
          {CHARACTERS.filter((c) => visibleCharacterIds.has(c.id)).map((c) => {
            const pos = FAMILY_LAYOUT[c.id]
            const inTraceNow = activeStep && (activeStep.from === c.id || activeStep.to === c.id)
            return (
              <g key={c.id} transform={`translate(${pos.x} ${pos.y})`}>
                <circle r={inTraceNow ? 12 : 8} fill={WORLD_COLOR[c.world]} stroke="var(--color-bg)" strokeWidth={2} />
                <text y={-14} textAnchor="middle" fontSize={12} fill="var(--color-text)">
                  {c.displayName}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <SpoilerGate level={3} className="mt-4" label="Reveals a season 3 twist — the closed bloodline loop — tap to show">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={startTrace}
              className="rounded bg-adam/20 px-3 py-1.5 text-sm font-medium text-text hover:bg-adam/30"
            >
              Trace the loop
            </button>
            <button type="button" onClick={() => step(-1)} disabled={traceStep <= 0} className="rounded border border-border px-2 py-1.5 text-sm disabled:opacity-40">
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={traceStep < 0 || traceStep >= LOOP_TRACE.length - 1}
              className="rounded border border-border px-2 py-1.5 text-sm disabled:opacity-40"
            >
              Next →
            </button>
            <button type="button" onClick={reset} disabled={traceStep < 0} className="rounded border border-border px-2 py-1.5 text-sm disabled:opacity-40">
              Reset
            </button>
            {traceStep >= 0 && (
              <span className="text-xs text-text-faint">
                Step {traceStep + 1} of {LOOP_TRACE.length}
              </span>
            )}
          </div>
          {activeStep && (
            <p className="mt-3 text-sm">
              <strong>
                {CHARACTERS.find((c) => c.id === activeStep.from)?.displayName} → {CHARACTERS.find((c) => c.id === activeStep.to)?.displayName}
              </strong>
              : {activeStep.explanation}
            </p>
          )}
          {traceStep === LOOP_TRACE.length - 1 && (
            <p className="mt-2 text-sm text-adam">
              The loop is closed: Jonas is Hannah's son directly, and — through six more generations — her ancestor too.
            </p>
          )}
        </div>
      </SpoilerGate>
    </section>
  )
}
