import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import MetaBar from './MetaBar'
import SiteFooter from './SiteFooter'
import './PageShell.css'

type PageShellProps = {
  metaBarCenter: string
  activeHref?: string
  children: ReactNode
}

export default function PageShell({
  metaBarCenter,
  activeHref,
  children,
}: PageShellProps) {
  return (
    <div className="page-shell">
      <SiteHeader activeHref={activeHref} />
      <MetaBar center={metaBarCenter} />
      <main className="page-shell__main">{children}</main>
      <SiteFooter />
    </div>
  )
}
