import { describe, expect, it } from 'vitest'
import { walkForward } from './causality'
import { EVENTS } from '../data/dark'

describe('causality chain walk', () => {
  it('walks forward until it revisits its own start, closing the loop', () => {
    const chain = walkForward(EVENTS, 'ev-loop-adam-01')
    const last = chain[chain.length - 1]
    expect(last.closesLoopTo).toBe('ev-loop-adam-01')
    expect(chain[0].event.id).toBe('ev-loop-adam-01')
    // the loop is 3 events long, then a 4th step re-visits the first
    expect(chain).toHaveLength(4)
  })

  it('stops at a true endpoint with no further causes', () => {
    const chain = walkForward(EVENTS, 'ev-1888-book-written')
    expect(chain).toHaveLength(1)
    expect(chain[0].closesLoopTo).toBeNull()
  })
})
