import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InvalidUrl from '../components/InvalidUrl';
import AdRedirect from '../components/AdRedirect';
import db from '../lib/db';

export async function getServerSideProps(context) {
  const { shortCode } = context.params;
  const { locale } = context;

  try {
    const result = await db.query(
      'SELECT original_url, created_at, expires_at, clicks FROM short_urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return { 
        props: { 
          ...(await serverSideTranslations(locale, ['common'])),
          scenario: 'notFound' 
        } 
      };
    }

    const data = result.rows[0];
    const expiresAt = new Date(data.expires_at);
    
    if (expiresAt < new Date()) {
      return { 
        props: { 
          ...(await serverSideTranslations(locale, ['common'])),
          scenario: 'expired' 
        } 
      };
    }

    // Increment the click count
    await db.query(
      'UPDATE short_urls SET clicks = clicks + 1 WHERE short_code = $1',
      [shortCode]
    );

    const createdAt = new Date(data.created_at);
    const isAnonymous = createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000);
    const redirectDelay = isAnonymous ? 7 : 1;

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        scenario: 'redirect',
        originalUrl: data.original_url,
        isAnonymous,
        redirectDelay,
        clicks: data.clicks + 1
      }
    };
  } catch (error) {
    console.error('Error fetching short URL:', error);
    return { 
      props: { 
        ...(await serverSideTranslations(locale, ['common'])),
        scenario: 'error' 
      } 
    };
  }
}

function Redirect({ scenario, originalUrl, isAnonymous, redirectDelay, clicks }) {
  const { t } = useTranslation('common');

  if (scenario === 'notFound' || scenario === 'expired') {
    return <InvalidUrl scenario={scenario} t={t} />;
  }

  if (scenario === 'error') {
    return <InvalidUrl scenario="error" t={t} />;
  }

  if (scenario === 'redirect') {
    return <AdRedirect originalUrl={originalUrl} isAnonymous={isAnonymous} redirectDelay={redirectDelay} clicks={clicks} t={t} />;
  }

  return null;
}

export default Redirect;