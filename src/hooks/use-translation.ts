import { useLanguage } from '@/context/language-context';
import en from '@/lib/locales/en.json';
import pt from '@/lib/locales/pt.json';

const translations = {
  en,
  pt,
};

type TranslationKey = keyof typeof en;

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return { t };
};
