import { kv } from '@vercel/kv';
import InvalidUrl from '../components/InvalidUrl';
import AdRedirect from '../components/AdRedirect';

export async function getServerSideProps(context) {
  const { shortCode } = context.params;

  try {
    const data = await kv.get(`url:${shortCode}`);

    if (!data) {
      return { props: { scenario: 'notFound' } };
    }

    const expiresAt = new Date(data.expiresAt);
    
    if (expiresAt < new Date()) {
      return { props: { scenario: 'notFound' } };
    }

    const isAnonymous = data.createdBy === 'anonymous';
    const redirectDelay = isAnonymous ? 7 : 1;

    return {
      props: {
        scenario: 'redirect',
        originalUrl: data.originalUrl,
        isAnonymous,
        redirectDelay
      }
    };
  } catch (error) {
    console.error('Error fetching short URL:', error);
    return { props: { scenario: 'error' } };
  }
}

export default function Redirect({ scenario, originalUrl, isAnonymous, redirectDelay }) {
  if (scenario === 'notFound' || scenario === 'error') {
    return <InvalidUrl />;
  }

  if (scenario === 'redirect') {
    return <AdRedirect originalUrl={originalUrl} isAnonymous={isAnonymous} redirectDelay={redirectDelay} />;
  }

  return null;
}