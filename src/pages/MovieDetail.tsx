
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, ChevronLeft, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MovieList from '@/components/MovieList';
import { tmdbApi, MovieDetails, Movie, IMG_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '@/services/tmdbApi';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch movie details
        const movieId = parseInt(id);
        const movieDetails = await tmdbApi.getMovieDetails(movieId);
        setMovie(movieDetails);
        
        // Find trailer
        if (movieDetails.videos && movieDetails.videos.results.length > 0) {
          const trailer = movieDetails.videos.results.find(
            video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
          );
          
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
        
        // Fetch similar movies
        const similarResponse = await fetchApi<ApiResponse<Movie>>(`/movie/${movieId}/similar`);
        setSimilarMovies(similarResponse.results);
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Helper function to format runtime
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };
  
  // Utility function for API fetch (copied from tmdbApi)
  const fetchApi = async <T,>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const BASE_URL = "https://api.themoviedb.org/3";
    const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
    
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params
    }).toString();
    
    try {
      const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API fetch error:", error);
      throw error;
    }
  };
  
  // This is needed for TypeScript
  interface ApiResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Film non trouvé</h1>
            <p className="mb-6">Désolé, nous n'avons pas pu trouver le film que vous cherchez.</p>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Background and poster images
  const backdropUrl = movie.backdrop_path 
    ? `${IMG_BASE_URL}${BACKDROP_SIZE.ORIGINAL}${movie.backdrop_path}`
    : null;
    
  const posterUrl = movie.poster_path 
    ? `${IMG_BASE_URL}${POSTER_SIZE.LARGE}${movie.poster_path}`
    : '/placeholder.svg';
    
  // Get director and main cast
  const director = movie.credits?.crew.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast.slice(0, 8) || [];

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      {/* Hero Section with Backdrop */}
      <div className="relative pt-16">
        {backdropUrl && (
          <div className="absolute inset-0 h-[70vh]">
            <img 
              src={backdropUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background"></div>
          </div>
        )}
        
        <div className="container mx-auto px-4 pt-8 relative z-10">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ChevronLeft size={18} />
              Retour
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
            {/* Poster Column */}
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={posterUrl} 
                  alt={movie.title} 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Details Column */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic mb-4">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <Badge key={genre.id} variant="secondary" className="text-sm">
                    {genre.name}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)} / 10</span>
                  </div>
                )}
                
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                
                {movie.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                <p className="text-muted-foreground">{movie.overview || "Aucun synopsis disponible."}</p>
              </div>
              
              {director && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Réalisateur</h2>
                  <p>{director.name}</p>
                </div>
              )}
              
              {mainCast.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Casting principal</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mainCast.map(actor => (
                      <div key={actor.id} className="text-sm">
                        <p className="font-medium">{actor.name}</p>
                        <p className="text-muted-foreground">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {trailerKey && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4 gap-2">
                      <PlayCircle size={18} />
                      Regarder la bande-annonce
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
                    <div className="aspect-video w-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${trailerKey}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Movies */}
      <div className="container mx-auto px-4 my-8">
        <MovieList 
          title="Films similaires" 
          items={similarMovies} 
          mediaType="movie"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default MovieDetail;
