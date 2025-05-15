
import React, { useState } from 'react';
import { useSurahs, useSearchSurahs } from '@/hooks/useQuranData';
import SurahCard from '@/components/SurahCard';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';

const Index: React.FC = () => {
  const { data: surahs, isLoading, error } = useSurahs();
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = useSearchSurahs(surahs, searchQuery);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div dir="ltr" className="min-h-screen pb-20">
      <Navbar />
      
      <div className="container mx-auto p-4">
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-emerald-500">القرآن</span> الكريم
          </h1>
          <p className="text-muted-foreground">
            The Noble Quran - Complete with 114 Surahs
          </p>
        </header>
        
        <SearchBar onSearch={handleSearch} placeholder="Search by name or number..." />
        
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary">
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <div className="flex justify-end mt-4">
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-destructive">
            <p>Error loading surahs. Please try again later.</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        )}
        
        {!isLoading && !error && searchResults.length === 0 && (
          <div className="text-center py-8">
            <p>No surahs found matching "{searchQuery}".</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!isLoading && !error && searchResults.map((surah) => (
            <SurahCard
              key={surah.number}
              number={surah.number}
              name={surah.name}
              englishName={surah.englishName}
              englishNameTranslation={surah.englishNameTranslation}
              numberOfAyahs={surah.numberOfAyahs}
              revelationType={surah.revelationType}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
