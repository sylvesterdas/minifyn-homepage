import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function DMCA() {
  return (
    <LegalPageLayout
      title="DMCA Policy"
      description="MiniFyn&apos;s Digital Millennium Copyright Act policy and procedures"
      lastUpdated="October 25, 2024"
    >
      <h2 className="text-2xl font-bold mb-2">Overview</h2>
      <p className="mb-4">
        MiniFyn respects intellectual property rights and expects users to do the same. 
        This policy outlines how we handle Digital Millennium Copyright Act (DMCA) notices.
      </p>

      <h2 className="text-2xl font-bold mb-2">Filing a DMCA Notice</h2>
      <p className="mb-4">
        To report copyright infringement, send a notice containing:
      </p>
      <ul className='list-disc m-6 mt-0'>
        <li>Physical or electronic signature of the copyright owner</li>
        <li>Description of the copyrighted work</li>
        <li>The MiniFyn shortened URL in question</li>
        <li>Your contact information</li>
        <li>Statement of good faith belief in infringement</li>
        <li>Statement of accuracy under penalty of perjury</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">Counter-Notice Procedure</h2>
      <p className="mb-4">
        If you believe your content was wrongly removed, you may submit a counter-notice including:
      </p>
      <ul className='list-disc m-6 mt-0'>
        <li>Your physical or electronic signature</li>
        <li>Identification of removed content</li>
        <li>Statement under penalty of perjury</li>
        <li>Consent to local federal court jurisdiction</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">Send Notices To</h2>
      <p className="mb-4">
        Email: dmca@minifyn.com<br />
        Response Time: 2-5 business days
      </p>

      <h2 className="text-2xl font-bold mb-2">Repeat Infringers</h2>
      <p className="mb-4">
        We maintain a policy to terminate accounts of repeat infringers. Users who 
        receive multiple valid DMCA notices may have their accounts suspended or terminated.
      </p>

      <h2 className="text-2xl font-bold mb-2">Good Faith</h2>
      <p className="mb-4">
        MiniFyn processes DMCA notices in good faith. False claims may lead to liability 
        under Section 512(f) of the DMCA.
      </p>
    </LegalPageLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
