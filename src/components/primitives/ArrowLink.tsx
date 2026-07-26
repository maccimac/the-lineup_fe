import type { ReactNode } from 'react'
import './ArrowLink.css'

type ArrowLinkProps = {
  href: string
  children: ReactNode
  /** 12px coral meta by default; 14px display for the article's Related link. */
  emphasis?: 'meta' | 'card'
}

export default function ArrowLink({
  href,
  children,
  emphasis = 'meta',
}: ArrowLinkProps) {
  return (
    <a className={`arrow-link arrow-link--${emphasis}`} href={href}>
      {children}
      {/* Decorative — the link text already says where it goes. */}
      <span aria-hidden="true"> →</span>
    </a>
  )
}
