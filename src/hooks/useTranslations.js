import { useState, useEffect } from 'react';
import { getLanguage, getTranslation } from '../utils/translations';

export const useTranslations = () => {
  const [language, setLanguage] = useState(getLanguage());

  useEffect(() => {
    // Listen for language changes if needed
    const handleLanguageChange = () => {
      const newLanguage = getLanguage();
      if (newLanguage !== language) {
        setLanguage(newLanguage);
      }
    };

    // Check periodically for language changes (optional)
    const interval = setInterval(handleLanguageChange, 5000);
    
    return () => clearInterval(interval);
  }, [language]);

  const t = (key) => getTranslation(key, language);

  return { t, language, setLanguage };
};
