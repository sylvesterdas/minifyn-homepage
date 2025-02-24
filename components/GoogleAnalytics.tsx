'use client'

import Script from "next/script"

export default function GoogleAnalytics() {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4MY46Y82PJ" />
      <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4MY46Y82PJ', { debug_mode: true });
          `,
        }}
      />
    </>
  )
}