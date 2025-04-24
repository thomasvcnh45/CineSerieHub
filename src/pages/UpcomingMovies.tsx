
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { tmdbApi, Movie } from '@/services/tmdbApi';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/MovieCard';
import { useIsMobile } from '@/hooks/use-mobile';

const UpcomingMovies = () => {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setIsLoading(true);
        const response = await tmdbApi.getUpcomingMovies(currentPage);
        setUpcomingMovies(response.results);
        setTotalPages(Math.min(response.total_pages, 20)); // Limiting to 20 pages max
      } catch (error) {
        console.error('Failed to fetch upcoming movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-2">
            <Link to="/movies" className="flex items-center gap-1">
              <ChevronLeft size={isMobile ? 16 : 18} />
              {isMobile ? 'Retour' : 'Retour aux films'}
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold truncate">Films à venir</h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Découvrez les prochaines sorties de films au cinéma.
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-card rounded-lg aspect-[2/3]"></div>
                <div className="h-4 bg-card rounded mt-2 w-3/4"></div>
                <div className="h-3 bg-card rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {upcomingMovies.map(movie => (
              <MovieCard key={movie.id} item={movie} mediaType="movie" />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size={isMobile ? "sm" : "default"}
              >
                {isMobile ? '<' : 'Précédent'}
              </Button>
              
              <div className="flex gap-1">
                {[...Array(Math.min(isMobile ? 3 : 5, totalPages))].map((_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= (isMobile ? 3 : 5)) {
                    pageNumber = i + 1;
                  } else if (currentPage <= (isMobile ? 2 : 3)) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - (isMobile ? 1 : 2)) {
                    pageNumber = totalPages - (isMobile ? 2 : 4) + i;
                  } else {
                    pageNumber = currentPage - (isMobile ? 1 : 2) + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} p-0`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                size={isMobile ? "sm" : "default"}
              >
                {isMobile ? '>' : 'Suivant'}
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default UpcomingMovies;
