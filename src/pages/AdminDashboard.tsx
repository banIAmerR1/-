import { useState, useEffect } from 'react';
import { Film, Tv, Plus, Edit2, Trash2, Save, X, Bell } from 'lucide-react';
import { supabase, type Movie, type Series, type MovieVideo, type Episode, type EpisodeVideo, type Notification } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

type Tab = 'movies' | 'series' | 'notifications';

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('movies');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [isAddingSeries, setIsAddingSeries] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    if (activeTab === 'movies') {
      const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
      if (data) setMovies(data);
    } else if (activeTab === 'series') {
      const { data } = await supabase.from('series').select('*').order('created_at', { ascending: false });
      if (data) setSeries(data);
    } else {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (data) setNotifications(data);
    }
  };

  const deleteMovie = async (id: string) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      await supabase.from('movies').delete().eq('id', id);
      loadData();
    }
  };

  const deleteSeries = async (id: string) => {
    if (confirm('Are you sure you want to delete this series?')) {
      await supabase.from('series').delete().eq('id', id);
      loadData();
    }
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    loadData();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your content</p>
        </div>

        <div className="flex space-x-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition ${
              activeTab === 'movies'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Film size={20} />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition ${
              activeTab === 'series'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tv size={20} />
            <span>TV Series</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition ${
              activeTab === 'notifications'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bell size={20} />
            <span>Notifications</span>
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.is_read).length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'movies' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setIsAddingMovie(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition"
              >
                <Plus size={20} />
                <span>Add New Movie</span>
              </button>
            </div>

            {(isAddingMovie || editingMovie) && (
              <MovieForm
                movie={editingMovie}
                onClose={() => {
                  setIsAddingMovie(false);
                  setEditingMovie(null);
                }}
                onSave={() => {
                  setIsAddingMovie(false);
                  setEditingMovie(null);
                  loadData();
                }}
              />
            )}

            <div className="grid gap-4">
              {movies.map((movie) => (
                <div key={movie.id} className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {movie.poster_url && (
                      <img src={movie.poster_url} alt={movie.title} className="w-16 h-24 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
                      <p className="text-gray-400 text-sm">{movie.release_year} • {movie.genre?.join(', ')}</p>
                      {movie.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingMovie(movie)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteMovie(movie.id)}
                      className="p-2 bg-red-900 hover:bg-red-800 text-white rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'series' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setIsAddingSeries(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition"
              >
                <Plus size={20} />
                <span>Add New Series</span>
              </button>
            </div>

            {(isAddingSeries || editingSeries) && (
              <SeriesForm
                series={editingSeries}
                onClose={() => {
                  setIsAddingSeries(false);
                  setEditingSeries(null);
                }}
                onSave={() => {
                  setIsAddingSeries(false);
                  setEditingSeries(null);
                  loadData();
                }}
              />
            )}

            <div className="grid gap-4">
              {series.map((s) => (
                <div key={s.id} className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {s.poster_url && (
                      <img src={s.poster_url} alt={s.title} className="w-16 h-24 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="text-white font-semibold text-lg">{s.title}</h3>
                      <p className="text-gray-400 text-sm">{s.release_year} • {s.status} • {s.genre?.join(', ')}</p>
                      {s.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingSeries(s)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteSeries(s.id)}
                      className="p-2 bg-red-900 hover:bg-red-800 text-white rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`bg-gray-900 rounded-lg p-6 ${!notif.is_read ? 'border-l-4 border-red-600' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2">{notif.title}</h3>
                      <p className="text-gray-400">{notif.message}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <button
                        onClick={() => markNotificationRead(notif.id)}
                        className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MovieForm({ movie, onClose, onSave }: { movie: Movie | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    poster_url: movie?.poster_url || '',
    trailer_url: movie?.trailer_url || '',
    release_year: movie?.release_year || new Date().getFullYear(),
    duration: movie?.duration || 0,
    genre: movie?.genre?.join(', ') || '',
    rating: movie?.rating || 0,
    slug: movie?.slug || '',
    meta_title: movie?.meta_title || '',
    meta_description: movie?.meta_description || '',
    meta_keywords: movie?.meta_keywords?.join(', ') || '',
    featured: movie?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      genre: formData.genre.split(',').map(g => g.trim()).filter(Boolean),
      meta_keywords: formData.meta_keywords.split(',').map(k => k.trim()).filter(Boolean),
    };

    if (movie) {
      await supabase.from('movies').update(data).eq('id', movie.id);
    } else {
      await supabase.from('movies').insert([data]);
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
              required
            />
            <input
              type="text"
              placeholder="Slug (URL) *"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
              required
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Poster URL"
              value={formData.poster_url}
              onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            />
            <input
              type="text"
              placeholder="Trailer URL"
              value={formData.trailer_url}
              onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Year"
              value={formData.release_year}
              onChange={(e) => setFormData({ ...formData, release_year: parseInt(e.target.value) })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            />
            <input
              type="number"
              placeholder="Duration (min)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            />
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="text-red-600"
              />
              <span>Featured</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Genres (comma-separated)"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
          />

          <input
            type="text"
            placeholder="Meta Title (SEO)"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
          />

          <textarea
            placeholder="Meta Description (SEO)"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            rows={2}
          />

          <input
            type="text"
            placeholder="Meta Keywords (comma-separated, for SEO)"
            value={formData.meta_keywords}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded flex items-center justify-center space-x-2 transition"
            >
              <Save size={20} />
              <span>Save Movie</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SeriesForm({ series, onClose, onSave }: { series: Series | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: series?.title || '',
    description: series?.description || '',
    poster_url: series?.poster_url || '',
    release_year: series?.release_year || new Date().getFullYear(),
    genre: series?.genre?.join(', ') || '',
    rating: series?.rating || 0,
    slug: series?.slug || '',
    meta_title: series?.meta_title || '',
    meta_description: series?.meta_description || '',
    meta_keywords: series?.meta_keywords?.join(', ') || '',
    featured: series?.featured || false,
    status: series?.status || 'ongoing',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      genre: formData.genre.split(',').map(g => g.trim()).filter(Boolean),
      meta_keywords: formData.meta_keywords.split(',').map(k => k.trim()).filter(Boolean),
    };

    if (series) {
      await supabase.from('series').update(data).eq('id', series.id);
    } else {
      await supabase.from('series').insert([data]);
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{series ? 'Edit Series' : 'Add New Series'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
              required
            />
            <input
              type="text"
              placeholder="Slug (URL) *"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
              required
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            rows={3}
          />

          <input
            type="text"
            placeholder="Poster URL"
            value={formData.poster_url}
            onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Year"
              value={formData.release_year}
              onChange={(e) => setFormData({ ...formData, release_year: parseInt(e.target.value) })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="text-red-600"
              />
              <span>Featured</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Genres (comma-separated)"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
          />

          <input
            type="text"
            placeholder="Meta Title (SEO)"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
          />

          <textarea
            placeholder="Meta Description (SEO)"
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
            rows={2}
          />

          <input
            type="text"
            placeholder="Meta Keywords (comma-separated, for SEO)"
            value={formData.meta_keywords}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded"
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded flex items-center justify-center space-x-2 transition"
            >
              <Save size={20} />
              <span>Save Series</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
