import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

const TermsAndConditionsPage = ({ date }) => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - MiniFyn</title>
        <meta name="description" content="Read MiniFyn's terms and conditions for using our URL shortening service." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-4">Last updated: {date}</p>
        <h2 className="text-2xl font-bold mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">By using MiniFyn, you agree to these Terms and Conditions. If you disagree, please do not use our service.</p>
        <h2 className="text-2xl font-bold mb-2">2. Description of Service</h2>
        <p className="mb-4">MiniFyn provides URL shortening and analytics services. We reserve the right to modify or discontinue the service at any time.</p>
        <h2 className="text-2xl font-bold mb-2">3. User Responsibilities</h2>
        <p className="mb-4">You are responsible for all activity that occurs under your account. Do not use MiniFyn for any illegal or unauthorized purpose.</p>
        <h2 className="text-2xl font-bold mb-2">4. Intellectual Property</h2>
        <p className="mb-4">The MiniFyn service and its original content are and will remain the exclusive property of MiniFyn.</p>
        <h2 className="text-2xl font-bold mb-2">5. Limitation of Liability</h2>
        <p className="mb-4">MiniFyn shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
        <h2 className="text-2xl font-bold mb-2">6. Changes to Terms</h2>
        <p className="mb-4">We reserve the right to modify these Terms at any time. Please review these terms periodically.</p>
        <h2 className="text-2xl font-bold mb-2">7. Governing Law</h2>
        <p className="mb-4">These Terms shall be governed by the laws of India.</p>
        <h2 className="text-2xl font-bold mb-2">8. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at legal@minifyn.com.</p>
      </div>
    </>
  );
};

export default TermsAndConditionsPage;

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      date: moment().format('YYYY-MM-DD')
    },
  };
}