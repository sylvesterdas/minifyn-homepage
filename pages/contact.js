import SEO from '@/components/SEO';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ContactPage = () => {
  return (
    <>
      <SEO 
        title='Contact MiniFyn - We&apos;re Here to Help'
        description='Get in touch with MiniFyn for support, feedback, or inquiries about our URL shortening service.'
        canonical='https://www.minifyn.com/contact'
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">We value your feedback and are here to assist you with any questions or concerns you may have about MiniFyn.</p>
        <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Email:</strong> support@minifyn.com</li>
          <li><strong>Response Time:</strong> We strive to respond to all inquiries within 24-48 hours during business days.</li>
        </ul>
        <h2 className="text-2xl font-bold mb-2">Feedback</h2>
        <p className="mb-4">Your feedback is crucial in helping us improve our service. If you have suggestions or encounter any issues, please don&apos;t hesitate to reach out.</p>
        <p><em>Note: MiniFyn is a SaaS platform and does not have a physical office location.</em></p>
      </div>
    </>
  );
};

export default ContactPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
