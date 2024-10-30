import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Privacy = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Read MiniFyn&apos;s privacy policy to understand how we collect, use, and protect your information."
      canonical="privacy"
      lastUpdated="October 25, 2024"
    >
      <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
      <p className="mb-4">MiniFyn (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>

      <h2 className="text-2xl font-bold mb-2">2. Information We Collect</h2>
      <p className="mb-4">We collect information you provide directly to us, such as:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Personal Information: name, email address, IP address</li>
        <li>Usage Data: how you interact with our service</li>
        <li>Device Information: browser type, operating system</li>
        <li>Cookies and Similar Technologies: we use these to enhance your experience and collect usage data</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">3. How We Use Your Information</h2>
      <p className="mb-4">We use the information we collect to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send you technical notices, updates, security alerts, and support messages</li>
        <li>Respond to your comments, questions, and customer service requests</li>
        <li>Monitor and analyze trends, usage, and activities in connection with our service</li>
        <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
        <li>Personalize and improve the service and provide advertisements, content, or features that match user profiles or interests</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">4. Legal Basis for Processing Personal Data Under GDPR</h2>
      <p className="mb-4">We process your personal data under the following legal bases:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Consent: You have given us permission to process your personal data for specific purposes</li>
        <li>Performance of a Contract: Processing is necessary for a contract we have with you</li>
        <li>Legal Obligations: Processing is necessary for us to comply with the law</li>
        <li>Legitimate Interests: Processing is necessary for our legitimate interests or those of a third party</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">5. Data Retention</h2>
      <p className="mb-4">We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>

      <h2 className="text-2xl font-bold mb-2">6. Data Transfer</h2>
      <p className="mb-4">Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. If you are located outside the United States and choose to provide information to us, please note that we transfer the data to the United States and process it there.</p>

      <h2 className="text-2xl font-bold mb-2">7. Your Data Protection Rights Under GDPR</h2>
      <p className="mb-4">If you are a resident of the European Economic Area (EEA), you have certain data protection rights. MiniFyn aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us.</p>

      <h2 className="text-2xl font-bold mb-2">8. Your Rights Under CCPA</h2>
      <p className="mb-4">If you are a California resident, you have the right to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Request disclosure of the personal information we collect, use, disclose, and sell about you</li>
        <li>Request the deletion of your personal information</li>
        <li>Opt-out of the sale of your personal information</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">9. Use of Cookies and Tracking Technologies</h2>
      <p className="mb-4">We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.</p>

      <h2 className="text-2xl font-bold mb-2">10. Advertising</h2>
      <p className="mb-4">We may use third-party advertising companies to serve ads when you visit our service. These companies may use information about your visits to our website and other websites that are contained in web cookies and other tracking technologies in order to provide advertisements about goods and services of interest to you.</p>

      <h2 className="text-2xl font-bold mb-2">11. Changes to This Privacy Policy</h2>
      <p className="mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this Privacy Policy.</p>

      <h2 className="text-2xl font-bold mb-2">12. Contact Us</h2>
      <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Email: privacy@minifyn.com</li>
        <li>Postal Address: MiniFyn, Thiruvananthapuram, Kerala, India - 695524</li>
      </ul>
    </LegalPageLayout>
  );
};

export default Privacy;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}