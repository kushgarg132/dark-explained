import { describe, expect, it } from 'vitest'
import { levelVisible, worldVisible } from './filter'

describe('spoiler and world filters', () => {
  it('hides content above the selected spoiler level', () => {
    expect(levelVisible(3, 1)).toBe(false)
    expect(levelVisible(2, 1)).toBe(false)
    expect(levelVisible(1, 1)).toBe(true)
  })

  it('"all" always passes the spoiler filter', () => {
    expect(levelVisible(3, 'all')).toBe(true)
  })

  it('filters by exact world unless "all" is selected', () => {
    expect(worldVisible('adam', 'adam')).toBe(true)
    expect(worldVisible('eva', 'adam')).toBe(false)
    expect(worldVisible('eva', 'all')).toBe(true)
  })
})
