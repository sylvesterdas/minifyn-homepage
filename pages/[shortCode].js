import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import InvalidUrl from '../components/InvalidUrl';
import AdRedirect from '../components/AdRedirect';
import { getShortUrl } from '../lib/cache';
import { incrementClicks, getClickCount } from '../lib/analytics';
import { getUserCountry } from '../lib/geolocation';

export async function getServerSideProps(context) {
  const { shortCode } = context.params;
  const { locale } = context;

  try {
    const urlData = await getShortUrl(shortCode);
    const userCountry = await getUserCountry(context.req); // Implement this function

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

    await incrementClicks(shortCode, context.req);

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
        description: urlData.description,
        adClientId: process.env.GOOGLE_AD_CLIENT_ID, // Add this
        adSlotId: process.env.GOOGLE_AD_SLOT_ID, // Add this
        userCountry: userCountry
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

function Redirect({ scenario, originalUrl, isAnonymous, redirectDelay, clicks, title, description, adClientId, adSlotId }) {
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
      adClientId={adClientId}
      adSlotId={adSlotId}
      userCountry={userCountry}
      t={t} 
    />;
  }

  return null;
}

export default Redirect;