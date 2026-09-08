import { useAppState } from '../state/AppState'
import { VIEWS, type ViewId } from '../lib/route'
import { SearchOverlay } from './Search'

const VIEW_LABELS: Record<ViewId, string> = {
  cycle: 'Cycle',
  journey: 'Journey',
  knot: 'Family Knot',
  identity: 'Identity',
  worlds: 'Worlds',
  causality: 'Causality',
}

export function Header() {
  const { route, navigate, setLevel, setWorld, theme, toggleTheme } = useAppState()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold tracking-tight">Dark — Explained</h1>
          <div className="flex items-center gap-2">
            <SearchOverlay />
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded border border-border bg-surface px-3 py-1.5 text-sm text-text-dim hover:text-text"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>

        <nav aria-label="Views" className="flex gap-1 overflow-x-auto">
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => navigate(v)}
              aria-current={route.view === v ? 'page' : undefined}
              className={`shrink-0 rounded px-3 py-1.5 text-sm font-medium ${
                route.view === v ? 'bg-surface-2 text-text' : 'text-text-dim hover:text-text'
              }`}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Spoiler level</legend>
            <span className="text-text-faint">Spoilers through</span>
            {(['1', '2', '3', 'all'] as const).map((opt) => {
              const value = opt === 'all' ? 'all' : (Number(opt) as 1 | 2 | 3)
              const active = route.level === value
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLevel(value)}
                  aria-pressed={active}
                  className={`rounded px-2 py-1 ${active ? 'bg-adam/20 text-text font-medium' : 'text-text-dim hover:text-text'}`}
                >
                  {opt === 'all' ? 'All' : `S${opt}`}
                </button>
              )
            })}
          </fieldset>

          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">World filter</legend>
            <span className="text-text-faint">World</span>
            {(['all', 'origin', 'adam', 'eva'] as const)
              .filter((opt) => route.level === 'all' || route.level >= 2 || (opt !== 'adam' && opt !== 'eva'))
              .map((opt) => {
              const active = route.world === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWorld(opt)}
                  aria-pressed={active}
                  className={`rounded px-2 py-1 capitalize ${active ? 'bg-eva/20 text-text font-medium' : 'text-text-dim hover:text-text'}`}
                >
                  {opt}
                </button>
              )
            })}
          </fieldset>
        </div>
      </div>
    </header>
  )
}
