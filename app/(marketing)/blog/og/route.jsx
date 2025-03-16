import { ImageResponse } from 'next/og'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title')
  const tags = searchParams.get('tags')?.split(',') || []
  const hue = Math.abs((title?.length || 0) * 10) % 360

  const generateBase64Pattern = () => {
    const pattern = `
      <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
          ${Array(2).fill('').map((_, i) => `
            <circle cx="${80 + i*20}" cy="${80 + i*20}" r="${40 + i*5}"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="4"
            />
          `).join('')}
        </pattern>
        </defs>
        <rect width="150" height="150" fill="url(#pattern)" />
      </svg>
    `.trim()

    return `data:image/svg+xml;base64,${Buffer.from(pattern).toString('base64')}`
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `hsl(${hue}, 50%, 25%)`,
          backgroundImage: `url("${generateBase64Pattern()}")`,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '52px',
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '600',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          minifyn.com
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            padding: '80px',
            maxWidth: '85%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 52,
              color: 'white',
              fontWeight: '900',
              lineHeight: 1.2,
              textShadow: '0 4px 12px rgba(0,0,0,0.4)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {tags.slice(0,3).map((tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  color: '#93C5FD',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontSize: 22,
                  fontWeight: '500',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(59, 130, 246, 0.6)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}