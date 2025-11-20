import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Clock, Calendar, Download } from 'lucide-react';
import { supabase, type Movie, type MovieVideo } from '../lib/supabase';

interface WatchMoviePageProps {
  slug: string;
  onNavigate: (page: string) => void;
}

export function WatchMoviePage({ slug, onNavigate }: WatchMoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<MovieVideo[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovie();
  }, [slug]);

  const loadMovie = async () => {
    try {
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (movieError) throw movieError;

      if (movieData) {
        setMovie(movieData);

        const { data: videosData, error: videosError } = await supabase
          .from('movie_videos')
          .select('*')
          .eq('movie_id', movieData.id)
          .order('quality', { ascending: false });

        if (videosError) throw videosError;

        if (videosData && videosData.length > 0) {
          setVideos(videosData);
          setSelectedQuality(videosData[0].quality);
        }
      }
    } catch (error) {
      console.error('Error loading movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentVideo = videos.find(v => v.quality === selectedQuality);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 text-xl">Loading movie...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <button
            onClick={() => onNavigate('movies')}
            className="text-red-600 hover:text-red-500"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('movies')}
          className="flex items-center space-x-2 text-gray-300 hover:text-red-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Movies</span>
        </button>

        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {currentVideo ? (
            <div className="relative aspect-video bg-black">
              <video
                key={currentVideo.video_url}
                controls
                controlsList="nodownload"
                className="w-full h-full"
                poster={movie.poster_url}
              >
                <source src={currentVideo.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400">No video available</p>
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1 mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                  {movie.rating > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="fill-yellow-500 text-yellow-500" size={20} />
                      <span>{movie.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {movie.release_year && (
                    <div className="flex items-center space-x-2">
                      <Calendar size={20} />
                      <span>{movie.release_year}</span>
                    </div>
                  )}
                  {movie.duration && (
                    <div className="flex items-center space-x-2">
                      <Clock size={20} />
                      <span>{movie.duration} min</span>
                    </div>
                  )}
                </div>
                {movie.genre && movie.genre.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genre.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {videos.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Quality</h3>
                  <div className="space-y-2">
                    {videos.map((video) => (
                      <button
                        key={video.id}
                        onClick={() => setSelectedQuality(video.quality)}
                        className={`w-full px-4 py-2 rounded text-sm font-medium transition ${
                          selectedQuality === video.quality
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {video.quality}
                        {video.file_size && (
                          <span className="text-xs ml-2 opacity-70">
                            ({video.file_size})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {movie.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>
            )}

            {movie.trailer_url && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Trailer</h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video controls className="w-full h-full">
                    <source src={movie.trailer_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
