// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.alquran.cloud/v1',
  DEFAULT_RECITER: import.meta.env.VITE_DEFAULT_RECITER || 'ar.alafasy',
  DEFAULT_TRANSLATION: import.meta.env.VITE_DEFAULT_TRANSLATION || 'en.asad',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  getAllSurahs: () => 
    `${API_CONFIG.BASE_URL}/surah`,
  
  getSurah: (surahNumber: number) => 
    `${API_CONFIG.BASE_URL}/surah/${surahNumber}`,
  
  getSurahRecitation: (surahNumber: number, reciter: string = API_CONFIG.DEFAULT_RECITER) => 
    `${API_CONFIG.BASE_URL}/surah/${surahNumber}/${reciter}`,
  
  getSurahTranslation: (surahNumber: number, translation: string = API_CONFIG.DEFAULT_TRANSLATION) => 
    `${API_CONFIG.BASE_URL}/surah/${surahNumber}/${translation}`,
} as const; 