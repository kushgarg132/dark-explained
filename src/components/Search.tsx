import { useEffect, useRef, useState } from 'react'
import { useAppState } from '../state/AppState'
import { search } from '../lib/search'

export function SearchOverlay() {
  const { route, navigate } = useAppState()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (e.key === '/' && !typing) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else setQuery('')
  }, [open])

  const results = search(query, route.level, route.world)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded border border-border bg-surface px-3 py-1.5 text-sm text-text-dim hover:text-text"
        aria-label="Search characters, aliases, years and events"
      >
        Search
        <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[12px]">/</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[10vh]" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-lg rounded-lg border border-border bg-surface shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search characters, aliases, years, events…"
              className="w-full border-b border-border bg-transparent px-4 py-3 text-base outline-none placeholder:text-text-faint"
            />
            <ul className="max-h-[50vh] overflow-y-auto py-1">
              {results.length === 0 && query.trim() && (
                <li className="px-4 py-3 text-sm text-text-faint">No matches within the current spoiler/world filter.</li>
              )}
              {results.map((r) => (
                <li key={`${r.kind}-${r.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(r.view, r.selection)
                      setOpen(false)
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-surface-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[12px] uppercase tracking-wide text-text-faint">{r.kind}</span>
                      <span className="text-sm font-medium">{r.title}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-text-dim">{r.subtitle}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
