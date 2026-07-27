import type { ReactNode } from 'react'
import './PullQuote.css'

type PullQuoteProps = {
  children: ReactNode
  /** The homepage's dark band, or the article page's sidebar aside. */
  variant: 'band' | 'sidebar'
}

export default function PullQuote({ children, variant }: PullQuoteProps) {
  return (
    <blockquote className={`pull-quote type-serif pull-quote--${variant}`}>
      {children}
    </blockquote>
  )
}
