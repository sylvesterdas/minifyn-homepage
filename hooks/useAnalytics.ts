'use client'

type EventParams = {
  action: string
  category: string
  label?: string
  value?: number
}

export const useAnalytics = () => {
  const trackEvent = ({ action, category, label, value }: EventParams) => {
    if (typeof window.gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }
  }

  const trackPageView = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
      gtag('config', 'G-4MY46Y82PJ', {
        page_path: url
      })
    }
  }

  return { trackEvent, trackPageView }
}
