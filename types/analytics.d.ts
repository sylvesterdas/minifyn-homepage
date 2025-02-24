interface Window {
  gtag: (command: string, params: any, options?: any) => void
  dataLayer: any[]
}

declare const gtag: Window['gtag']