import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import zhHans from './locales/zh-Hans/translation.json';

const resources = {
  en: {
    translation: en,
  },
  'zh-Hans': {
    translation: zhHans,
  },
};

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
