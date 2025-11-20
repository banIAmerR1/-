import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { SeriesPage } from './pages/SeriesPage';
import { WatchMoviePage } from './pages/WatchMoviePage';
import { WatchSeriesPage } from './pages/WatchSeriesPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

type Page = 'home' | 'movies' | 'series' | 'watch-movie' | 'watch-series' | 'login' | 'admin' | 'notifications';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const title = document.querySelector('title');
    if (title) {
      const defaultTitle = title.getAttribute('data-default') || 'R1 Movies - Watch Movies & TV Series Online';

      switch (currentPage) {
        case 'home':
          title.textContent = 'R1 Movies - Watch Movies & TV Series Online';
          break;
        case 'movies':
          title.textContent = 'Movies - R1 Movies';
          break;
        case 'series':
          title.textContent = 'TV Series - R1 Movies';
          break;
        case 'login':
          title.textContent = 'Admin Login - R1 Movies';
          break;
        case 'admin':
          title.textContent = 'Admin Dashboard - R1 Movies';
          break;
        default:
          title.textContent = defaultTitle;
      }
    }
  }, [currentPage]);

  const handleNavigate = (page: string, slug?: string) => {
    setCurrentPage(page as Page);
    if (slug) setCurrentSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage === 'home') {
      setCurrentPage('movies');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'movies':
        return <MoviesPage onNavigate={handleNavigate} searchQuery={searchQuery} />;
      case 'series':
        return <SeriesPage onNavigate={handleNavigate} searchQuery={searchQuery} />;
      case 'watch-movie':
        return <WatchMoviePage slug={currentSlug} onNavigate={handleNavigate} />;
      case 'watch-series':
        return <WatchSeriesPage slug={currentSlug} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showHeaderFooter = currentPage !== 'login';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        {showHeaderFooter && (
          <Header
            onNavigate={handleNavigate}
            currentPage={currentPage}
            onSearch={handleSearch}
          />
        )}
        <main>{renderPage()}</main>
        {showHeaderFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
