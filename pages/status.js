import SEO from '@/components/SEO';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getSystemMetrics } from '@/lib/statusService';
import { useState, useEffect } from 'react';

const StatusIndicator = ({ status }) => {
  if (status === 'operational') {
    return (
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span className="ml-2 text-sm text-green-500">Operational</span>
      </div>
    );
  }
  if (status === 'degraded') {
    return (
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <span className="ml-2 text-sm text-yellow-500">Degraded</span>
      </div>
    );
  }
  return (
    <div className="flex items-center">
      <XCircle className="h-5 w-5 text-red-500" />
      <span className="ml-2 text-sm text-red-500">Down</span>
    </div>
  );
};

const StatusPage = ({ initialMetrics }) => {
  const { t } = useTranslation('common');
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };

    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const allOperational = Object.values(metrics?.services || {})
    .every(service => service.status === 'operational');

  return (
    <>
      <SEO
        title="System Status - MiniFyn"
        description="Check the current status of MiniFyn's URL shortening services"
        canonical="https://www.minifyn.com/status"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            System Status
          </h1>
          <p className="text-lg text-gray-600">
            {allOperational ? 'All systems are operational' : 'Some systems are experiencing issues'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium">Current Status</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {metrics?.services && Object.entries(metrics.services).map(([name, data]) => (
              <div 
                key={name} 
                className="px-4 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  {data.latency && (
                    <p className="text-sm text-gray-500">
                      Latency: {data.latency}ms
                    </p>
                  )}
                </div>
                <StatusIndicator status={data.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data refreshed automatically every 60 seconds</p>
          <p className="mt-2">
            Having issues? Contact us at{' '}
            <a 
              href="mailto:support@minifyn.com"
              className="text-blue-500 hover:text-blue-600"
            >
              support@minifyn.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default StatusPage;

export async function getStaticProps({ locale }) {
  const metrics = await getSystemMetrics();
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      initialMetrics: metrics || null,
    },
    revalidate: 300, // Revalidate every 5 minutes
  };
}