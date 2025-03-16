'use client'

export const useAnalytics = () => {
  const trackEvent = ({ action, category, label, value }) => {
    if (typeof window.gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }
  }

  const trackPageView = (url) => {
    if (typeof window.gtag !== 'undefined') {
      gtag('config', 'G-4MY46Y82PJ', {
        page_path: url
      })
    }
  }

  return { trackEvent, trackPageView }
}
