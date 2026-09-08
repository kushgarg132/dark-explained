import type { DarkEvent } from '../data/types'

export function eventById(events: DarkEvent[], id: string): DarkEvent | undefined {
  return events.find((e) => e.id === id)
}

export function causesOf(events: DarkEvent[], event: DarkEvent): DarkEvent[] {
  return (event.causedBy ?? []).map((id) => eventById(events, id)).filter((e): e is DarkEvent => !!e)
}

export function effectsOf(events: DarkEvent[], event: DarkEvent): DarkEvent[] {
  return (event.causes ?? []).map((id) => eventById(events, id)).filter((e): e is DarkEvent => !!e)
}

/**
 * Walk forward through `causes` edges starting at `startId`, picking the
 * first outgoing edge at each step. Stops when it reaches an event with no
 * further `causes`, or when it revisits an id already in the chain — the
 * bootstrap paradox made walkable rather than just described.
 */
export interface ChainStep {
  event: DarkEvent
  closesLoopTo: string | null
}

export function walkForward(events: DarkEvent[], startId: string, maxSteps = 12): ChainStep[] {
  const chain: ChainStep[] = []
  const visited = new Set<string>()
  let currentId: string | undefined = startId

  while (currentId && chain.length < maxSteps) {
    if (visited.has(currentId)) {
      const closing = eventById(events, currentId)
      if (closing) chain.push({ event: closing, closesLoopTo: currentId })
      break
    }
    const event = eventById(events, currentId)
    if (!event) break
    visited.add(currentId)
    const nextId = event.causes?.[0]
    chain.push({ event, closesLoopTo: nextId && visited.has(nextId) ? nextId : null })
    currentId = nextId
  }

  return chain
}
