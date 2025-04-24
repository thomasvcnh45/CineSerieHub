
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie, TV, IMG_BASE_URL, BACKDROP_SIZE } from '@/services/tmdbApi';

interface HeroProps {
  item: Movie | TV;
  isLoading?: boolean;
}

const Hero: React.FC<HeroProps> = ({ item, isLoading = false }) => {
  const navigate = useNavigate();
  
  // Déterminer si l'élément est un film ou une émission de télévision
  const isMovie = 'title' in item;
  const title = isMovie ? item.title : item.name;
  
  // Gérer la date de sortie pour les deux types
  let releaseDate;
  if (isMovie) {
    releaseDate = item.release_date;
  } else {
    releaseDate = item.first_air_date;
  }
  
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  if (isLoading) {
    return (
      <div className="relative w-full h-[70vh] bg-gradient-to-t from-background to-background/60 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  const backdropUrl = item.backdrop_path 
    ? `${IMG_BASE_URL}${BACKDROP_SIZE.ORIGINAL}${item.backdrop_path}`
    : null;
    
  const handleDetailsClick = () => {
    const mediaType = isMovie ? 'movie' : 'tv';
    navigate(`/${mediaType}/${item.id}`);
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {/* Background Image */}
      {backdropUrl ? (
        <div className="absolute inset-0">
          <img 
            src={backdropUrl} 
            alt={title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="hero-overlay"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-background"></div>
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-end pb-20 relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">{title}</h1>
          {year && <p className="text-lg text-gray-300 mb-4">{year}</p>}
          <p className="text-gray-300 text-lg mb-6 line-clamp-3">{item.overview}</p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="gap-2 text-base px-6 py-6" 
              onClick={handleDetailsClick}
            >
              <InfoIcon size={20} />
              Détails
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 text-base px-6 py-6 bg-black/30 backdrop-blur-sm hover:bg-black/50"
              onClick={handleDetailsClick}
            >
              <PlayCircle size={20} />
              Bande-annonce
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
