import { useTranslation } from 'next-i18next';
import { TRANSLATION_KEYS } from '@/constants/text';
import { TabPanel } from './TabPanel';

export const Hero = ({ activeTab, setActiveTab, userType }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-gradient-to-br from-primary via-secondary to-teal relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="md:flex md:items-center md:gap-8">
          <div className="text-center md:text-left md:flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
              {t(TRANSLATION_KEYS.BANNER_TITLE)}
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-4 text-light-gray">
              {t(TRANSLATION_KEYS.BANNER_SUBTITLE)}
            </p>
          </div>
          
          <div className="md:flex-1">
            <TabPanel 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              userType={userType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};