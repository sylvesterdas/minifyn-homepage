import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

const RefundAndCancellationPage = ({ date }) => {
  return (
    <>
      <Head>
        <title>Refund and Cancellation Policy - MiniFyn</title>
        <meta name="description" content="Learn about MiniFyn's refund and cancellation policy for our URL shortening service." />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Refund and Cancellation Policy</h1>
        <p className="mb-4">Last updated: {date}</p>
        <h2 className="text-2xl font-bold mb-2">Subscriptions</h2>
        <p className="mb-4">MiniFyn offers subscription-based services. You can cancel your subscription at any time through your account settings.</p>
        <h2 className="text-2xl font-bold mb-2">Cancellation</h2>
        <ul className="list-disc list-inside mb-4">
          <li>You can cancel your subscription at any time.</li>
          <li>Your cancellation will take effect at the end of your current billing cycle.</li>
          <li>You will retain access to the service until the end of your current billing period.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Refunds</h2>
        <ul className="list-disc list-inside mb-4">
          <li>MiniFyn does not provide refunds for partial subscription periods.</li>
          <li>In exceptional circumstances, we may consider refund requests on a case-by-case basis.</li>
          <li>To request a refund, please contact our support team at support@minifyn.com.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Free Trial</h2>
        <ul className="list-disc list-inside mb-4">
          <li>If offered, any free trial period will be clearly communicated during sign-up.</li>
          <li>You will not be charged during the free trial period.</li>
          <li>To avoid charges, please cancel before the end of the free trial if you do not wish to continue with a paid subscription.</li>
        </ul>
        <p className="mb-4">We reserve the right to modify this policy at any time. Changes will be effective immediately upon posting to this page.</p>
        <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
        <p>If you have any questions about our Refund and Cancellation Policy, please contact us at billing@minifyn.com.</p>
      </div>
    </>
  );
};

export default RefundAndCancellationPage;

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      date: moment().format('YYYY-MM-DD')
    },
  };
}
