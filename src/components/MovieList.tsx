import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from './MovieCard';
import { Movie, TV } from '@/services/tmdbApi';

interface MovieListProps {
  title: string;
  items: (Movie | TV)[];
  mediaType?: 'movie' | 'tv';
  isLoading?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ 
  title, 
  items, 
  mediaType,
  isLoading = false 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={scrollLeft}
          >
            <ChevronLeft size={18} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={scrollRight}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        {isLoading ? (
          <div 
            className="carousel flex overflow-x-auto touch-pan-x scrollbar-hide snap-x" 
            ref={scrollContainerRef}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="inline-block w-[160px] md:w-[200px] h-[240px] md:h-[300px] mx-2 bg-card animate-pulse rounded-lg flex-shrink-0 snap-start"
              ></div>
            ))}
          </div>
        ) : (
          <div 
            className="carousel flex overflow-x-auto touch-pan-x scrollbar-hide snap-x" 
            ref={scrollContainerRef}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {items.map((item) => (
              <div key={item.id} className="inline-block w-[160px] md:w-[200px] mx-2 flex-shrink-0 snap-start">
                <MovieCard item={item} mediaType={mediaType} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
