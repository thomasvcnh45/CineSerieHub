
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { tmdbApi, Movie, TV } from '@/services/tmdbApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MovieCard from '@/components/MovieCard';

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<(Movie | TV)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const performSearch = async (query: string, page = 1, mediaType: 'all' | 'movie' | 'tv' = 'all') => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      let results;
      
      if (mediaType === 'movie') {
        const response = await tmdbApi.searchMovies(query, page);
        results = response.results;
        setTotalResults(response.total_results);
        setTotalPages(response.total_pages);
      } else if (mediaType === 'tv') {
        const response = await tmdbApi.searchTVShows(query, page);
        results = response.results;
        setTotalResults(response.total_results);
        setTotalPages(response.total_pages);
      } else {
        const response = await tmdbApi.searchMulti(query, page);
        // Filter out person results
        results = response.results.filter(item => 
          item.media_type === 'movie' || item.media_type === 'tv'
        );
        setTotalResults(response.total_results);
        setTotalPages(response.total_pages);
      }
      
      setSearchResults(results);
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(query)}${mediaType !== 'all' ? `&type=${mediaType}` : ''}${page > 1 ? `&page=${page}` : ''}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Extract query parameters
    const query = queryParams.get('q') || '';
    const type = queryParams.get('type') as 'all' | 'movie' | 'tv' || 'all';
    const page = parseInt(queryParams.get('page') || '1');
    
    if (query) {
      setSearchQuery(query);
      setMediaFilter(type);
      setCurrentPage(page);
      performSearch(query, page, type);
    }
  }, [location.search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch(searchQuery, 1, mediaFilter);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    performSearch(searchQuery, newPage, mediaFilter);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMediaFilterChange = (value: string) => {
    const mediaType = value as 'all' | 'movie' | 'tv';
    setMediaFilter(mediaType);
    setCurrentPage(1);
    performSearch(searchQuery, 1, mediaType);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Recherche</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Rechercher des films, séries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select 
              value={mediaFilter} 
              onValueChange={handleMediaFilterChange}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="movie">Films</SelectItem>
                <SelectItem value="tv">Séries</SelectItem>
              </SelectContent>
            </Select>
            
            <Button type="submit" className="gap-2">
              <SearchIcon size={18} />
              Rechercher
            </Button>
          </div>
        </form>
        
        {/* Results */}
        {searchQuery && (
          <div className="mb-8">
            {isLoading ? (
              <p>Recherche en cours...</p>
            ) : (
              totalResults > 0 ? (
                <p className="mb-4">
                  {totalResults} résultat{totalResults > 1 ? 's' : ''} pour "{searchQuery}"
                </p>
              ) : (
                <p className="mb-4">Aucun résultat trouvé pour "{searchQuery}"</p>
              )
            )}
          </div>
        )}
        
        {/* Results Grid */}
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
            {searchResults.map((item) => (
              <MovieCard 
                key={`${item.id}-${item.media_type || (('title' in item) ? 'movie' : 'tv')}`} 
                item={item} 
              />
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
              >
                Précédent
              </Button>
              
              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      className="w-10 h-10 p-0"
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
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
