import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { tmdbApi, Movie, Genre } from '@/services/tmdbApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';

const Movies = () => {
  const isMobile = useIsMobile();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentTab, setCurrentTab] = useState('popular');
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [genrePage, setGenrePage] = useState(1);
  const [totalPages, setTotalPages] = useState({
    popular: 1,
    top_rated: 1,
    now_playing: 1,
    upcoming: 1,
    genres: 1
  });

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    switch (currentTab) {
      case 'popular':
        fetchPopularMovies(popularPage);
        break;
      case 'top_rated':
        fetchTopRatedMovies(topRatedPage);
        break;
      case 'now_playing':
        fetchNowPlayingMovies(nowPlayingPage);
        break;
      case 'upcoming':
        fetchUpcomingMovies(upcomingPage);
        break;
      case 'genres':
        fetchGenres();
        if (selectedGenres.length > 0) {
          fetchMoviesByGenres(selectedGenres, genrePage);
        }
        break;
    }
  }, [currentTab, popularPage, topRatedPage, nowPlayingPage, upcomingPage, genrePage]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      setGenrePage(1);
      fetchMoviesByGenres(selectedGenres, 1);
    } else {
      setGenreMovies([]);
    }
  }, [selectedGenres]);

  const fetchPopularMovies = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await tmdbApi.getPopularMovies(page);
      setPopularMovies(response.results);
      setTotalPages(prev => ({
        ...prev,
        popular: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopRatedMovies = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await tmdbApi.getTopRatedMovies(page);
      setTopRatedMovies(response.results);
      setTotalPages(prev => ({
        ...prev,
        top_rated: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch top rated movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNowPlayingMovies = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await tmdbApi.getNowPlayingMovies(page);
      setNowPlayingMovies(response.results);
      setTotalPages(prev => ({
        ...prev,
        now_playing: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch now playing movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingMovies = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await tmdbApi.getUpcomingMovies(page);
      setUpcomingMovies(response.results);
      setTotalPages(prev => ({
        ...prev,
        upcoming: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch upcoming movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await tmdbApi.getMovieGenres();
      setGenres(response.genres);
    } catch (error) {
      console.error('Failed to fetch movie genres:', error);
    }
  };

  const fetchMoviesByGenres = async (genreIds: number[], page: number = 1) => {
    try {
      setIsLoading(true);
      const genreIdString = genreIds.join(',');
      const response = await tmdbApi.discoverMoviesByGenres(genreIdString, page);
      setGenreMovies(response.results);
      setTotalPages(prev => ({
        ...prev,
        genres: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch movies by genres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreClick = (genreId: number) => {
    setSelectedGenres(prevGenres => {
      if (prevGenres.includes(genreId)) {
        return prevGenres.filter(id => id !== genreId);
      } else {
        return [...prevGenres, genreId];
      }
    });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const getCurrentPage = () => {
    switch (currentTab) {
      case 'popular': return popularPage;
      case 'top_rated': return topRatedPage;
      case 'now_playing': return nowPlayingPage;
      case 'upcoming': return upcomingPage;
      case 'genres': return genrePage;
      default: return 1;
    }
  };

  const getCurrentTotalPages = () => {
    return totalPages[currentTab as keyof typeof totalPages] || 1;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > getCurrentTotalPages()) return;
    
    switch (currentTab) {
      case 'popular':
        setPopularPage(newPage);
        break;
      case 'top_rated':
        setTopRatedPage(newPage);
        break;
      case 'now_playing':
        setNowPlayingPage(newPage);
        break;
      case 'upcoming':
        setUpcomingPage(newPage);
        break;
      case 'genres':
        setGenrePage(newPage);
        break;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const currentPage = getCurrentPage();
    const totalPagesCount = getCurrentTotalPages();
    
    if (totalPagesCount <= 1) return null;
    
    if (currentTab === 'genres' && selectedGenres.length === 0) return null;
    
    return (
      <div className="mt-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPagesCount) }).map((_, i) => {
              let pageNumber;
              
              if (totalPagesCount <= (isMobile ? 3 : 5)) {
                pageNumber = i + 1;
              } else if (currentPage <= (isMobile ? 2 : 3)) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPagesCount - (isMobile ? 1 : 2)) {
                pageNumber = totalPagesCount - (isMobile ? 2 : 4) + i;
              } else {
                pageNumber = currentPage - (isMobile ? 1 : 2) + i;
              }
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={pageNumber === currentPage}
                    className={isMobile ? "w-8 h-8 p-0 flex items-center justify-center" : ""}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage >= totalPagesCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Films</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez les derniers films, les plus populaires et les mieux notés.
        </p>
        
        <Tabs defaultValue="popular" value={currentTab} onValueChange={handleTabChange} className="mb-8">
          <ScrollArea className="w-full" orientation="horizontal">
            <TabsList className="mb-6 inline-flex w-auto h-auto flex-wrap">
              <TabsTrigger value="popular" className={isMobile ? "text-xs py-1 px-2" : ""}>
                {isMobile ? "Populaires" : "Populaires"}
              </TabsTrigger>
              <TabsTrigger value="top_rated" className={isMobile ? "text-xs py-1 px-2" : ""}>
                {isMobile ? "Mieux notés" : "Mieux notés"}
              </TabsTrigger>
              <TabsTrigger value="now_playing" className={isMobile ? "text-xs py-1 px-2" : ""}>
                {isMobile ? "À l'affiche" : "À l'affiche"}
              </TabsTrigger>
              <TabsTrigger value="upcoming" className={isMobile ? "text-xs py-1 px-2" : ""}>
                {isMobile ? "À venir" : "À venir"}
              </TabsTrigger>
              <TabsTrigger value="genres" className={isMobile ? "text-xs py-1 px-2" : ""}>
                {isMobile ? "Genres" : "Par genre"}
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
          
          <TabsContent value="popular">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {isLoading ? (
                [...Array(10)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-card rounded-lg aspect-[2/3]"></div>
                    <div className="h-4 bg-card rounded mt-2 w-3/4"></div>
                    <div className="h-3 bg-card rounded mt-2 w-1/2"></div>
                  </div>
                ))
              ) : (
                popularMovies.map(movie => (
                  <MovieCard key={movie.id} item={movie} mediaType="movie" />
                ))
              )}
            </div>
            {renderPagination()}
          </TabsContent>
          
          <TabsContent value="top_rated">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {isLoading ? (
                [...Array(10)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-card rounded-lg aspect-[2/3]"></div>
                    <div className="h-4 bg-card rounded mt-2 w-3/4"></div>
                    <div className="h-3 bg-card rounded mt-2 w-1/2"></div>
                  </div>
                ))
              ) : (
                topRatedMovies.map(movie => (
                  <MovieCard key={movie.id} item={movie} mediaType="movie" />
                ))
              )}
            </div>
            {renderPagination()}
          </TabsContent>
          
          <TabsContent value="now_playing">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {isLoading ? (
                [...Array(10)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-card rounded-lg aspect-[2/3]"></div>
                    <div className="h-4 bg-card rounded mt-2 w-3/4"></div>
                    <div className="h-3 bg-card rounded mt-2 w-1/2"></div>
                  </div>
                ))
              ) : (
                nowPlayingMovies.map(movie => (
                  <MovieCard key={movie.id} item={movie} mediaType="movie" />
                ))
              )}
            </div>
            {renderPagination()}
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {isLoading ? (
                [...Array(10)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-card rounded-lg aspect-[2/3]"></div>
                    <div className="h-4 bg-card rounded mt-2 w-3/4"></div>
                    <div className="h-3 bg-card rounded mt-2 w-1/2"></div>
                  </div>
                ))
              ) : (
                upcomingMovies.map(movie => (
                  <MovieCard key={movie.id} item={movie} mediaType="movie" />
                ))
              )}
            </div>
            {renderPagination()}
          </TabsContent>
          
          <TabsContent value="genres">
            <div className="mb-6">
              <ScrollArea className="w-full" orientation="horizontal">
                <div className="flex gap-2 pb-2 pr-2">
                  {genres.map(genre => (
                    <Badge 
                      key={genre.id}
                      variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => handleGenreClick(genre.id)}
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {selectedGenres.length > 0 ? (
              <>
                <div className="flex items-center mb-4 gap-2">
                  <p className="text-sm font-medium">Genres sélectionnés:</p>
                  <ScrollArea className="w-full" orientation="horizontal">
                    <div className="flex flex-wrap gap-2">
                      {selectedGenres.map(genreId => {
                        const genre = genres.find(g => g.id === genreId);
                        return genre ? (
                          <Badge 
                            key={genre.id} 
                            variant="secondary"
                            className="cursor-pointer whitespace-nowrap"
                            onClick={() => handleGenreClick(genre.id)}
                          >
                            {genre.name} ×
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </ScrollArea>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {isLoading ? (
                    [...Array(10)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-card rounded-lg aspect-[2/3]"></div>
                        <div className="h-4 bg-card rounded mt-2 w-3/4"></div>
                        <div className="h-3 bg-card rounded mt-2 w-1/2"></div>
                      </div>
                    ))
                  ) : (
                    genreMovies.map(movie => (
                      <MovieCard key={movie.id} item={movie} mediaType="movie" />
                    ))
                  )}
                </div>
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-12">
                <p>Sélectionnez un ou plusieurs genres pour voir les films correspondants</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Movies;