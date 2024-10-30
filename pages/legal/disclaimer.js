import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Disclaimer = () => {
  return (
    <LegalPageLayout
      title="Disclaimer"
      description="Read MiniFyn&apos;s disclaimer to understand the terms of using our URL shortening service."
      canonical="disclaimer"
      lastUpdated="October 25, 2024"
    >
      <h2 className="text-2xl font-bold mb-2">1. No Warranties</h2>
      <p className="mb-4">MiniFyn is provided &quot;as is&quot; without any express or implied warranties. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability of the service.</p>
      <h2 className="text-2xl font-bold mb-2">2. Use at Your Own Risk</h2>
      <p className="mb-4">Any reliance you place on MiniFyn is strictly at your own risk. We will not be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, arising from the use of our service.</p>
      <h2 className="text-2xl font-bold mb-2">3. External Links</h2>
      <p className="mb-4">Our service may contain links to external websites. We have no control over the content and nature of these sites and are not responsible for their content or practices.</p>
      <h2 className="text-2xl font-bold mb-2">4. Changes to This Disclaimer</h2>
      <p className="mb-4">We may update this disclaimer from time to time. We advise you to review this page periodically for any changes.</p>
      <h2 className="text-2xl font-bold mb-2">5. Contact Us</h2>
      <p>If you have any questions about this disclaimer, please contact us at legal@minifyn.com.</p>
    </LegalPageLayout>
  );
};

export default Disclaimer;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}