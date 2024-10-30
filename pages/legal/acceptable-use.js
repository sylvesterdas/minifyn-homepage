import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function AcceptableUse() {
  return (
    <LegalPageLayout
      title="Acceptable Use Policy"
      description="Guidelines for responsible use of MiniFyn&apos;s services"
      lastUpdated="October 25, 2024"
      canonical="acceptable-use"
    >
      <h2 className="text-2xl font-bold mb-2">Purpose</h2>
      <p className="mb-4">
        This policy outlines acceptable usage of MiniFyn&apos;s URL shortening service. 
        We&apos;re committed to providing reliable service while ensuring user safety 
        and maintaining trust.
      </p>

      <h2 className="text-2xl font-bold mb-2">URL Content Guidelines</h2>
      <p className="mb-4 font-semibold">
        When using MiniFyn, don&apos;t create shortened URLs that:
      </p>
      <ul className='list-disc m-6 mt-0'>
        <li>Impersonate others or mislead users</li>
        <li>Distribute malware or harmful code</li>
        <li>Promote unauthorized access to systems</li>
        <li>Share copyrighted content without permission</li>
        <li>Link to phishing or scam websites</li>
        <li>Violate any applicable laws</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">Service Usage</h2>
      <p className="mb-4 font-semibold">Users must:</p>
      <ul className='list-disc m-6 mt-0'>
        <li>Stay within their plan&apos;s usage limits</li>
        <li>Use appropriate rate limiting for API requests</li>
        <li>Maintain secure password practices</li>
        <li>Report security vulnerabilities responsibly</li>
        <li>Keep API credentials confidential</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">Business Usage</h2>
      <p className="mb-4 font-semibold">
        Business users should:
      </p>
      <ul className='list-disc m-6 mt-0'>
        <li>Use custom domains for branded links</li>
        <li>Implement proper error handling</li>
        <li>Monitor their URL performance</li>
        <li>Keep their contact information updated</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">Enforcement</h2>
      <p className="mb-4 font-semibold">
        MiniFyn reserves the right to:
      </p>
      <ul className='list-disc m-6 mt-0'>
        <li>Investigate potential violations</li>
        <li>Remove URLs that violate this policy</li>
        <li>Suspend or terminate accounts</li>
        <li>Cooperate with legal authorities when required</li>
      </ul>
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
