import { WORLDS } from '../../data/dark'
import { SpoilerGate } from '../SpoilerGate'
import type { SpoilerLevel, WorldId } from '../../data/types'

const WORLD_SPOILER_LEVEL: Record<WorldId, SpoilerLevel> = {
  origin: 3,
  adam: 2,
  eva: 2,
}

export function WorldsView() {
  const origin = WORLDS.find((w) => w.id === 'origin')!
  const adam = WORLDS.find((w) => w.id === 'adam')!
  const eva = WORLDS.find((w) => w.id === 'eva')!

  return (
    <section aria-labelledby="worlds-heading" className="mx-auto max-w-6xl px-4 py-6">
      <h2 id="worlds-heading" className="text-xl font-semibold">
        Three worlds
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-dim">
        One world splits into two. Both are held together by the same loop, and both come apart at the same moment.
      </p>
      <p className="sr-only">
        Screen-reader summary: a diagram showing one origin world splitting into two mirror worlds, which are bound
        together and later dissolved by a single intervention in the origin world's past.
      </p>

      <SpoilerGate level={WORLD_SPOILER_LEVEL.origin} className="mt-6">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="font-semibold text-origin">{origin.name}</h3>
          <p className="mt-1 text-sm text-text-dim">{origin.summary}</p>
        </div>
      </SpoilerGate>

      <div className="mt-4 flex justify-center text-text-faint" aria-hidden="true">
        ↓ splits into ↓
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SpoilerGate level={WORLD_SPOILER_LEVEL.adam}>
          <div className="h-full rounded-lg border border-adam/50 bg-surface p-4">
            <h3 className="font-semibold text-adam">{adam.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-text-faint">{adam.faction}</p>
            <p className="mt-2 text-sm text-text-dim">{adam.summary}</p>
            <p className="mt-3 rounded bg-adam/10 p-2 text-sm">
              <strong>Goal:</strong> {adam.goal}
            </p>
          </div>
        </SpoilerGate>
        <SpoilerGate level={WORLD_SPOILER_LEVEL.eva}>
          <div className="h-full rounded-lg border border-eva/50 bg-surface p-4">
            <h3 className="font-semibold text-eva">{eva.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-text-faint">{eva.faction}</p>
            <p className="mt-2 text-sm text-text-dim">{eva.summary}</p>
            <p className="mt-3 rounded bg-eva/10 p-2 text-sm">
              <strong>Goal:</strong> {eva.goal}
            </p>
          </div>
        </SpoilerGate>
      </div>

      <SpoilerGate level={3} className="mt-6" label="Reveals the ending — tap to show">
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text-dim">
          <h3 className="font-semibold text-text">How it ends</h3>
          <p className="mt-2">
            Claudia works out that both worlds only exist because of Tannhaus's machine, built in the one, original
            world. Jonas and Martha travel to 21 June 1971 and stop the bridge crash that made him build it. Tannhaus
            never builds the machine — so neither knot world is ever created, and Jonas and Martha, who only existed
            because of the loop, dissolve along with them. In the origin world, only the people whose existence never
            depended on the loop remain, gathered at Regina and Peter's house.
          </p>
        </div>
      </SpoilerGate>
    </section>
  )
}
