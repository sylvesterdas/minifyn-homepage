import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InvalidUrl from '../components/InvalidUrl';
import AdRedirect from '../components/AdRedirect';
import { getShortUrl } from '../lib/cache';
import { incrementClicks, getClickCount } from '../lib/analytics';

export async function getServerSideProps(context) {
  const { shortCode } = context.params;
  const { locale } = context;

  try {
    const urlData = await getShortUrl(shortCode);

    if (!urlData) {
      return { 
        props: { 
          ...(await serverSideTranslations(locale, ['common'])),
          scenario: 'notFound' 
        } 
      };
    }

    const { original_url, created_at, expires_at, is_active, subscription_type } = urlData;
    
    if (!is_active || (expires_at && new Date(expires_at) < new Date())) {
      return { 
        props: { 
          ...(await serverSideTranslations(locale, ['common'])),
          scenario: 'expired' 
        } 
      };
    }

    // Increment the click count
    await incrementClicks(shortCode, context.req);

    const createdAt = new Date(created_at);
    const isAnonymous = subscription_type === 'LinkFree User';
    const redirectDelay = isAnonymous ? 7 : 1;

    const clicks = await getClickCount(shortCode);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        scenario: 'redirect',
        originalUrl: original_url,
        isAnonymous,
        redirectDelay,
        clicks,
        title: urlData.title,
        description: urlData.description
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

function Redirect({ scenario, originalUrl, isAnonymous, redirectDelay, clicks, title, description }) {
  const { t } = useTranslation('common');

  if (scenario === 'notFound' || scenario === 'expired') {
    return <InvalidUrl scenario={scenario} t={t} />;
  }

  if (scenario === 'error') {
    return <InvalidUrl scenario="error" t={t} />;
  }

  if (scenario === 'redirect') {
    return <AdRedirect 
      originalUrl={originalUrl} 
      isAnonymous={isAnonymous} 
      redirectDelay={redirectDelay} 
      clicks={clicks} 
      title={title}
      description={description}
      t={t} 
    />;
  }

  return null;
}

export default Redirect;