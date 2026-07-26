const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export type HealthResult =
  | { status: 'ok' }
  | { status: 'unreachable'; reason: string }

/**
 * Pings the backend's health endpoint. The Java backend doesn't exist yet, so
 * this is expected to resolve to `unreachable` for now — it never throws.
 */
export async function checkHealth(): Promise<HealthResult> {
  try {
    const response = await fetch(`${baseUrl}/api/health`)
    if (!response.ok) {
      return { status: 'unreachable', reason: `HTTP ${response.status}` }
    }
    return { status: 'ok' }
  } catch (error) {
    return {
      status: 'unreachable',
      reason: error instanceof Error ? error.message : 'Network error',
    }
  }
}
