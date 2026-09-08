export type WorldId = 'origin' | 'adam' | 'eva'

export type FamilyId =
  | 'kahnwald'
  | 'nielsen'
  | 'doppler'
  | 'tiedemann'
  | 'tauber'
  | 'other'

export type SpoilerLevel = 1 | 2 | 3

export interface World {
  id: WorldId
  name: string
  faction: string | null
  goal: string
  summary: string
}

export interface Era {
  year: number
  label: string
  cyclePosition: number
  worlds: WorldId[]
  summary: string
  keyEvents: string[]
  onCycle: boolean
}

export interface Alias {
  name: string
  ageStage: 'child' | 'adult' | 'old'
  revealedInSeason: SpoilerLevel
  note: string
}

export interface Character {
  id: string
  displayName: string
  family: FamilyId
  world: WorldId
  aliases: Alias[]
  bornYear: number | null
  bornNote?: string
  role: string
  spoilerLevel: SpoilerLevel
  uncertain?: boolean
}

export type RelationshipType =
  | 'parent'
  | 'sibling'
  | 'partner'
  | 'same-person'
  | 'mentor'
  | 'kills'

export interface Relationship {
  from: string
  to: string
  type: RelationshipType
  isParadox: boolean
  note?: string
  spoilerLevel: SpoilerLevel
}

export type TravelMethod = 'cave' | 'device' | 'god-particle' | 'chair' | 'none'

export interface JourneyLeg {
  fromYear: number
  fromWorld: WorldId
  toYear: number
  toWorld: WorldId
  method: TravelMethod
  reason: string
  season: SpoilerLevel
}

export interface Journey {
  characterId: string
  legs: JourneyLeg[]
}

export interface DarkEvent {
  id: string
  year: number
  world: WorldId
  title: string
  description: string
  causedBy?: string[]
  causes?: string[]
  spoilerLevel: SpoilerLevel
  uncertain?: boolean
}

export interface LoopStep {
  from: string
  to: string
  explanation: string
}
