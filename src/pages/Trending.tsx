
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { tmdbApi, Movie, TV } from '@/services/tmdbApi';
import { Film, Tv } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const Trending = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv'>('all');
  const [trendingAll, setTrendingAll] = useState<(Movie | TV)[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TV[]>([]);
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        // Fetch trending for the active tab
        if (activeTab === 'all' || activeTab === 'movies') {
          const allResponse = await tmdbApi.getTrending(timeWindow, currentPage);
          if (activeTab === 'all') {
            setTrendingAll(allResponse.results);
            setTotalPages(Math.min(allResponse.total_pages, 10)); // Limiter à 10 pages maximum
          }
        }
        
        if (activeTab === 'movies') {
          const moviesResponse = await tmdbApi.getTrendingMovies(timeWindow, currentPage);
          setTrendingMovies(moviesResponse.results);
          setTotalPages(Math.min(moviesResponse.total_pages, 10)); // Limiter à 10 pages maximum
        }
        
        if (activeTab === 'tv') {
          const tvResponse = await tmdbApi.getTrendingTVShows(timeWindow, currentPage);
          setTrendingTV(tvResponse.results);
          setTotalPages(Math.min(tvResponse.total_pages, 10)); // Limiter à 10 pages maximum
        }
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrending();
  }, [activeTab, timeWindow, currentPage]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'movies' | 'tv');
    setCurrentPage(1); // Réinitialiser la page lors du changement d'onglet
  };
  
  const handleTimeWindowChange = (value: 'day' | 'week') => {
    setTimeWindow(value);
    setCurrentPage(1); // Réinitialiser la page lors du changement de période
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Générer les liens de pagination
  const renderPaginationLinks = () => {
    const pageLinks = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajuster startPage si nous sommes à la fin
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      pageLinks.push(
        <PaginationItem key="page-1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        pageLinks.push(
          <PaginationItem key="ellipsis-1">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageLinks.push(
          <PaginationItem key="ellipsis-2">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      
      pageLinks.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageLinks;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Tendances</h1>
        
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="movies">Films</TabsTrigger>
              <TabsTrigger value="tv">Séries</TabsTrigger>
            </TabsList>
            
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Période :</span>
                <button 
                  className={`text-sm px-3 py-1 rounded-full ${timeWindow === 'day' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => handleTimeWindowChange('day')}
                >
                  Aujourd'hui
                </button>
                <button 
                  className={`text-sm px-3 py-1 rounded-full ${timeWindow === 'week' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => handleTimeWindowChange('week')}
                >
                  Cette semaine
                </button>
              </div>
            </div>
            
            <TabsContent value="all">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {isLoading ? (
                  // Loading placeholders
                  [...Array(10)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-muted rounded-lg aspect-[2/3]"></div>
                      <div className="h-4 bg-muted rounded mt-2 w-3/4"></div>
                      <div className="h-3 bg-muted rounded mt-2 w-1/2"></div>
                    </div>
                  ))
                ) : (
                  trendingAll.map((item) => (
                    <MovieCard 
                      key={`${item.id}-${item.media_type || 'all'}`} 
                      item={item} 
                      mediaType={item.media_type}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="movies">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {isLoading ? (
                  // Loading placeholders (same as above)
                  [...Array(10)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-muted rounded-lg aspect-[2/3]"></div>
                      <div className="h-4 bg-muted rounded mt-2 w-3/4"></div>
                      <div className="h-3 bg-muted rounded mt-2 w-1/2"></div>
                    </div>
                  ))
                ) : (
                  trendingMovies.map((movie) => (
                    <MovieCard 
                      key={`${movie.id}-${movie.media_type || 'movie'}`} 
                      item={movie} 
                      mediaType="movie"
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tv">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {isLoading ? (
                  // Loading placeholders (same as above)
                  [...Array(10)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-muted rounded-lg aspect-[2/3]"></div>
                      <div className="h-4 bg-muted rounded mt-2 w-3/4"></div>
                      <div className="h-3 bg-muted rounded mt-2 w-1/2"></div>
                    </div>
                  ))
                ) : (
                  trendingTV.map((tvShow) => (
                    <MovieCard 
                      key={tvShow.id} 
                      item={tvShow} 
                      mediaType="tv"
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {renderPaginationLinks()}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trending;
