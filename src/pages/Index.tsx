
import React, { useState, useEffect } from 'react';
import { FilmIcon, TvIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import MovieList from '@/components/MovieList';
import Footer from '@/components/Footer';
import { tmdbApi, Movie, TV } from '@/services/tmdbApi';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [heroItem, setHeroItem] = useState<Movie | TV | null>(null);
  const [trendingAll, setTrendingAll] = useState<(Movie | TV)[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<TV[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch trending movies and TV shows
        const trendingResponse = await tmdbApi.getTrending();
        setTrendingAll(trendingResponse.results);
        
        // Set a random trending item as the hero
        if (trendingResponse.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trendingResponse.results.length));
          setHeroItem(trendingResponse.results[randomIndex]);
        }
        
        // Fetch popular movies
        const popularMoviesResponse = await tmdbApi.getPopularMovies();
        setPopularMovies(popularMoviesResponse.results);
        
        // Fetch popular TV shows
        const popularTVResponse = await tmdbApi.getPopularTVShows();
        setPopularTV(popularTVResponse.results);
        
        // Fetch top rated movies
        const topRatedMoviesResponse = await tmdbApi.getTopRatedMovies();
        setTopRatedMovies(topRatedMoviesResponse.results);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      {/* Hero Section */}
      {heroItem ? (
        <Hero item={heroItem} isLoading={isLoading} />
      ) : (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto px-4 -mt-16 relative z-20">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Button asChild variant="outline" className="h-20 flex flex-col gap-2 bg-card hover:bg-card/80 hover:text-primary border border-border">
            <Link to="/movies">
              <FilmIcon size={24} />
              <span>Films</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col gap-2 bg-card hover:bg-card/80 hover:text-primary border border-border">
            <Link to="/tv">
              <TvIcon size={24} />
              <span>Séries</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col gap-2 bg-card hover:bg-card/80 hover:text-primary border border-border">
            <Link to="/trending">
              <TrendingUpIcon size={24} />
              <span>Tendances</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex flex-col gap-2 bg-card hover:bg-card/80 hover:text-primary border border-border">
            <Link to="/movies/upcoming">
              <ClockIcon size={24} />
              <span>À venir</span>
            </Link>
          </Button>
        </div>
        
        {/* Movie Lists */}
        <MovieList 
          title="En tendance" 
          items={trendingAll} 
          isLoading={isLoading} 
        />
        
        <MovieList 
          title="Films populaires" 
          items={popularMovies} 
          mediaType="movie"
          isLoading={isLoading} 
        />
        
        <MovieList 
          title="Séries populaires" 
          items={popularTV} 
          mediaType="tv"
          isLoading={isLoading} 
        />
        
        <MovieList 
          title="Films les mieux notés" 
          items={topRatedMovies} 
          mediaType="movie"
          isLoading={isLoading} 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
