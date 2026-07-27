import Kicker from '../primitives/Kicker'
import type { Article } from '../../content/types'
import './ArticleHeader.css'

type ArticleHeaderProps = {
  article: Article
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="article-header">
      <Kicker tone="coral">{article.kicker}</Kicker>
      <h1 className="article-header__headline">{article.headline}</h1>
      <p className="article-header__byline type-dek">{article.byline}</p>
      <hr className="rule article-header__rule" />
    </header>
  )
}
