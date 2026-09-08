import type { SpoilerLevel, WorldId } from '../data/types'

export type ViewId = 'cycle' | 'journey' | 'knot' | 'identity' | 'worlds' | 'causality'

export const VIEWS: ViewId[] = ['cycle', 'journey', 'knot', 'identity', 'worlds', 'causality']

export type WorldFilter = WorldId | 'all'
export type SpoilerFilter = SpoilerLevel | 'all'

export interface Route {
  view: ViewId
  selection: string[]
  level: SpoilerFilter
  world: WorldFilter
}

const DEFAULT_ROUTE: Route = { view: 'cycle', selection: [], level: 1, world: 'all' }

function isView(value: string | undefined): value is ViewId {
  return !!value && (VIEWS as string[]).includes(value)
}

function parseLevel(value: string | null): SpoilerFilter {
  if (value === 'all') return 'all'
  const n = Number(value)
  return n === 1 || n === 2 || n === 3 ? (n as SpoilerLevel) : 1
}

function parseWorld(value: string | null): WorldFilter {
  return value === 'origin' || value === 'adam' || value === 'eva' ? value : 'all'
}

export function parseHash(hash: string): Route {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  const [path, query] = raw.split('?')
  const segments = path.split('/').filter(Boolean)
  const view = isView(segments[0]) ? segments[0] : DEFAULT_ROUTE.view
  const selection = segments.slice(1).map(decodeURIComponent)
  const params = new URLSearchParams(query ?? '')
  return {
    view,
    selection,
    level: parseLevel(params.get('level')),
    world: parseWorld(params.get('world')),
  }
}

export function serializeHash(route: Route): string {
  const path = ['', route.view, ...route.selection.map(encodeURIComponent)].join('/')
  const params = new URLSearchParams()
  if (route.level !== 1) params.set('level', String(route.level))
  if (route.world !== 'all') params.set('world', route.world)
  const query = params.toString()
  return `#${path}${query ? `?${query}` : ''}`
}

export function readCurrentRoute(): Route {
  if (typeof window === 'undefined') return DEFAULT_ROUTE
  return parseHash(window.location.hash)
}
