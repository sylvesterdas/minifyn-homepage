import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import Loading from '@/components/Loading';
import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRef } from 'react';
import SEO from '@/components/SEO';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => <Loading />
});

const spec = {
  openapi: '3.0.0',
  info: {
    title: 'MiniFyn API',
    version: '1.0.0',
    description: 'API documentation for MiniFyn',
  },
  servers: [
    {
      url: 'https://www.minifyn.com/api',
    },
  ],
  paths: {
    '/shorten': {
      post: {
        summary: 'Shorten a URL',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Shortened URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    shortUrl: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    // Add more API endpoints here
  },
};

export default function ApiDocs() {
  const topAdRef = useRef(null);
  const bottomAdRef = useRef(null);

  useEffect(() => {
    // Function to create and insert ad script
    const createAdScript = (containerRef, script) => {
      if (containerRef.current) {
        // Clear any existing content
        containerRef.current.innerHTML = '';

        // Create and insert atOptions script
        const atOptionsScript = document.createElement('script');
        atOptionsScript.type = 'text/javascript';
        const w = window.innerWidth > 728 ? 728 : window.innerWidth;
        const h = (w * 90/720).toFixed(2)
        atOptionsScript.text = `
          atOptions = {
            'key' : '488ec9084c4757ec8cd696db97ea1df1',
            'format' : 'iframe',
            'height' : ${h},
            'width' : ${w},
            'params' : {}
          };
        `;
        containerRef.current.appendChild(atOptionsScript);

        if (script) {
          // Create and insert invoke script
          const invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          invokeScript.src = '//www.topcpmcreativeformat.com/488ec9084c4757ec8cd696db97ea1df1/invoke.js';
          containerRef.current.appendChild(invokeScript);
        }
      }
    };

    // Create top ad
    createAdScript(topAdRef, true);

    // Create bottom ad
    createAdScript(bottomAdRef, true);

    // Cleanup function
    return () => {
      if (topAdRef.current) topAdRef.current.innerHTML = '';
      if (bottomAdRef.current) bottomAdRef.current.innerHTML = '';
    };
  }, []);

  return (
    <>
      <SEO
        title='API Documentation - MiniFyn'
        description='Comprehensive API documentation for MiniFyn, providing detailed information on endpoints, parameters, and response formats.'
        keywords={["API", "documentation", "MiniFyn", "developers", "software", "integration", "REST API", "JSON"]}
        canonical='https://www.minifyn.com/api-docs' />
      <div className="api-docs-container">
        <div ref={topAdRef} className="max-w-[728px] mx-auto w-full overflow-clip"></div>

        <SwaggerUI spec={spec} />

        <div ref={bottomAdRef} className="max-w-[728px] mx-auto w-full overflow-clip"></div>
      </div>
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    },
  };
}
