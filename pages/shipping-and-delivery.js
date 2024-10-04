import SEO from '@/components/SEO';
import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ShippingAndDeliveryPage = ({ date }) => {
  return (
    <>
      <SEO
        title='Shipping and Delivery Policy - MiniFyn'
        description='Information about MiniFyn&apos;s shipping and delivery policy for our digital URL shortening service.'
        canonical='https://www.minifyn.com/shipping-and-delivery'
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Shipping and Delivery Policy</h1>
        <p className="mb-4">Last updated: {date}</p>
        <h2 className="text-2xl font-bold mb-2">Digital Service</h2>
        <p className="mb-4">MiniFyn is a Software as a Service (SaaS) platform providing URL shortening and analytics services. As such, we do not ship physical products or handle deliveries.</p>
        <h2 className="text-2xl font-bold mb-2">Service Activation</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Upon successful subscription or account creation, our services are instantly activated.</li>
          <li>There is no shipping or delivery time associated with our digital services.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Service Availability</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Our services are generally available 24/7, subject to any necessary maintenance or unforeseen technical issues.</li>
          <li>We strive to maintain a high level of service uptime and availability.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Technical Requirements</h2>
        <ul className="list-disc list-inside mb-4">
          <li>To access and use MiniFyn services, you need a device with internet access and a modern web browser.</li>
          <li>Detailed technical requirements and compatible browsers can be found in our FAQs or by contacting our support team.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Support</h2>
        <p className="mb-4">If you experience any issues accessing our services or have any questions, please contact our support team at support@minifyn.com.</p>
        <p><em>Note: This Shipping and Delivery Policy exists to comply with e-commerce regulations. As MiniFyn is a digital service, no physical shipping or delivery occurs.</em></p>
      </div>
    </>
  );
};

export default ShippingAndDeliveryPage;

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      date: moment().format('YYYY-MM-DD')
    },
  };
}
