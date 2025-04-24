
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie, TV, IMG_BASE_URL, POSTER_SIZE } from '@/services/tmdbApi';

interface MovieCardProps {
  item: Movie | TV;
  mediaType?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, mediaType }) => {
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
  
  // Déterminer le type de média (pour le chemin du lien)
  const type = mediaType || item.media_type || (isMovie ? 'movie' : 'tv');
  
  // Chemin de l'affiche
  const posterPath = item.poster_path 
    ? `${IMG_BASE_URL}${POSTER_SIZE.MEDIUM}${item.poster_path}`
    : '/placeholder.svg';
  
  return (
    <Link to={`/${type}/${item.id}`} className="movie-card block">
      <img 
        src={posterPath} 
        alt={title} 
        className="rounded-lg"
        loading="lazy"
      />
      <div className="movie-card-info">
        <h3 className="font-medium text-sm md:text-base truncate">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-300">{year}</span>
          {item.vote_average > 0 && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium">{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
