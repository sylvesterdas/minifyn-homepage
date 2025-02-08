import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MiniFyn Blog - Web Performance & Development Tips',
  description: 'Learn about web performance, JavaScript optimization, and modern development techniques.',
  openGraph: {
    type: 'website',
    siteName: 'MiniFyn Blog',
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}