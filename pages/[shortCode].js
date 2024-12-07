import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InvalidUrl from '../components/InvalidUrl';
import AdRedirect from '../components/AdRedirect';
import { getShortUrl } from '../lib/cache';
import { incrementClicks } from '../lib/analytics';

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

    const { original_url, expires_at, is_active, subscription_type } = urlData;

    if (!is_active || new Date() > new Date(expires_at)) {
      return { 
        props: { 
          ...(await serverSideTranslations(locale, ['common'])),
          scenario: 'expired' 
        } 
      };
    }

    await incrementClicks(shortCode, context.req);

    let redirectDelay = 7;

    switch(subscription_type) {
      case 'pro':
        redirectDelay = 1;
        break;
      case 'free':
        redirectDelay = 5;
        break;
      case 'anonymous':
      default:
        redirectDelay = 7;
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        scenario: 'redirect',
        originalUrl: original_url,
        redirectDelay,
        title: urlData.title,
        description: urlData.description,
        adClientId: process.env.GOOGLE_AD_CLIENT_ID, // Add this
        adSlotId: process.env.GOOGLE_AD_SLOT_ID, // Add this
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

function Redirect({ scenario, originalUrl, isAnonymous, redirectDelay, clicks, title, description, adClientId, adSlotId, userCountry }) {
  const { t } = useTranslation('common');

  if (scenario === 'notFound' || scenario === 'expired' || scenario === 'error') {
    return <InvalidUrl scenario={scenario} t={t} adClientId={adClientId} adSlotId={adSlotId} />;
  }

  if (scenario === 'redirect') {
    return <AdRedirect 
      originalUrl={originalUrl} 
      redirectDelay={redirectDelay} 
      clicks={clicks} 
      title={title}
      description={description}
      adClientId={adClientId}
      adSlotId={adSlotId}
      userCountry={userCountry}
      t={t} 
    />;
  }

  return null;
}

export default Redirect;