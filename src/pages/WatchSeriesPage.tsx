import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Calendar, Play } from 'lucide-react';
import { supabase, type Series, type Episode, type EpisodeVideo } from '../lib/supabase';

interface WatchSeriesPageProps {
  slug: string;
  onNavigate: (page: string) => void;
}

export function WatchSeriesPage({ slug, onNavigate }: WatchSeriesPageProps) {
  const [series, setSeries] = useState<Series | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [videos, setVideos] = useState<EpisodeVideo[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeries();
  }, [slug]);

  useEffect(() => {
    if (selectedEpisode) {
      loadEpisodeVideos(selectedEpisode.id);
    }
  }, [selectedEpisode]);

  const loadSeries = async () => {
    try {
      const { data: seriesData, error: seriesError } = await supabase
        .from('series')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (seriesError) throw seriesError;

      if (seriesData) {
        setSeries(seriesData);

        const { data: episodesData, error: episodesError } = await supabase
          .from('episodes')
          .select('*')
          .eq('series_id', seriesData.id)
          .order('season_number', { ascending: true })
          .order('episode_number', { ascending: true });

        if (episodesError) throw episodesError;

        if (episodesData && episodesData.length > 0) {
          setEpisodes(episodesData);
          setSelectedEpisode(episodesData[0]);
        }
      }
    } catch (error) {
      console.error('Error loading series:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodeVideos = async (episodeId: string) => {
    try {
      const { data, error } = await supabase
        .from('episode_videos')
        .select('*')
        .eq('episode_id', episodeId)
        .order('quality', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setVideos(data);
        setSelectedQuality(data[0].quality);
      } else {
        setVideos([]);
        setSelectedQuality('');
      }
    } catch (error) {
      console.error('Error loading episode videos:', error);
    }
  };

  const seasons = Array.from(new Set(episodes.map(e => e.season_number))).sort((a, b) => a - b);
  const seasonEpisodes = episodes.filter(e => e.season_number === selectedSeason);
  const currentVideo = videos.find(v => v.quality === selectedQuality);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 text-xl">Loading series...</div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Series not found</h2>
          <button
            onClick={() => onNavigate('series')}
            className="text-red-600 hover:text-red-500"
          >
            Back to TV Series
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('series')}
          className="flex items-center space-x-2 text-gray-300 hover:text-red-600 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to TV Series</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
              {currentVideo && selectedEpisode ? (
                <div className="relative aspect-video bg-black">
                  <video
                    key={currentVideo.video_url}
                    controls
                    controlsList="nodownload"
                    className="w-full h-full"
                    poster={selectedEpisode.thumbnail_url || series.poster_url}
                  >
                    <source src={currentVideo.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-400">
                    {selectedEpisode ? 'No video available' : 'Select an episode to watch'}
                  </p>
                </div>
              )}

              {selectedEpisode && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    S{selectedEpisode.season_number}E{selectedEpisode.episode_number} - {selectedEpisode.title}
                  </h2>
                  {selectedEpisode.description && (
                    <p className="text-gray-300">{selectedEpisode.description}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{series.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                {series.rating > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="fill-yellow-500 text-yellow-500" size={20} />
                    <span>{series.rating.toFixed(1)}</span>
                  </div>
                )}
                {series.release_year && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} />
                    <span>{series.release_year}</span>
                  </div>
                )}
                <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                  {series.status?.toUpperCase()}
                </span>
              </div>
              {series.genre && series.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {series.genre.map((g) => (
                    <span key={g} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              {series.description && (
                <p className="text-gray-300 leading-relaxed">{series.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {videos.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Quality</h3>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedQuality(video.quality)}
                      className={`w-full px-4 py-2 rounded text-sm font-medium transition ${
                        selectedQuality === video.quality
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {video.quality}
                      {video.file_size && (
                        <span className="text-xs ml-2 opacity-70">({video.file_size})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Seasons</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {seasons.map((season) => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`px-4 py-2 rounded text-sm font-medium transition ${
                      selectedSeason === season
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Season {season}
                  </button>
                ))}
              </div>

              <h4 className="text-white font-semibold mb-3">Episodes</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {seasonEpisodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => setSelectedEpisode(episode)}
                    className={`w-full text-left p-3 rounded transition ${
                      selectedEpisode?.id === episode.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Play size={16} className="mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {episode.episode_number}. {episode.title}
                        </p>
                        {episode.duration && (
                          <p className="text-xs opacity-70">{episode.duration} min</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
