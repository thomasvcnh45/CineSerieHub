
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, FilmIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card mt-auto py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FilmIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CinéSérieHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Votre plateforme intuitive de découverte de films et séries.
              Aucune inscription requise, juste le plaisir de trouver de nouvelles œuvres !
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/movies" className="text-sm hover:text-primary transition-colors">Films</Link></li>
              <li><Link to="/tv" className="text-sm hover:text-primary transition-colors">Séries</Link></li>
              <li><Link to="/trending" className="text-sm hover:text-primary transition-colors">Tendances</Link></li>
              <li><Link to="/search" className="text-sm hover:text-primary transition-colors">Recherche</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Genres populaires</h3>
            <ul className="space-y-2">
              <li><Link to="/movies/genre/28" className="text-sm hover:text-primary transition-colors">Action</Link></li>
              <li><Link to="/movies/genre/35" className="text-sm hover:text-primary transition-colors">Comédie</Link></li>
              <li><Link to="/movies/genre/18" className="text-sm hover:text-primary transition-colors">Drame</Link></li>
              <li><Link to="/movies/genre/27" className="text-sm hover:text-primary transition-colors">Horreur</Link></li>
              <li><Link to="/tv/genre/10765" className="text-sm hover:text-primary transition-colors">Science-Fiction</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              CinéSérieHub utilise l'API The Movie Database (TMDb) pour fournir des informations à jour sur les films et séries.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            Les données sont fournies par <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TMDb</a>. 
            Ce site n'est pas affilié à TMDb.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} CinéSérieHub. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
