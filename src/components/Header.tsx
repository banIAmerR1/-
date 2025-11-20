import { Film, Search, Bell, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onSearch: (query: string) => void;
}

export function Header({ onNavigate, currentPage, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-black border-b border-red-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <img src="/r1.webp" alt="R1 Movies" className="h-10 w-10 object-contain" />
              <span className="text-red-600 font-bold text-2xl">R1 Movies</span>
            </button>

            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className={`text-sm font-medium transition ${
                  currentPage === 'home'
                    ? 'text-red-600'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('movies')}
                className={`text-sm font-medium transition ${
                  currentPage === 'movies'
                    ? 'text-red-600'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => onNavigate('series')}
                className={`text-sm font-medium transition ${
                  currentPage === 'series'
                    ? 'text-red-600'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                TV Series
              </button>
              {user && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`text-sm font-medium transition ${
                    currentPage === 'admin'
                      ? 'text-red-600'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Admin Dashboard
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies & series..."
                  className="bg-gray-900 text-white pl-4 pr-10 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {user && (
              <button
                onClick={() => onNavigate('notifications')}
                className="text-gray-300 hover:text-red-600 transition relative"
              >
                <Bell size={24} />
              </button>
            )}

            {user ? (
              <button
                onClick={signOut}
                className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-red-600 transition"
              >
                <LogOut size={20} />
                <span className="text-sm">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-red-600 transition"
              >
                <LogIn size={20} />
                <span className="text-sm">Admin Login</span>
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  onNavigate('home');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-300 hover:text-red-600 transition"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('movies');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-300 hover:text-red-600 transition"
              >
                Movies
              </button>
              <button
                onClick={() => {
                  onNavigate('series');
                  setIsMenuOpen(false);
                }}
                className="text-left text-gray-300 hover:text-red-600 transition"
              >
                TV Series
              </button>
              {user && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-300 hover:text-red-600 transition"
                >
                  Admin Dashboard
                </button>
              )}
              <form onSubmit={handleSearch} className="pt-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
