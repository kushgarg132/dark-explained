/**
 * Fixed hand-placed positions for the family-knot SVG (viewBox 0 0 1000 760).
 * Deliberately not force-directed or generation-derived: the eight loop
 * characters are arranged in a ring so the paradox edges visibly close a
 * circle, and every other character sits near their nearest loop relative.
 * A fixed table also means a mutual-parent pair (Charlotte/Elisabeth)
 * can't ever produce a layout cycle or crash — there's no layout algorithm
 * to break.
 */
export const FAMILY_LAYOUT: Record<string, { x: number; y: number }> = {
  // The loop, arranged as a ring
  'hannah-kahnwald': { x: 500, y: 60 },
  'silja-tiedemann': { x: 700, y: 130 },
  'agnes-nielsen': { x: 780, y: 320 },
  'tronte-nielsen': { x: 700, y: 510 },
  'ulrich-nielsen': { x: 500, y: 580 },
  'mikkel-nielsen': { x: 300, y: 510 },
  'michael-kahnwald': { x: 255, y: 430 },
  'jonas-kahnwald': { x: 220, y: 320 },

  // Nielsen extras
  'katharina-nielsen': { x: 500, y: 660 },
  'magnus-nielsen': { x: 420, y: 715 },
  'franziska-nielsen': { x: 500, y: 730 },
  'mads-nielsen': { x: 580, y: 715 },
  'martha-nielsen': { x: 140, y: 260 },

  // Doppler
  'helge-doppler': { x: 60, y: 60 },
  'charlotte-doppler': { x: 100, y: 130 },
  'peter-doppler': { x: 60, y: 200 },
  'elisabeth-doppler': { x: 140, y: 170 },

  // Tiedemann
  'claudia-tiedemann': { x: 855, y: 50 },
  'egon-tiedemann': { x: 795, y: 140 },
  'regina-tiedemann': { x: 865, y: 190 },
  'bartosz-tiedemann': { x: 825, y: 280 },
  'aleksander-tiedemann': { x: 895, y: 335 },

  // Tauber
  'noah-tauber': { x: 850, y: 420 },

  // Other
  'hg-tannhaus': { x: 60, y: 340 },
  'marek-tannhaus': { x: 60, y: 410 },
  'sonja-tannhaus': { x: 60, y: 480 },
  'torben-woller': { x: 940, y: 540 },
  'the-unknown': { x: 275, y: 220 },
}

export const FAMILY_VIEWBOX = '0 0 1000 760'
