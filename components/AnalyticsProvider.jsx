'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { useAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsProvider({ children }) {
  const pathname = usePathname()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return children
}