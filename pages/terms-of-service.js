/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Terms of Service - MiniFyn</title>
        <meta name="description" content="MiniFyn Terms of Service" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">Last updated: 05/09/2024</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p>By accessing or using MiniFyn's services, you agree to be bound by these Terms of Service.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
        <p>MiniFyn provides URL shortening services. We reserve the right to modify or discontinue the service at any time.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
        <p>You are responsible for all activity that occurs under your account. You agree not to use the service for any illegal or unauthorized purpose.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
        <p>The service and its original content, features, and functionality are owned by MiniFyn and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
        <p>MiniFyn shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Contact</h2>
        <p>If you have any questions about these Terms, please contact us at: dasswizard@gmail.com</p>
      </section>
    </div>
  );
};

export default TermsOfService;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
