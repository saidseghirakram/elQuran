import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/api';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  audio?: string; // Add audio property
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface TranslatedAyah extends Ayah {
  translation?: string;
}

interface TranslatedSurahData extends Omit<SurahData, 'ayahs'> {
  ayahs: TranslatedAyah[];
}

// Fetch all surahs
export const useSurahs = () => {
  return useQuery({
    queryKey: ['surahs'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.getAllSurahs());
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch surahs');
      }
      
      return data.data as Surah[];
    }
  });
};

// Fetch a specific surah by number
export const useSurah = (surahNumber: number) => {
  return useQuery({
    queryKey: ['surah', surahNumber],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.getSurah(surahNumber));
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch surah');
      }
      
      return data.data as SurahData;
    },
    enabled: !!surahNumber,
  });
};

// Fetch audio recitation for a surah
export const useSurahRecitation = (surahNumber: number, reciter?: string) => {
  return useQuery({
    queryKey: ['recitation', surahNumber, reciter],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.getSurahRecitation(surahNumber, reciter));
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch recitation');
      }
      
      return data.data as SurahData;
    },
    enabled: !!surahNumber,
  });
};

// Fetch translation for a surah
export const useSurahTranslation = (surahNumber: number, translation?: string) => {
  return useQuery({
    queryKey: ['translation', surahNumber, translation],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.getSurahTranslation(surahNumber, translation));
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch translation');
      }
      
      return data.data as SurahData;
    },
    enabled: !!surahNumber,
  });
};

// Combine Arabic text with translation
export const useCombinedSurah = (
  surahNumber: number, 
  translation: string = 'en.asad'
) => {
  const { data: arabicData, isLoading: isLoadingArabic, error: arabicError } = 
    useSurah(surahNumber);
  const { data: translationData, isLoading: isLoadingTranslation, error: translationError } = 
    useSurahTranslation(surahNumber, translation);
  
  const [combinedData, setCombinedData] = useState<TranslatedSurahData | null>(null);
  
  useEffect(() => {
    if (arabicData && translationData) {
      const combined: TranslatedSurahData = {
        ...arabicData,
        ayahs: arabicData.ayahs.map((ayah, index) => ({
          ...ayah,
          translation: translationData.ayahs[index]?.text || ''
        }))
      };
      
      setCombinedData(combined);
    }
  }, [arabicData, translationData]);
  
  return {
    data: combinedData,
    isLoading: isLoadingArabic || isLoadingTranslation,
    error: arabicError || translationError
  };
};

// Search surahs
export const useSearchSurahs = (surahs: Surah[] | undefined, query: string) => {
  const [results, setResults] = useState<Surah[]>([]);
  
  useEffect(() => {
    if (!surahs || !query.trim()) {
      setResults(surahs || []);
      return;
    }
    
    const filteredSurahs = surahs.filter(surah => {
      return surah.name.toLowerCase().includes(query.toLowerCase()) ||
        surah.englishName.toLowerCase().includes(query.toLowerCase()) ||
        surah.englishNameTranslation.toLowerCase().includes(query.toLowerCase()) ||
        String(surah.number).includes(query);
    });
    
    setResults(filteredSurahs);
  }, [surahs, query]);
  
  return results;
};
