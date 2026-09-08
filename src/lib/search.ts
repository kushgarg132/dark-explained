import { CHARACTERS, EVENTS, ERAS } from '../data/dark'
import type { SpoilerFilter, WorldFilter } from './route'
import { levelVisible, worldVisible } from './filter'

export type SearchResultKind = 'character' | 'alias' | 'event' | 'era'

export interface SearchResult {
  kind: SearchResultKind
  id: string
  title: string
  subtitle: string
  view: string
  selection: string[]
}

export function search(query: string, level: SpoilerFilter, world: WorldFilter): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: SearchResult[] = []

  for (const c of CHARACTERS) {
    if (!levelVisible(c.spoilerLevel, level) || !worldVisible(c.world, world)) continue
    if (c.displayName.toLowerCase().includes(q)) {
      results.push({ kind: 'character', id: c.id, title: c.displayName, subtitle: c.role, view: 'identity', selection: [c.id] })
    }
    for (const alias of c.aliases) {
      if (!levelVisible(alias.revealedInSeason, level)) continue
      if (alias.name.toLowerCase().includes(q)) {
        results.push({ kind: 'alias', id: `${c.id}:${alias.name}`, title: alias.name, subtitle: `${alias.note} (${c.displayName})`, view: 'identity', selection: [c.id] })
      }
    }
  }

  for (const e of EVENTS) {
    if (!levelVisible(e.spoilerLevel, level) || !worldVisible(e.world, world)) continue
    if (e.title.toLowerCase().includes(q) || String(e.year).includes(q)) {
      results.push({ kind: 'event', id: e.id, title: e.title, subtitle: `${e.year} — ${e.description}`, view: 'causality', selection: [e.id] })
    }
  }

  for (const era of ERAS) {
    if (era.label.toLowerCase().includes(q) || String(era.year).includes(q)) {
      results.push({ kind: 'era', id: String(era.year), title: era.label, subtitle: era.summary, view: 'cycle', selection: [String(era.year)] })
    }
  }

  return results.slice(0, 30)
}
