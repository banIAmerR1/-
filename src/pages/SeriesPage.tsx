import { useEffect, useState } from 'react';
import { Play, Star, Search, Filter } from 'lucide-react';
import { supabase, type Series } from '../lib/supabase';

interface SeriesPageProps {
  onNavigate: (page: string, id?: string) => void;
  searchQuery?: string;
}

export function SeriesPage({ onNavigate, searchQuery }: SeriesPageProps) {
  const [series, setSeries] = useState<Series[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    loadSeries();
  }, []);

  useEffect(() => {
    filterSeries();
  }, [searchQuery, selectedGenre, series]);

  const loadSeries = async () => {
    try {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setSeries(data);
        const allGenres = new Set<string>();
        data.forEach(s => {
          s.genre?.forEach(g => allGenres.add(g));
        });
        setGenres(Array.from(allGenres).sort());
      }
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSeries = () => {
    let filtered = [...series];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query)
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(s =>
        s.genre?.includes(selectedGenre)
      );
    }

    setFilteredSeries(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 text-xl">Loading TV series...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">TV Series</h1>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center space-x-2 text-gray-300">
              <Filter size={20} />
              <span className="text-sm">Filter by genre:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedGenre === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedGenre === genre
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredSeries.length === 0 ? (
          <div className="text-center py-20">
            <Search className="mx-auto text-gray-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No series found</h2>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredSeries.map((s) => (
              <div
                key={s.id}
                onClick={() => onNavigate('watch-series', s.slug)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-3">
                  {s.poster_url ? (
                    <img
                      src={s.poster_url}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center transition duration-300">
                    <Play className="text-white opacity-0 group-hover:opacity-100 fill-white" size={48} />
                  </div>
                  {s.rating > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded flex items-center space-x-1">
                      <Star className="fill-yellow-500 text-yellow-500" size={14} />
                      <span className="text-white text-sm">{s.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-white text-xs font-bold">
                    {s.status?.toUpperCase()}
                  </div>
                </div>
                <h3 className="text-white font-semibold group-hover:text-red-600 transition line-clamp-2">
                  {s.title}
                </h3>
                <p className="text-gray-400 text-sm">{s.release_year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
