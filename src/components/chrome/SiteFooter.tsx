import Wordmark from './Wordmark'
import { FOOTER } from '../../content/site'
import './SiteFooter.css'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Wordmark size="footer" />
      <span className="site-footer__meta">{FOOTER.byline}</span>
      <span className="site-footer__meta">{FOOTER.contact}</span>
    </footer>
  )
}
