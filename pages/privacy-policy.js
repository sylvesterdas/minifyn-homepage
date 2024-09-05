import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Privacy Policy - MiniFyn</title>
        <meta name="description" content="MiniFyn Privacy Policy" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">Last updated: 05/09/2024</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Information Collection and Use</h2>
        <p>MiniFyn collects only the information that is required to run our services. We do not share any personal information with anyone.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Data Storage and Security</h2>
        <p>We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Cookies and Tracking Technologies</h2>
        <p>We may use cookies and similar tracking technologies to enhance your experience on our website.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. User Rights</h2>
        <p>You have the right to access, correct, or delete your personal information. Please contact us for any such requests.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: dasswizard@gmail.com</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
