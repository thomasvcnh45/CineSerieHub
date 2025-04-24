import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { tmdbApi, TV as TVShow, Genre } from '@/services/tmdbApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import MovieCard from '@/components/MovieCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const TV = () => {
  const [popularShows, setPopularShows] = useState<TVShow[]>([]);
  const [topRatedShows, setTopRatedShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [genreShows, setGenreShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentTab, setCurrentTab] = useState('popular');
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [genrePage, setGenrePage] = useState(1);
  const [totalPages, setTotalPages] = useState({
    popular: 1,
    top_rated: 1,
    genres: 1
  });

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    switch (currentTab) {
      case 'popular':
        fetchPopularShows(popularPage);
        break;
      case 'top_rated':
        fetchTopRatedShows(topRatedPage);
        break;
      case 'genres':
        fetchGenres();
        if (selectedGenres.length > 0) {
          fetchShowsByGenres(selectedGenres, genrePage);
        }
        break;
    }
  }, [currentTab, popularPage, topRatedPage, genrePage]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      setGenrePage(1);
      fetchShowsByGenres(selectedGenres, 1);
    } else {
      setGenreShows([]);
    }
  }, [selectedGenres]);

  const fetchPopularShows = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await tmdbApi.getPopularTVShows(page);
      setPopularShows(response.results);
      setTotalPages(prev => ({
        ...prev,
        popular: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch popular shows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopRatedShows = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await tmdbApi.getTopRatedTVShows(page);
      setTopRatedShows(response.results);
      setTotalPages(prev => ({
        ...prev,
        top_rated: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch top rated shows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await tmdbApi.getTVGenres();
      setGenres(response.genres);
    } catch (error) {
      console.error('Failed to fetch TV genres:', error);
    }
  };

  const fetchShowsByGenres = async (genreIds: number[], page: number = 1) => {
    try {
      setIsLoading(true);
      const genreIdString = genreIds.join(',');
      const response = await tmdbApi.discoverTVShowsByGenres(genreIdString, page);
      setGenreShows(response.results);
      setTotalPages(prev => ({
        ...prev,
        genres: Math.min(response.total_pages, 500)
      }));
    } catch (error) {
      console.error('Failed to fetch TV shows by genres:', error);
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
            
            {Array.from({ length: Math.min(5, totalPagesCount) }).map((_, i) => {
              let pageNumber;
              
              if (totalPagesCount <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPagesCount - 2) {
                pageNumber = totalPagesCount - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={pageNumber === currentPage}
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
        <h1 className="text-3xl font-bold mb-2">Séries TV</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez les séries les plus populaires et les mieux notées.
        </p>
        
        <Tabs defaultValue="popular" value={currentTab} onValueChange={handleTabChange} className="mb-8">
          <ScrollArea className="w-full" orientation="horizontal">
            <TabsList className="mb-6">
              <TabsTrigger value="popular">Populaires</TabsTrigger>
              <TabsTrigger value="top_rated">Mieux notées</TabsTrigger>
              <TabsTrigger value="genres">Par genre</TabsTrigger>
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
                popularShows.map(show => (
                  <MovieCard key={show.id} item={show} mediaType="tv" />
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
                topRatedShows.map(show => (
                  <MovieCard key={show.id} item={show} mediaType="tv" />
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
                    genreShows.map(show => (
                      <MovieCard key={show.id} item={show} mediaType="tv" />
                    ))
                  )}
                </div>
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-12">
                <p>Sélectionnez un ou plusieurs genres pour voir les séries correspondantes</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default TV;