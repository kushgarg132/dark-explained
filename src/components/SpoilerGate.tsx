import { useState, type ReactNode } from 'react'
import { useAppState } from '../state/AppState'
import { levelVisible } from '../lib/filter'
import type { SpoilerLevel } from '../data/types'

interface SpoilerGateProps {
  level: SpoilerLevel
  children: ReactNode
  className?: string
  label?: string
}

export function SpoilerGate({ level, children, className, label }: SpoilerGateProps) {
  const { route } = useAppState()
  const [revealed, setRevealed] = useState(false)
  const gated = !levelVisible(level, route.level) && !revealed

  if (!gated) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      <div aria-hidden="true" className="pointer-events-none select-none blur-sm opacity-60">
        {children}
      </div>
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="absolute inset-0 flex items-center justify-center rounded bg-surface/70 text-center text-xs font-medium text-text px-3 hover:bg-surface/90"
      >
        {label ?? `Reveals a season ${level} twist — tap to show`}
      </button>
    </div>
  )
}
