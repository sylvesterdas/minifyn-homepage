import { db } from '../lib/firebase-admin';

export async function getServerSideProps(context) {
  const { shortCode } = context.params;

  const docRef = db.collection('urls').doc(shortCode);
  const doc = await docRef.get();

  if (!doc.exists) {
    return { notFound: true };
  }

  const data = doc.data();
  
  if (data.expiresAt.toDate() < new Date()) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: data.originalUrl,
      permanent: false,
    },
  };
}

export default function Redirect() {
  return null;
}