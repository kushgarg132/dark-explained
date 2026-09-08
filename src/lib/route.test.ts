import { describe, expect, it } from 'vitest'
import { parseHash, serializeHash } from './route'

describe('route hash parse/serialize', () => {
  it('round-trips a view with selection and filters', () => {
    const hash = serializeHash({ view: 'journey', selection: ['jonas-kahnwald', 'martha-nielsen'], level: 2, world: 'adam' })
    expect(parseHash(hash)).toEqual({ view: 'journey', selection: ['jonas-kahnwald', 'martha-nielsen'], level: 2, world: 'adam' })
  })

  it('defaults to the cycle view with spoiler level 1 and all worlds', () => {
    expect(parseHash('')).toEqual({ view: 'cycle', selection: [], level: 1, world: 'all' })
  })

  it('falls back to a known view for garbage input', () => {
    expect(parseHash('#/not-a-real-view/x')).toMatchObject({ view: 'cycle' })
  })

  it('omits default query params from the serialized hash', () => {
    expect(serializeHash({ view: 'cycle', selection: [], level: 1, world: 'all' })).toBe('#/cycle')
  })
})
