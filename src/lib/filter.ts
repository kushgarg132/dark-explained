import type { SpoilerFilter, WorldFilter } from './route'
import type { WorldId } from '../data/types'

export function levelVisible(itemLevel: number, filter: SpoilerFilter): boolean {
  return filter === 'all' || itemLevel <= filter
}

export function worldVisible(itemWorld: WorldId, filter: WorldFilter): boolean {
  return filter === 'all' || itemWorld === filter
}
