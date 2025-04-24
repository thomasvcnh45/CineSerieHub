
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilmIcon, TvIcon, HomeIcon, TrendingUpIcon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navLinks = [
    { to: '/', icon: <HomeIcon size={18} />, label: 'Accueil' },
    { to: '/movies', icon: <FilmIcon size={18} />, label: 'Films' },
    { to: '/tv', icon: <TvIcon size={18} />, label: 'Séries' },
    { to: '/trending', icon: <TrendingUpIcon size={18} />, label: 'Tendances' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <FilmIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CinéSérieHub</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="nav-link flex items-center gap-1.5">
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center max-w-xs w-full relative"
          >
            <Input
              type="search"
              placeholder="Rechercher films, séries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-secondary/40 border-secondary focus-visible:ring-primary"
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className="absolute right-0"
            >
              <SearchIcon size={18} />
            </Button>
          </form>

          {/* Mobile Menu */}
          {isMobile && (
            <div className="md:hidden flex items-center">
              {/* Search Icon for Mobile */}
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                className="mr-2"
              >
                <Link to="/search">
                  <SearchIcon size={20} />
                </Link>
              </Button>
              
              {/* Hamburger Menu */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
              
              {/* Mobile Menu Dropdown */}
              {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-card shadow-lg animate-fade-in">
                  <div className="container mx-auto p-4">
                    <div className="flex flex-col space-y-4">
                      {navLinks.map((link) => (
                        <Link 
                          key={link.to} 
                          to={link.to} 
                          className="flex items-center gap-2 py-2 px-4 hover:bg-primary/10 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
