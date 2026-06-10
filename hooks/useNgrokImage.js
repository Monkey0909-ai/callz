import { useState, useEffect } from "react"

export function useNgrokImage(url) {
  const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!url) {
      setSrc(null)
      setError(false)
      return
    }

    let objectUrl = null
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(false)
      setSrc(null)
      try {
        const res = await fetch(url, {
          headers: { "ngrok-skip-browser-warning": "true" },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const blob = await res.blob()
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [url])

  return { src, loading, error }
}