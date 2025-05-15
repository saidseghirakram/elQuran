
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SurahCardProps {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

const SurahCard: React.FC<SurahCardProps> = ({
  number,
  name,
  englishName,
  englishNameTranslation,
  numberOfAyahs,
  revelationType,
}) => {
  return (
    <Link to={`/surah/${number}`} className="block transition-all-smooth hover:scale-[1.02]">
      <Card className="overflow-hidden h-full bg-secondary hover:border-emerald-500">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-sm text-emerald-400 font-medium">{number}</span>
              </div>
              <h3 className="text-lg font-medium">{englishName}</h3>
            </div>
            <Badge variant="outline" className={
              revelationType === "Meccan" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-blue-500/10 text-blue-400 border-blue-500/30"
            }>
              {revelationType}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <div>
              <p className="text-sm text-muted-foreground">{englishNameTranslation}</p>
              <p className="text-xs text-muted-foreground mt-1">{numberOfAyahs} verses</p>
            </div>
            <h3 dir="rtl" lang="ar" className="arabic-text text-xl">{name}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SurahCard;
