import SEO from '@/components/SEO';

const LegalPageLayout = ({ children, title, description, canonical, lastUpdated }) => {
  return (
    <>
      <SEO 
        title={`${title} - MiniFyn`}
        description={description}
        canonical={`https://www.minifyn.com/legal/${canonical}`}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="mb-4">Last updated: {lastUpdated}</p>
        {children}
      </div>
    </>
  );
};

export default LegalPageLayout;