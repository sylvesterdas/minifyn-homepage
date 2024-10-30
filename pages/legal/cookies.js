import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CookiePolicy() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="Learn how MiniFyn uses cookies and similar technologies"
      lastUpdated="October 25, 2024"
      canonical="cookies"
    >
      <h2 className="text-2xl font-bold mb-2">What Are Cookies</h2>
      <p className="mb-4">
        Cookies are small text files stored on your device when you visit our website. 
        They&apos;re essential for keeping your preferences, ensuring our service works efficiently, 
        and providing you with a personalized experience.
      </p>

      <h2 className="text-2xl font-bold mb-2">How We Use Cookies</h2>
      <p className="font-semibold mb-4">We use cookies for:</p>
      <ul className='list-disc m-6 mt-0'>
        <li>Keeping you signed in to your account</li>
        <li>Remembering your preferences and settings</li>
        <li>Understanding how you use our service</li>
        <li>Protecting against fraud and improving security</li>
        <li>Processing URL shortening requests efficiently</li>
      </ul>

      <h2 className="text-2xl font-bold mb-2">Types of Cookies We Use</h2>
      
      <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
      <p className="mb-4">
        These cookies are necessary for MiniFyn to work properly. They enable core 
        features like URL shortening, dashboard access, and security measures.
      </p>

      <h3 className="text-lg font-semibold mb-2">Performance Cookies</h3>
      <p className="mb-4">
        We use these to understand how visitors interact with our website, helping 
        us improve our service and identify technical issues.
      </p>

      <h3 className="text-lg font-semibold mb-2">Functionality Cookies</h3>
      <p className="mb-4">
        These remember your preferences and choices, making your experience more 
        personalized and efficient.
      </p>

      <h2 className="text-2xl font-bold mb-2">Managing Cookies</h2>
      <p className="mb-4">
        You can control cookies through your browser settings. However, note that 
        disabling certain cookies might affect MiniFyn&apos;s functionality.
      </p>

      <h2 className="text-2xl font-bold mb-2">Updates to This Policy</h2>
      <p className="mb-4">
        We might update this policy as we improve our service. Check back regularly 
        for the latest information about how we use cookies.
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
