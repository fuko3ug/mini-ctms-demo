'use client'

import { useEffect, useState } from 'react'
import { type DemoData, getDemoData } from '@/lib/demoStore'

export function useDemoData() {
  const [data, setData] = useState<DemoData | null>(null)

  useEffect(() => {
    setData(getDemoData())

    const refresh = () => setData(getDemoData())
    window.addEventListener('demo-data-changed', refresh)
    window.addEventListener('storage', refresh)

    return () => {
      window.removeEventListener('demo-data-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return data
}
