import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Terms = () => {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      description="Read MiniFyn&apos;s terms and conditions for using our URL shortening service."
      canonical="terms"
      lastUpdated="October 25, 2024"
    >
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
    </LegalPageLayout>
  );
};

export default Terms;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}