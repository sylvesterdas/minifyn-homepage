import { useTranslation } from 'next-i18next';
import { TabButton } from './TabButton';
import UrlShortener from '../UrlShortener';
import UsageLimits from '../UsageLimits';
import QRCodeGenerator from '../QRCodeGenerator';

export const TabPanel = ({ activeTab, setActiveTab, userType }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white bg-opacity-10 rounded-lg shadow-lg backdrop-blur-sm overflow-hidden">
      <div className="flex border-b border-white border-opacity-20">
        <TabButton 
          active={activeTab === 'url'} 
          onClick={() => setActiveTab('url')}
          label={t('urlShortener')}
        />
        <TabButton 
          active={activeTab === 'qr'} 
          onClick={() => setActiveTab('qr')}
          label={t('qrCode')}
        />
      </div>
      <div className="p-4 sm:p-6 h-96 overflow-y-auto">
        {activeTab === 'url' ? (
          <>
            <UrlShortener />
            <UsageLimits userType={userType} />
          </>
        ) : (
          <QRCodeGenerator />
        )}
      </div>
    </div>
  );
};