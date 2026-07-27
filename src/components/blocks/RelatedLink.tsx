import Kicker from '../primitives/Kicker'
import ArrowLink from '../primitives/ArrowLink'
import type { LinkRef } from '../../content/types'
import './RelatedLink.css'

type RelatedLinkProps = {
  related: LinkRef
}

export default function RelatedLink({ related }: RelatedLinkProps) {
  return (
    <div className="related-link">
      <hr className="rule rule--strong" />
      <Kicker tone="coral" size="kicker">
        RELATED
      </Kicker>
      <div className="related-link__target">
        <ArrowLink href={related.href} emphasis="card">
          {related.label}
        </ArrowLink>
      </div>
    </div>
  )
}
