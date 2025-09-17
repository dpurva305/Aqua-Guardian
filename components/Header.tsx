
import React from 'react';
import { APP_NAME, LANGUAGES } from '../constants';
import { WaterDropIcon, LanguageIcon } from './icons';

interface HeaderProps {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, t }) => {
  return (
    <header className="bg-brand-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <WaterDropIcon className="w-8 h-8 text-brand-secondary" />
          <h1 className="text-2xl font-bold tracking-tight">{APP_NAME}</h1>
        </div>
        <div className="relative">
          <LanguageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-white text-gray-800 rounded-full py-2 pl-10 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-secondary"
          >
            {Object.entries(LANGUAGES).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
