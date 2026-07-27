import { META_BAR } from '../../content/site'
import './MetaBar.css'

type MetaBarProps = {
  /** The only slot that changes per page. */
  center: string
}

export default function MetaBar({ center }: MetaBarProps) {
  return (
    <div className="meta-bar">
      <span className="label-meta label-meta--light meta-bar__slot">
        {META_BAR.left}
      </span>
      <span className="label-meta label-meta--light meta-bar__slot">
        {center}
      </span>
      <span className="label-meta label-meta--light meta-bar__slot">
        {META_BAR.right}
      </span>
    </div>
  )
}
