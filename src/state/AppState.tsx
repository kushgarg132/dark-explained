import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { parseHash, readCurrentRoute, serializeHash, type Route, type SpoilerFilter, type ViewId, type WorldFilter } from '../lib/route'

const LEVEL_KEY = 'dark-explained:level'
const WORLD_KEY = 'dark-explained:world'
const THEME_KEY = 'dark-explained:theme'

type Theme = 'dark' | 'light'

interface AppStateValue {
  route: Route
  navigate: (view: ViewId, selection?: string[]) => void
  setLevel: (level: SpoilerFilter) => void
  setWorld: (world: WorldFilter) => void
  theme: Theme
  toggleTheme: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

function readStoredLevel(): SpoilerFilter | null {
  const raw = localStorage.getItem(LEVEL_KEY)
  if (raw === 'all') return 'all'
  const n = Number(raw)
  return n === 1 || n === 2 || n === 3 ? (n as SpoilerFilter) : null
}

function readStoredWorld(): WorldFilter | null {
  const raw = localStorage.getItem(WORLD_KEY)
  return raw === 'origin' || raw === 'adam' || raw === 'eva' || raw === 'all' ? raw : null
}

function readStoredTheme(): Theme {
  const raw = localStorage.getItem(THEME_KEY)
  return raw === 'light' ? 'light' : 'dark'
}

function initialRoute(): Route {
  const fromHash = readCurrentRoute()
  const hasLevelInHash = window.location.hash.includes('level=')
  const hasWorldInHash = window.location.hash.includes('world=')
  const storedLevel = readStoredLevel()
  const storedWorld = readStoredWorld()
  return {
    ...fromHash,
    level: hasLevelInHash ? fromHash.level : storedLevel ?? fromHash.level,
    world: hasWorldInHash ? fromHash.world : storedWorld ?? fromHash.world,
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(initialRoute)
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    // history.replaceState (used below to keep the hash in sync with state)
    // never fires 'hashchange' itself, so this only runs for navigations we
    // didn't cause ourselves — back/forward, a pasted link, a manual edit —
    // and the incoming hash should simply win.
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const next = serializeHash(route)
    if (window.location.hash !== next) window.history.replaceState(null, '', next)
    localStorage.setItem(LEVEL_KEY, String(route.level))
    localStorage.setItem(WORLD_KEY, route.world)
  }, [route])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const navigate = useCallback((view: ViewId, selection: string[] = []) => {
    setRoute((prev) => ({ ...prev, view, selection }))
  }, [])

  const setLevel = useCallback((level: SpoilerFilter) => {
    setRoute((prev) => {
      const hidesWorlds = level !== 'all' && level < 2
      const world = hidesWorlds && (prev.world === 'adam' || prev.world === 'eva') ? 'all' : prev.world
      return { ...prev, level, world }
    })
  }, [])

  const setWorld = useCallback((world: WorldFilter) => {
    setRoute((prev) => ({ ...prev, world }))
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <AppStateContext.Provider value={{ route, navigate, setLevel, setWorld, theme, toggleTheme }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
