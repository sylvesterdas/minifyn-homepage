import { ThemeProvider } from './providers/theme-provider'
import { Nav } from '@/components/layout/nav'
import { Sidebar } from '@/components/layout/sidebar'
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-slate-950">
            <div className="flex flex-col h-screen">
              {/* Navbar with subtle gradient */}
              <header className="sticky top-0 z-50 border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/50 backdrop-blur-xl">
                <Nav />
              </header>

              <div className="flex flex-1">
                {/* Sidebar with softer contrast */}
                <Sidebar />

                {/* Main content with balanced contrast */}
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}