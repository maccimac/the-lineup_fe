import { useEffect, useState } from 'react'
import { checkHealth, type HealthResult } from '../lib/api'
import './BackendStatus.css'

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
    return <span className="status label-meta status-pending">Checking…</span>
  }

  if (result.status === 'ok') {
    return <span className="status label-meta status-ok">Connected</span>
  }

  return (
    <span className="status label-meta status-down" title={result.reason}>
      Backend unreachable
    </span>
  )
}
