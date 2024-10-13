import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import Loading from '@/components/Loading';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
  return <SwaggerUI spec={spec} />;
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    },
  };
}
