import { useEffect, useState } from 'react'
import './StyleGuide.css'

/*
 * Living documentation for the design system in src/styles/.
 * Mirrors the Figma "Design System" page (node 33:2), sections 00–03.
 *
 * Everything here is rendered with the system's own tokens and type classes —
 * if a specimen looks wrong, the system is wrong.
 */

type Swatch = {
  name: string
  token: string
  className: string
  /** Pale surfaces need an outline to be visible on the page background. */
  outlined?: boolean
}

const SWATCHES: Swatch[] = [
  { name: 'Dim Grey', token: '--color-dim-grey', className: 'swatch--dim-grey' },
  { name: 'Black', token: '--color-black', className: 'swatch--black' },
  {
    name: 'Papaya Whip',
    token: '--color-papaya-whip',
    className: 'swatch--papaya-whip',
    outlined: true,
  },
  {
    name: 'Papaya Milk',
    token: '--color-papaya-milk',
    className: 'swatch--papaya-milk',
    outlined: true,
  },
  { name: 'Vibrant Coral', token: '--color-coral', className: 'swatch--coral' },
  {
    name: 'Deep Forest',
    token: '--color-deep-forest',
    className: 'swatch--deep-forest',
  },
]

const SWATCH_TOKENS = SWATCHES.map((swatch) => swatch.token)

type Specimen = {
  name: string
  spec: string
  usage: string
  className: string
}

const SPECIMENS: Specimen[] = [
  {
    name: 'Feature Headline',
    spec: 'Archivo Black / 52px',
    usage: 'Hero headlines and feature titles — the loudest voice on the page.',
    className: 'type-feature',
  },
  {
    name: 'Card Headline',
    spec: 'Archivo Black / 18px',
    usage: 'Story grid cards and section headers at smaller scale.',
    className: 'type-card',
  },
  {
    name: 'Editorial Serif',
    spec: 'Jomolhari 400 / 22px',
    usage: 'Sidebar reading moments, pull quotes, editorial asides.',
    className: 'type-serif',
  },
  {
    name: 'Body',
    spec: 'Barlow 300 / 16px',
    usage: 'Paragraph copy, descriptions, long-form reading text.',
    className: 'type-body',
  },
  {
    name: 'Meta / Nav',
    spec: 'Barlow 500 / 11px',
    usage: 'Navigation, bylines, category labels — uppercase, tracked.',
    className: 'label-meta',
  },
]

/**
 * Reads the resolved value of custom properties off :root, so the swatch
 * labels report what the tokens actually are rather than a copy that can
 * drift out of date.
 */
function useTokenValues(tokens: string[]): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement)
    setValues(
      Object.fromEntries(
        tokens.map((token) => [
          token,
          computed.getPropertyValue(token).trim().toUpperCase(),
        ]),
      ),
    )
  }, [tokens])

  return values
}

export default function StyleGuide() {
  const hexes = useTokenValues(SWATCH_TOKENS)

  return (
    <div className="guide">
      <header className="guide__cover">
        <h1 className="type-feature guide__cover-title">THE LINEUP</h1>
        <p className="label-meta label-meta--wide guide__cover-subtitle">
          Design System — Phase 1
        </p>
      </header>

      <section className="guide__section">
        <h2 className="label-meta label-meta--wide guide__section-label">Logo</h2>
        <p className="type-body guide__section-note">
          Primary wordmark, formalized from the existing homepage nav treatment.
          Archivo Black carries the publication name across every context.
        </p>
        <div className="lockups">
          <div className="lockup lockup--cream">
            <span className="wordmark wordmark--coral">THE LINEUP</span>
          </div>
          <div className="lockup lockup--forest">
            <span className="wordmark wordmark--cream">THE LINEUP</span>
          </div>
          <div className="lockup lockup--mark">
            <span className="wordmark wordmark--coral">TL</span>
          </div>
        </div>
        <p className="type-body guide__section-note guide__section-note--narrow">
          Compact mark for favicon, social avatars, and tight UI spaces where the
          full wordmark does not fit.
        </p>
      </section>

      <section className="guide__section">
        <h2 className="label-meta label-meta--wide guide__section-label">
          Color Palette
        </h2>
        <ul className="palette">
          {SWATCHES.map((swatch) => (
            <li key={swatch.token} className="palette__item">
              <div
                className={`swatch ${swatch.className}${
                  swatch.outlined ? ' swatch--outlined' : ''
                }`}
              />
              <p className="type-card palette__name">{swatch.name}</p>
              <p className="label-meta palette__hex">
                {hexes[swatch.token] ?? ' '}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="guide__section">
        <h2 className="label-meta label-meta--wide guide__section-label">
          Typography
        </h2>
        <p className="type-body guide__section-note">
          Jomolhari is the secondary serif across the system, matching the
          homepage build — used for sidebar reading moments, pull quotes, and
          editorial asides.
        </p>
        <ul className="specimens">
          {SPECIMENS.map((specimen) => (
            <li key={specimen.name} className="specimen">
              <p className={`${specimen.className} specimen__sample`}>Aa</p>
              <p className="type-card specimen__name">{specimen.name}</p>
              <p className="label-meta specimen__spec">{specimen.spec}</p>
              <p className="type-body specimen__usage">{specimen.usage}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
