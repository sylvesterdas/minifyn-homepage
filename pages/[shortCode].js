import { db } from '../lib/firebase-admin';
import InvalidUrl from '../components/InvalidUrl';
import AdRedirect from '../components/AdRedirect';

export async function getServerSideProps(context) {
  const { shortCode } = context.params;

  try {
    const docRef = db.collection('urls').doc(shortCode);
    const doc = await docRef.get();

    if (!doc.exists) {
      return { props: { scenario: 'notFound' } };
    }

    const data = doc.data();
    
    if (data.expiresAt.toDate() < new Date()) {
      return { props: { scenario: 'notFound' } };
    }

    const isAnonymous = data.createdBy === 'anonymous'; // Assuming you have this field
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