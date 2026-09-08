import { CHARACTERS } from '../../data/dark'
import { useAppState } from '../../state/AppState'
import { levelVisible, worldVisible } from '../../lib/filter'
import { SpoilerGate } from '../SpoilerGate'

export function IdentityView() {
  const { route } = useAppState()
  const withAliases = CHARACTERS.filter(
    (c) => c.aliases.length > 0 && levelVisible(c.spoilerLevel, route.level) && worldVisible(c.world, route.world),
  )
  const focusId = route.selection[0]

  return (
    <section aria-labelledby="identity-heading" className="mx-auto max-w-6xl px-4 py-6">
      <h2 id="identity-heading" className="text-xl font-semibold">
        Identity reveals
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-text-dim">
        The same person, under a different name, at a different age. Each card pairs who they start as with who they
        turn out to be.
      </p>
      <p className="sr-only">
        Screen-reader summary: a set of cards, one per character who is revealed to also be someone else — a different
        name at a different age, disclosed in a later season.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {withAliases.map((c) => (
          <li
            key={c.id}
            id={`identity-${c.id}`}
            className={`rounded-lg border bg-surface p-4 ${focusId === c.id ? 'border-adam' : 'border-border'}`}
          >
            <p className="text-base font-semibold">{c.displayName}</p>
            <p className="mt-0.5 text-xs text-text-dim">{c.role}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {c.aliases.map((alias) => (
                <li key={alias.name}>
                  <SpoilerGate level={alias.revealedInSeason}>
                    <div className="rounded border border-border bg-surface-2 p-2">
                      <p className="text-sm font-medium">
                        → {alias.name}{' '}
                        <span className="text-xs font-normal text-text-faint">
                          ({alias.ageStage}, revealed season {alias.revealedInSeason})
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-text-dim">{alias.note}</p>
                    </div>
                  </SpoilerGate>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
