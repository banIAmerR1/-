import { useEffect, useState } from 'react';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import { supabase, type Movie, type Series } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [featuredSeries, setFeaturedSeries] = useState<Series[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [moviesRes, seriesRes, latestRes] = await Promise.all([
        supabase
          .from('movies')
          .select('*')
          .eq('featured', true)
          .limit(1),
        supabase
          .from('series')
          .select('*')
          .eq('featured', true)
          .limit(3),
        supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8)
      ]);

      if (moviesRes.data) setFeaturedMovies(moviesRes.data);
      if (seriesRes.data) setFeaturedSeries(seriesRes.data);
      if (latestRes.data) setLatestMovies(latestRes.data);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {featuredMovies[0] && (
        <div className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          {featuredMovies[0].poster_url && (
            <img
              src={featuredMovies[0].poster_url}
              alt={featuredMovies[0].title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {featuredMovies[0].title}
              </h1>
              <div className="flex items-center space-x-6 text-gray-300 mb-6">
                {featuredMovies[0].rating > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="fill-yellow-500 text-yellow-500" size={20} />
                    <span>{featuredMovies[0].rating.toFixed(1)}</span>
                  </div>
                )}
                {featuredMovies[0].release_year && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} />
                    <span>{featuredMovies[0].release_year}</span>
                  </div>
                )}
                {featuredMovies[0].duration && (
                  <div className="flex items-center space-x-2">
                    <Clock size={20} />
                    <span>{featuredMovies[0].duration} min</span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-lg max-w-2xl mb-8">
                {featuredMovies[0].description}
              </p>
              <button
                onClick={() => onNavigate('watch-movie', featuredMovies[0].slug)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition transform hover:scale-105"
              >
                <Play className="fill-white" size={24} />
                <span className="font-semibold">Watch Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Latest Movies</h2>
            <button
              onClick={() => onNavigate('movies')}
              className="text-red-600 hover:text-red-500 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {latestMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onNavigate('watch-movie', movie.slug)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-3">
                  {movie.poster_url && (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center transition duration-300">
                    <Play className="text-white opacity-0 group-hover:opacity-100 fill-white" size={48} />
                  </div>
                  {movie.rating > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded flex items-center space-x-1">
                      <Star className="fill-yellow-500 text-yellow-500" size={14} />
                      <span className="text-white text-sm">{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-semibold group-hover:text-red-600 transition line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-sm">{movie.release_year}</p>
              </div>
            ))}
          </div>
        </section>

        {featuredSeries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Featured TV Series</h2>
              <button
                onClick={() => onNavigate('series')}
                className="text-red-600 hover:text-red-500 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSeries.map((series) => (
                <div
                  key={series.id}
                  onClick={() => onNavigate('watch-series', series.slug)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 mb-3">
                    {series.poster_url && (
                      <img
                        src={series.poster_url}
                        alt={series.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center transition duration-300">
                      <Play className="text-white opacity-0 group-hover:opacity-100 fill-white" size={48} />
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg group-hover:text-red-600 transition">
                    {series.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{series.release_year} • {series.status}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
