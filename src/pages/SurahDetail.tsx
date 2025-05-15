
import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCombinedSurah } from '@/hooks/useQuranData';
import Navbar from '@/components/Navbar';
import AudioPlayer from '@/components/AudioPlayer';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const SurahDetail: React.FC = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const parsedNumber = parseInt(surahNumber || '1', 10);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const { data, isLoading, error } = useCombinedSurah(parsedNumber);
  
  const handleAyahChange = (ayahNumber: number) => {
    setActiveAyah(ayahNumber);
    // Scroll to the ayah
    if (ayahRefs.current[ayahNumber - 1]) {
      ayahRefs.current[ayahNumber - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };
  
  const handlePlayAyah = (index: number) => {
    handleAyahChange(index + 1);
  };
  
  return (
    <div dir="ltr" className="min-h-screen pb-36">
      <Navbar />
      
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="p-0 mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex-1">
            {isLoading ? (
              <div>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-20 mt-2" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-sm text-emerald-400 font-medium">{data?.number}</span>
                  </div>
                  <h1 className="text-2xl font-bold">
                    {data?.englishName}
                  </h1>
                  <Badge variant="outline" className={
                    data?.revelationType === "Meccan" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  }>
                    {data?.revelationType}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {data?.englishNameTranslation} • {data?.numberOfAyahs} verses
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Bismillah */}
        {data?.number !== 1 && data?.number !== 9 && (
          <div className="text-center my-8 glass-panel py-6 px-4 rounded-lg">
            <h2 dir="rtl" lang="ar" className="arabic-text text-2xl mb-2">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h2>
            <p className="text-sm text-muted-foreground">
              In the name of Allah, the Entirely Merciful, the Especially Merciful
            </p>
          </div>
        )}
        
        {/* Surah name in Arabic */}
        <div className="text-center my-8">
          <h2 dir="rtl" lang="ar" className="arabic-text text-3xl">
            {data?.name}
          </h2>
        </div>
        
        {isLoading && (
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 ml-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-center py-8 text-destructive">
            <p>Error loading surah. Please try again later.</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        )}
        
        {!isLoading && !error && (
          <Tabs defaultValue="ayahs" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="ayahs">Ayahs</TabsTrigger>
              <TabsTrigger value="translation">Translation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ayahs" className="space-y-6">
              {data?.ayahs.map((ayah, index) => (
                <div
                  key={ayah.number}
                  ref={el => (ayahRefs.current[index] = el)}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    activeAyah === index + 1 
                      ? 'bg-emerald-500/10 border border-emerald-500/30' 
                      : 'glass-panel hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-sm text-emerald-400 font-medium">{ayah.numberInSurah}</span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-8 w-8"
                        onClick={() => handlePlayAyah(index)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Page {ayah.page} • Juz {ayah.juz}
                    </div>
                  </div>
                  
                  <p 
                    dir="rtl" 
                    lang="ar" 
                    className="arabic-text text-xl leading-10"
                  >
                    {ayah.text}
                  </p>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="translation" className="space-y-6">
              {data?.ayahs.map((ayah, index) => (
                <div
                  key={ayah.number}
                  ref={el => (ayahRefs.current[index] = el)}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    activeAyah === index + 1 
                      ? 'bg-emerald-500/10 border border-emerald-500/30' 
                      : 'glass-panel hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-sm text-emerald-400 font-medium">{ayah.numberInSurah}</span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-8 w-8"
                        onClick={() => handlePlayAyah(index)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <p 
                      dir="rtl" 
                      lang="ar" 
                      className="arabic-text text-lg leading-10"
                    >
                      {ayah.text}
                    </p>
                    
                    <p className="text-md text-muted-foreground border-t border-muted pt-2">
                      {(ayah as any).translation}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {data && (
        <AudioPlayer 
          surahNumber={parsedNumber} 
          onAyahChange={handleAyahChange}
        />
      )}
    </div>
  );
};

export default SurahDetail;
