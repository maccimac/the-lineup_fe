import { render, screen } from '@testing-library/react'
import ArticleHeader from './ArticleHeader'
import { getArticle } from '../../content/articles'

const article = getArticle('building-compliance-in-a-sea-of-digital-assets')!

test('renders kicker, headline, and byline', () => {
  render(<ArticleHeader article={article} />)
  expect(screen.getByText('CASE STUDY')).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { name: 'Building compliance in a sea of digital assets' }),
  ).toBeInTheDocument()
  expect(screen.getByText(/12 min read/)).toBeInTheDocument()
})

test('uses the coral kicker and the 46px headline scale', () => {
  render(<ArticleHeader article={article} />)
  expect(screen.getByText('CASE STUDY')).toHaveClass('kicker--coral')
  expect(screen.getByRole('heading')).toHaveClass('article-header__headline')
})
