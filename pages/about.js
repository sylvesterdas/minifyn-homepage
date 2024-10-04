import SEO from '@/components/SEO';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const AboutPage = () => {
  return (
    <>
      <SEO 
        title='About MiniFyn - URL Shortening Service'
        description='Learn about MiniFyn, a cutting-edge URL shortening service designed for simplicity and efficiency.'
        canonical='https://www.minifyn.com/about'
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">About MiniFyn</h1>
        <p className="mb-4">MiniFyn is a cutting-edge URL shortening service designed with simplicity and efficiency in mind. Our mission is to simplify link sharing and provide powerful analytics, making web navigation more efficient for everyone.</p>
        <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
        <p className="mb-4">We strive to be the go-to platform for developers and businesses seeking a reliable, fast, and feature-rich solution for managing and tracking shortened URLs.</p>
        <h2 className="text-2xl font-bold mb-2">Our Team</h2>
        <p>MiniFyn is powered by a dedicated team of professionals committed to delivering exceptional service and continuous innovation in the URL shortening space.</p>
      </div>
    </>
  );
};

export default AboutPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
