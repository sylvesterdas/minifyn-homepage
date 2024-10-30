import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Play, Lock } from 'lucide-react';
import SEO from '@/components/SEO';
import { Card,  CardContent, CardHeader } from '@/components/ui/card';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "MiniFyn API Documentation",
  "description": "Complete API documentation for MiniFyn URL shortener service",
  "keywords": "API, URL shortener, MiniFyn, REST API, developer documentation",
  "author": {
    "@type": "Organization",
    "name": "MiniFyn"
  }
};

const getLimits = async () => {
  const { getSubscriptionLimits } = await import('@/lib/services/subscriptionService');
  const freeLimits = await getSubscriptionLimits('free');
  const proLimits = await getSubscriptionLimits('pro');

  return {
    '/api/v1/urls': {
      method: 'POST',
      auth: 'API Key',
      description: 'Create one or more short URLs',
      request: {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'your_api_key'
        },
        body: {
          urls: [{
            url: 'string (required)',
            title: 'string (optional, max 100 chars)',
            description: 'string (optional, max 500 chars)'
          }]
        }
      },
      response: {
        success: [{
          shortUrl: 'string',
          shortCode: 'string',
          originalUrl: 'string',
          expiresAt: 'timestamp'
        }]
      },
      limits: {
        free: {
          batchSize: `${freeLimits.batchSize} URLs per request`,
          monthly: `${freeLimits.apiCalls} requests`
        },
        pro: {
          batchSize: `${proLimits.batchSize} URLs per request`,
          monthly: `${proLimits.apiCalls} requests`
        }
      }
    },
    '/api/v1/urls/batch': {
      method: 'POST',
      auth: 'API Key',
      description: 'Perform batch operations on URLs',
      request: {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'your_api_key'
        },
        body: {
          action: 'string (delete|details)',
          shortCodes: 'string[]'
        }
      }
    },
    '/api/v1/urls/{shortCode}': {
      method: 'GET|DELETE',
      auth: 'API Key',
      description: 'Get or delete a specific URL',
      query: {
        analytics: 'boolean (optional, includes basic analytics)'
      }
    },
    '/api/v1/analytics/{shortCode}': {
      method: 'GET',
      auth: 'API Key',
      description: 'Get URL analytics',
      query: {
        days: 'number (optional, default: 30, max: 90)'
      },
      response: {
        success: {
          totalClicks: 'number',
          clicksByDate: 'object',
          ...(proLimits.apiCalls > 500 ? {
            devices: 'object',
            browsers: 'object',
            countries: 'object'
          } : {})
        }
      }
    }
  };
};

const EndpointCard = ({ path, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-teal px-2 py-1 text-white text-sm rounded">{data.method}</span>
            <code className="text-dark-gray">{path}</code>
            {data.auth && <Lock className="w-4 h-4 text-coral" />}
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p>{data.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Usage Limits</h3>
              <ul className="list-disc pl-4">
                <li>Free: {data.limits.free}</li>
                <li>Pro: {data.limits.pro}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Request</h3>
              <pre className="bg-light-gray p-4 rounded overflow-x-auto">
                {JSON.stringify(data.request, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Response</h3>
              <pre className="bg-light-gray p-4 rounded overflow-x-auto">
                {JSON.stringify(data.response, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Try It</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter URL to shorten"
                  className="flex-1 p-2 border rounded"
                />
                <button className="flex items-center space-x-1 bg-teal text-white px-4 py-2 rounded hover:bg-opacity-90">
                  <Play className="w-4 h-4" />
                  <span>Try</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const ApiDocs = ({ endpointData }) => {
  const jsonLd = useMemo(() => JSON.stringify(structuredData), []);

  return <>
      <SEO
        title="API Documentation - MiniFyn URL Shortener"
        description="Comprehensive API documentation for MiniFyn URL shortener. Learn how to integrate URL shortening into your applications."
        canonical="https://www.minifyn.com/api-docs"
        openGraph={{
          title: "MiniFyn API Documentation",
          description: "Integrate URL shortening into your applications with MiniFyn API",
          url: "https://www.minifyn.com/api-docs"
        }}
      />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2">MiniFyn API Documentation</h1>
        <p className="text-dark-gray">Integrate URL shortening into your applications</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        <p className="mb-2">All API requests require an API key to be included in the header:</p>
        <pre className="bg-light-gray p-4 rounded">
          X-API-Key: your_api_key
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
        {Object.entries(endpointData).map(([path, data]) => (
          <EndpointCard key={path} path={path} data={data} />
        ))}
      </div>
    </div>
  </>;
};

export default ApiDocs;

export async function getStaticProps() {
  const endpointData = await getLimits();
  
  return {
    props: { endpointData },
    revalidate: 3600 // Revalidate every hour
  };
}