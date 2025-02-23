export default function DocsPage() {
  return (
    <div className="md:p-6 min-h-screen text-white max-sm:text-xs">
      <section className="p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">API Documentation</h1>
        <h2 className="text-xl font-semibold mb-2">Shorten URL Endpoint</h2>
        <p className="mb-2">Endpoint: <code className="bg-gray-700 p-1 rounded">https://www.minifyn.com/api/shorten</code></p>
        <p className="mb-4">Description: This endpoint allows you to shorten a given URL.</p>
        <h4 className="text-lg font-semibold mb-2">Request</h4>
        <p className="mb-2">Method: <code className="bg-gray-700 p-1 rounded">POST</code></p>
        <p className="mb-2">Headers:</p>
        <ul className="list-disc list-inside mb-2">
          <li className="mb-2"><code className="bg-gray-700 p-1 rounded">Content-Type: application/json</code></li>
          <li className="mb-2"><code className="bg-gray-700 p-1 rounded">Authorization: Bearer &lt;token&gt;</code></li>
        </ul>
        <p className="mb-2">Body:</p>
        <pre className="bg-gray-700 p-4 rounded mb-4">
          <code>
{`{
  "url": "<urlString>"
}`}
          </code>
        </pre>
        <h4 className="text-lg font-semibold mb-2">Response</h4>
        <p className="mb-2">Success (200):</p>
        <pre className="bg-gray-700 p-4 rounded mb-4">
          <code>
{`{
  "message": "URL validation successful",
  "shortUrl": "https://mnfy.in/<shortCode>"
}`}
          </code>
        </pre>
        <p className="mb-2">Error (400):</p>
        <pre className="bg-gray-700 p-4 rounded mb-4">
          <code>
{`{
  "error": "URL is required"
}`}
          </code>
        </pre>
        <p className="mb-2">Error (401):</p>
        <pre className="bg-gray-700 p-4 rounded mb-4">
          <code>
{`{
  "error": "Unauthorized"
}`}
          </code>
        </pre>
        <p className="mb-2">Error (429):</p>
        <pre className="bg-gray-700 p-4 rounded mb-4">
          <code>
{`{
  "error": "Rate limit exceeded",
  "limits": {
    "remaining": number,
    "reset": number
  }
}`}
          </code>
        </pre>
        <p className="mb-2">Error (500):</p>
        <pre className="bg-gray-700 p-4 rounded">
          <code>
{`{
  "error": "Internal server error"
}`}
          </code>
        </pre>
      </section>
    </div>
  );
}
