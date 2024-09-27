import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

const PrivacyPolicyPage = ({ date }) => {
  return (
    <>
      <Head>
        <title>Privacy Policy - MiniFyn</title>
        <meta name="description" content="Read MiniFyn's privacy policy to understand how we collect, use, and protect your information." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4" suppressHydrationWarning>Last updated: {date}</p>
        <h2 className="text-2xl font-bold mb-2">1. Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly to us, such as when you create an account or use our services. This may include your name, email address, and usage data.</p>
        <h2 className="text-2xl font-bold mb-2">2. How We Use Information</h2>
        <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you.</p>
        <h2 className="text-2xl font-bold mb-2">3. Information Sharing and Disclosure</h2>
        <p className="mb-4">We do not share personal information with companies, organizations, or individuals outside of MiniFyn except in the following cases:</p>
        <ul className="list-disc list-inside mb-4">
          <li>With your consent</li>
          <li>For legal reasons</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">4. Data Security</h2>
        <p className="mb-4">We work hard to protect MiniFyn and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
        <h2 className="text-2xl font-bold mb-2">5. Changes to This Policy</h2>
        <p className="mb-4">We may change this privacy policy from time to time. We will post any privacy policy changes on this page.</p>
        <h2 className="text-2xl font-bold mb-2">6. Contact Us</h2>
        <p>If you have any questions about this privacy policy, please contact us at privacy@minifyn.com.</p>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      date: moment().format('YYYY-MM-DD')
    },
  };
}
