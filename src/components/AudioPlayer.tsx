
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useSurahRecitation } from '@/hooks/useQuranData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AudioPlayerProps {
  surahNumber: number;
  reciter?: string;
  onAyahChange?: (ayahNumber: number) => void;
}

// Define reciter options
const RECITERS = [
  { id: 'ar.alafasy', name: 'مشاري العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد' },
  { id: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس' },
  { id: 'ar.hudhaify', name: 'علي الحذيفي' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'ar.muhammadayyoub', name: 'محمد أيوب' },
];

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  surahNumber, 
  reciter: initialReciter = 'ar.alafasy',
  onAyahChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [reciter, setReciter] = useState(initialReciter);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { data: recitationData, isLoading, error } = useSurahRecitation(surahNumber, reciter);
  
  // Create audio URLs from the ayahs if available
  const audioUrls = recitationData?.ayahs?.map(ayah => ayah.audio || '') || [];
  
  // Initialize audio element
  useEffect(() => {
    if (recitationData?.ayahs && recitationData.ayahs.length > 0) {
      const firstAyah = recitationData.ayahs[0];
      if (firstAyah.audio && audioRef.current) {
        audioRef.current.src = firstAyah.audio;
        audioRef.current.load();
      }
    }
  }, [recitationData]);

  // Reset audio when reciter changes
  useEffect(() => {
    setCurrentAyahIndex(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [reciter]);
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Handle duration change
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };
  
  // Handle previous ayah
  const handlePrevious = () => {
    if (currentAyahIndex > 0) {
      const newIndex = currentAyahIndex - 1;
      setCurrentAyahIndex(newIndex);
      if (audioRef.current && audioUrls[newIndex]) {
        audioRef.current.src = audioUrls[newIndex];
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play();
        }
      }
      if (onAyahChange) {
        onAyahChange(newIndex + 1);
      }
    }
  };
  
  // Handle next ayah
  const handleNext = () => {
    if (currentAyahIndex < audioUrls.length - 1) {
      const newIndex = currentAyahIndex + 1;
      setCurrentAyahIndex(newIndex);
      if (audioRef.current && audioUrls[newIndex]) {
        audioRef.current.src = audioUrls[newIndex];
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play();
        }
      }
      if (onAyahChange) {
        onAyahChange(newIndex + 1);
      }
    }
  };
  
  // Handle audio end
  const handleEnded = () => {
    handleNext();
  };
  
  // Handle reciter change
  const handleReciterChange = (value: string) => {
    setReciter(value);
  };
  
  // Format time as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  if (isLoading) {
    return (
      <div className="glass-panel p-4 mt-4">
        <p className="text-center">Loading audio player...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass-panel p-4 mt-4">
        <p className="text-center text-destructive">Error loading audio</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 fixed bottom-0 left-0 right-0 z-40">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrevious} disabled={currentAyahIndex === 0}>
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={togglePlayPause}>
              {isPlaying ? (
                <Pause className="h-5 w-5 text-emerald-500" />
              ) : (
                <Play className="h-5 w-5 text-emerald-500" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentAyahIndex === audioUrls.length - 1}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <Select value={reciter} onValueChange={handleReciterChange}>
            <SelectTrigger className="w-36 sm:w-44 text-xs ml-2 h-8">
              <SelectValue placeholder="اختر القارئ" />
            </SelectTrigger>
            <SelectContent>
              {RECITERS.map(reciterOption => (
                <SelectItem key={reciterOption.id} value={reciterOption.id}>
                  {reciterOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="hidden sm:flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(currentTime)}
          </span>
          
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 1}
            step={0.01}
            onValueChange={handleSeek}
            className="flex-1"
          />
          
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="text-xs text-center">
          {recitationData?.name} - Ayah {currentAyahIndex + 1}/{audioUrls.length}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
