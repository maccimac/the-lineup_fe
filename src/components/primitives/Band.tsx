import type { ReactNode } from 'react'
import './Band.css'

type BandProps = {
  children: ReactNode
  /** The homepage pitch band is forest; the nav, hero, and grid sit on surface. */
  tone: 'forest' | 'surface'
}

export default function Band({ children, tone }: BandProps) {
  return (
    <section className={`band band--${tone}`}>
      <div className="band__inner">{children}</div>
    </section>
  )
}
