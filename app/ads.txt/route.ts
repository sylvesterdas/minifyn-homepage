export async function GET() {
  return new Response(
    'google.com, pub-4781198854082500, DIRECT, f08c47fec0942fa0',
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  )
}