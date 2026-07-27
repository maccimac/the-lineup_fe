import { WORDMARK } from '../../content/site'
import './Wordmark.css'

type WordmarkProps = {
  size: 'nav' | 'footer'
}

export default function Wordmark({ size }: WordmarkProps) {
  return <span className={`wordmark wordmark--${size}`}>{WORDMARK}</span>
}
