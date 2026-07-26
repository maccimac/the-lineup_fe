import { useEffect, useState } from 'react'
import { checkHealth, type HealthResult } from '../lib/api'

export default function BackendStatus() {
  const [result, setResult] = useState<HealthResult | null>(null)

  useEffect(() => {
    let active = true
    checkHealth().then((next) => {
      if (active) setResult(next)
    })
    return () => {
      active = false
    }
  }, [])

  if (result === null) {
    return <span className="status status-pending">Checking…</span>
  }

  if (result.status === 'ok') {
    return <span className="status status-ok">Connected</span>
  }

  return (
    <span className="status status-down" title={result.reason}>
      Backend unreachable
    </span>
  )
}
