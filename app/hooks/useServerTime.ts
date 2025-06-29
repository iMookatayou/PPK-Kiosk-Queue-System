'use client'

import { useEffect, useState } from 'react'

interface ServerTime {
  iso: string
  formatted: string
  unix: number
  timezone: string
}

export function useServerTime() {
  const [time, setTime] = useState<ServerTime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch('/api/time')
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        setTime(data)
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาด')
      } finally {
        setLoading(false)
      }
    }

    fetchTime()
  }, [])

  return { time, loading, error }
}
