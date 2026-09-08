import { describe, expect, it } from 'vitest'
import { CHARACTERS, EVENTS, JOURNEYS, LOOP_TRACE, RELATIONSHIPS } from './dark'
import { FAMILY_LAYOUT } from '../lib/familyLayout'

const characterIds = new Set(CHARACTERS.map((c) => c.id))
const eventIds = new Set(EVENTS.map((e) => e.id))

describe('data integrity', () => {
  it('every relationship references a real character on both ends', () => {
    for (const r of RELATIONSHIPS) {
      expect(characterIds.has(r.from), `missing character ${r.from}`).toBe(true)
      expect(characterIds.has(r.to), `missing character ${r.to}`).toBe(true)
    }
  })

  it('every journey and leg references a real character', () => {
    for (const j of JOURNEYS) {
      expect(characterIds.has(j.characterId), `missing character ${j.characterId}`).toBe(true)
    }
  })

  it('every event causedBy/causes id resolves to a real event', () => {
    for (const e of EVENTS) {
      for (const id of e.causedBy ?? []) expect(eventIds.has(id), `missing event ${id}`).toBe(true)
      for (const id of e.causes ?? []) expect(eventIds.has(id), `missing event ${id}`).toBe(true)
    }
  })

  it('every character in the family-knot layout is a real character', () => {
    for (const id of Object.keys(FAMILY_LAYOUT)) {
      expect(characterIds.has(id), `missing character ${id}`).toBe(true)
    }
  })

  it('the loop trace forms a single closed cycle back to its start', () => {
    expect(LOOP_TRACE[0].from).toBe(LOOP_TRACE[LOOP_TRACE.length - 1].to)
    for (let i = 0; i < LOOP_TRACE.length - 1; i++) {
      expect(LOOP_TRACE[i].to).toBe(LOOP_TRACE[i + 1].from)
    }
  })

  it('every loop-trace edge exists as a paradox relationship (in either direction — the closing step reverses a parent edge)', () => {
    for (const step of LOOP_TRACE) {
      const rel = RELATIONSHIPS.find(
        (r) => (r.from === step.from && r.to === step.to) || (r.from === step.to && r.to === step.from),
      )
      expect(rel, `no relationship for ${step.from} -> ${step.to}`).toBeTruthy()
      expect(rel?.isParadox).toBe(true)
    }
  })
})
