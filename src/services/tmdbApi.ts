export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  media_type?: string; // Added for multi-search results
}

export interface TV {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
  original_title?: string;
  title?: string;
  media_type?: string; // Added for multi-search results
  release_date?: string; // Added for compatibility with Movie type
}

export interface Genre {
  id: number;
  name: string;
}

// Image URLs and sizes
export const IMG_BASE_URL = 'https://image.tmdb.org/t/p/';

export const BACKDROP_SIZE = {
  SMALL: 'w300',
  MEDIUM: 'w780',
  LARGE: 'w1280',
  ORIGINAL: 'original'
};

export const POSTER_SIZE = {
  SMALL: 'w154',
  MEDIUM: 'w342',
  LARGE: 'w500',
  ORIGINAL: 'original'
};

// Movie details interface
export interface MovieDetails extends Movie {
  belongs_to_collection: null | {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  revenue: number;
  runtime: number;
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits?: {
    cast: {
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
    }[];
    crew: {
      id: number;
      name: string;
      profile_path: string | null;
      job: string;
    }[];
  };
}

// TV details interface
export interface TVDetails extends TV {
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
  };
  next_episode_to_air: null | object;
  networks: {
    name: string;
    id: number;
    logo_path: string | null;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
  status: string;
  type: string;
  tagline?: string; // Add optional tagline property for TV
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits?: {
    cast: {
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
    }[];
    crew: {
      id: number;
      name: string;
      profile_path: string | null;
      job: string;
    }[];
  };
}

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const baseUrl = 'https://api.themoviedb.org/3';
const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

// General fetch function with authentication
const fetchFromApi = async (endpoint: string, params: Record<string, string | number> = {}) => {
  if (!apiKey) {
    throw new Error('Missing VITE_TMDB_API_KEY environment variable');
  }
  
  const queryParams = new URLSearchParams();

  queryParams.append('api_key', apiKey);
  queryParams.append('language', 'fr-FR');

  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });

  const response = await fetch(`${baseUrl}${endpoint}?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const tmdbApi = {
  // Get popular movies
  getPopularMovies: async (page: number = 1) => {
    return fetchFromApi('/movie/popular', { page });
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1) => {
    return fetchFromApi('/movie/top_rated', { page });
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1) => {
    return fetchFromApi('/movie/now_playing', { page });
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1) => {
    return fetchFromApi('/movie/upcoming', { page });
  },

  // Get movie genres
  getMovieGenres: async () => {
    return fetchFromApi('/genre/movie/list');
  },

  // Get movie details
  getMovieDetails: async (movieId: number) => {
    return fetchFromApi(`/movie/${movieId}`, { append_to_response: 'videos,credits' });
  },

  // Get popular TV shows
  getPopularTVShows: async (page: number = 1) => {
    return fetchFromApi('/tv/popular', { page });
  },

  // Get top rated TV shows
  getTopRatedTVShows: async (page: number = 1) => {
    return fetchFromApi('/tv/top_rated', { page });
  },

  // Get TV genres
  getTVGenres: async () => {
    return fetchFromApi('/genre/tv/list');
  },

  // Get TV show details
  getTVDetails: async (tvId: number) => {
    return fetchFromApi(`/tv/${tvId}`, { append_to_response: 'videos,credits' });
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1) => {
    return fetchFromApi('/search/movie', { query, page });
  },

  // Search TV shows
  searchTVShows: async (query: string, page: number = 1) => {
    return fetchFromApi('/search/tv', { query, page });
  },

  // Search movies and TV shows together
  searchMulti: async (query: string, page: number = 1) => {
    return fetchFromApi('/search/multi', { query, page });
  },

  // Get trending (all: movies and TV)
  getTrending: async (timeWindow: 'day' | 'week' = 'day', page: number = 1) => {
    return fetchFromApi(`/trending/all/${timeWindow}`, { page });
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'day', page: number = 1) => {
    return fetchFromApi(`/trending/movie/${timeWindow}`, { page });
  },

  // Get trending TV shows
  getTrendingTVShows: async (timeWindow: 'day' | 'week' = 'day', page: number = 1) => {
    return fetchFromApi(`/trending/tv/${timeWindow}`, { page });
  },

  // Discover movies by genre(s)
  discoverMoviesByGenre: async (genreId: number, page: number = 1) => {
    return fetchFromApi('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      include_adult: 'false',
      page
    });
  },

  // Discover movies by multiple genres
  discoverMoviesByGenres: async (genreIds: string, page: number = 1) => {
    return fetchFromApi('/discover/movie', {
      with_genres: genreIds,
      sort_by: 'popularity.desc',
      include_adult: 'false',
      page
    });
  },

  // Discover TV shows by genre
  discoverTVShowsByGenre: async (genreId: number, page: number = 1) => {
    return fetchFromApi('/discover/tv', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      include_adult: 'false',
      page
    });
  },

  // Discover TV shows by multiple genres
  discoverTVShowsByGenres: async (genreIds: string, page: number = 1) => {
    return fetchFromApi('/discover/tv', {
      with_genres: genreIds,
      sort_by: 'popularity.desc',
      include_adult: 'false',
      page
    });
  },
};