
import React, { useState, useCallback } from 'react';
import { Page } from './types';
import { TRANSLATIONS, NAVIGATION_ITEMS } from './constants';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import MapScreen from './components/MapScreen';
import AlertsScreen from './components/AlertsScreen';
import EducationScreen from './components/EducationScreen';
import HealthCompanionScreen from './components/HealthCompanionScreen';
import CommunityScreen from './components/CommunityScreen';
import FeedbackModal from './components/FeedbackModal';
import { ChatBubbleOvalLeftEllipsisIcon } from './components/icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [lang, setLang] = useState<string>('en');
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const t = useCallback((key: string): string => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;
  }, [lang]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomeScreen t={t} setPage={setCurrentPage} />;
      case Page.Map:
        return <MapScreen t={t} />;
      case Page.Alerts:
        return <AlertsScreen t={t} />;
      case Page.Education:
        return <EducationScreen t={t} />;
      case Page.Health:
        return <HealthCompanionScreen t={t} />;
      case Page.Community:
        return <CommunityScreen t={t} />;
      default:
        return <HomeScreen t={t} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header lang={lang} setLang={setLang} t={t} />
      <main className="flex-grow container mx-auto max-w-2xl">
        {renderPage()}
      </main>
      <nav className="sticky bottom-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] mt-4">
        <div className="container mx-auto max-w-2xl flex justify-around">
          {NAVIGATION_ITEMS.map(({ page, icon, labelKey }) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex flex-col items-center justify-center p-2 w-full text-xs transition-colors duration-200 ${
                currentPage === page ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-secondary'
              }`}
            >
              {React.cloneElement(icon, { className: 'w-6 h-6 mb-1' })}
              <span>{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </nav>

      <button
        onClick={() => setFeedbackModalOpen(true)}
        title={t('send_feedback')}
        aria-label={t('send_feedback')}
        className="fixed bottom-20 right-4 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-dark transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary z-40"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
      </button>

      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        t={t}
      />
    </div>
  );
};

export default App;
