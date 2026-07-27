import Wordmark from './Wordmark'
import { NAV_LINKS } from '../../content/site'
import './SiteHeader.css'

type SiteHeaderProps = {
  /** The nav highlights the section the current page belongs to. */
  activeHref?: string
}

export default function SiteHeader({ activeHref }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="site-header__home" href="/">
        <Wordmark size="nav" />
      </a>
      <nav className="site-header__nav">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            className={`site-header__link label-meta${
              link.href === activeHref ? ' site-header__link--active' : ''
            }`}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
