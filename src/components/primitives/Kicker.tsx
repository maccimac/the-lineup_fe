import type { ReactNode } from 'react'
import './Kicker.css'

type KickerProps = {
  children: ReactNode
  /** Forest on the homepage, coral on the article page. */
  tone?: 'forest' | 'coral' | 'ink'
  /** 9px in the homepage sidebar, 10px in the story grid, 11px on headers. */
  size?: 'micro' | 'kicker' | 'meta'
}

export default function Kicker({
  children,
  tone = 'forest',
  size = 'meta',
}: KickerProps) {
  return (
    <p className={`kicker label-meta label-meta--wide kicker--${tone} kicker--${size}`}>
      {children}
    </p>
  )
}
