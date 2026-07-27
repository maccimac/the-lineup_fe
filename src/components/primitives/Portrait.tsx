import './Portrait.css'

type PortraitProps = {
  src: string
  alt: string
}

export default function Portrait({ src, alt }: PortraitProps) {
  return (
    <div className="portrait">
      <img className="portrait__image" src={src} alt={alt} />
    </div>
  )
}
