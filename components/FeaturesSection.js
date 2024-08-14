import React from 'react';

const Feature = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const QRCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <rect x="7" y="7" width="3" height="3"/>
    <rect x="14" y="7" width="3" height="3"/>
    <rect x="7" y="14" width="3" height="3"/>
    <line x1="14" y1="14" x2="17" y2="14"/>
    <line x1="14" y1="17" x2="17" y2="17"/>
  </svg>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: '🔗',
      title: 'Quick Link Shortening',
      description: 'Create short, memorable links in seconds.',
    },
    {
      icon: '📊',
      title: 'Detailed Analytics',
      description: 'Track clicks and understand your audience.',
    },
    {
      icon: '🔒',
      title: 'Secure and Reliable',
      description: 'Your links are safe and always accessible.',
    },
    {
      icon: <QRCodeIcon />,
      title: 'QR Code Generation',
      description: 'Create QR codes for easy mobile sharing.',
    },
    {
      icon: '📚',
      title: 'Bulk URL Shortening',
      description: 'Shorten multiple URLs at once for efficiency.',
    },
  ];

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose MiniFyn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;