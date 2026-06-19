import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDatabase } from './hooks/useDatabase';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Layout structure imports
import Header from './components/Header';
import Footer from './components/Footer';

// Page Views imports
import HomeView from './views/HomeView';
import ArticlesView from './views/ArticlesView';
import ArticleSingleView from './views/ArticleSingleView';
import CategoriesView from './views/CategoriesView';
import SearchView from './views/SearchView';
import AboutView from './views/AboutView';
import ContactView from './views/ContactView';
import PrivacyView from './views/PrivacyView';
import DisclaimerView from './views/DisclaimerView';
import AdminView from './views/AdminView';

// Article wrapper to decode useParams for backward compatibility of ArticleSingleView
function ArticleSingleWrapper({ posts, categories, onNavigate }: { posts: any[]; categories: any[]; onNavigate: any }) {
  const { slug } = useParams();
  return (
    <ArticleSingleView
      slug={slug || ''}
      posts={posts}
      categories={categories}
      onNavigate={onNavigate}
    />
  );
}

// Beautiful Custom 404 Not Found Page
function NotFoundView({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="py-20 text-center space-y-6 max-w-md mx-auto select-none">
      <div className="text-7xl font-black text-indigo-200 dark:text-slate-800 font-mono tracking-widest animate-pulse">404</div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white">ط§ظ„طµظپط­ط© ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط©</h1>
      <p className="text-xs text-gray-500 leading-relaxed">
        ط¹ط°ط±ط§ظ‹! ظٹط¨ط¯ظˆ ط£ظ† ط§ظ„ط±ط§ط¨ط· ط§ظ„ط°ظٹ ط­ط§ظˆظ„طھ ط§ظ„ظˆطµظˆظ„ ط¥ظ„ظٹظ‡ ط؛ظٹط± ظ…طھظˆظپط± ط£ظˆ طھظ… ظ†ظ‚ظ„ظ‡ ظپظٹ ط¨ظ†ظٹط© ط§ظ„ط³ظٹظˆ ط§ظ„ط¬ط¯ظٹط¯ط© ظ„ظ€ TechFix AI.
      </p>
      <button
        onClick={() => onNavigate('/')}
        className="px-6 py-2.5 font-bold text-xs bg-brand-blue hover:bg-brand-blue/80 text-white rounded-xl cursor-pointer shadow-md transition-colors"
      >
        ط§ظ„ط¹ظˆط¯ط© ظ„ظ„طµظپط­ط© ط§ظ„ط±ط¦ظٹط³ظٹط©
      </button>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('techfix_dark_mode') === 'true';
  });
  const [adminUser, setAdminUser] = useState<boolean>(false);

  // Load database hooks representing our Firestore أ؛nica source
  const {
    posts,
    categories,
    loading,
    dbError,
    savePost,
    removePost,
    saveCategory,
    removeCategory,
    submitContactForm
  } = useDatabase();

  // Listen to Auth for Header and fast status updates using the env variable securely
  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'hadi681sa@gmail.com';
    const unsub = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setAdminUser(usr.email === adminEmail);
      } else {
        setAdminUser(false);
      }
    });
    return () => unsub();
  }, []);

  // Update light/dark CSS classes on change
  useEffect(() => {
    localStorage.setItem('techfix_dark_mode', String(isDarkMode));
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const currentThemeMode = isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900';

  return (
    <div className={`min-h-screen flex flex-col font-sans arabic-rtl ${currentThemeMode} transition-colors duration-300`}>
      {/* 1. Header Navigation */}
      <Header
        categories={categories}
        currentPath={currentPath}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        onNavigate={navigate}
        isAdminLoggedIn={adminUser}
      />

      {/* 2. Primary Layout Grid Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 relative animate-fadeIn">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500">ط¬ط§ط±ظٹ طھظ†ط¸ظٹظ… ظ…ط³طھظˆط¯ط¹ط§طھ ط§ظ„ظ…ظ‚ط§ظ„ط§طھ ظˆط§ظ„ط³ظٹظˆ ظ„ظ€ TechFix AI...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomeView posts={posts} categories={categories} onNavigate={navigate} />} />
            <Route path="/posts" element={<ArticlesView posts={posts} categories={categories} onNavigate={navigate} />} />
            <Route path="/post/:slug" element={<ArticleSingleWrapper posts={posts} categories={categories} onNavigate={navigate} />} />
            <Route path="/categories" element={<CategoriesView categories={categories} posts={posts} onNavigate={navigate} />} />
            <Route path="/search" element={<SearchView posts={posts} categories={categories} onNavigate={navigate} />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/contact" element={<ContactView onSubmit={submitContactForm} />} />
            <Route path="/privacy" element={<PrivacyView />} />
            <Route path="/disclaimer" element={<DisclaimerView />} />
            <Route path="/admin" element={
              adminUser ? (
                <AdminView
                  posts={posts}
                  categories={categories}
                  onSavePost={savePost}
                  onRemovePost={removePost}
                  onSaveCategory={saveCategory}
                  onRemoveCategory={removeCategory}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
            <Route path="*" element={<NotFoundView onNavigate={navigate} />} />
          </Routes>
        )}
      </main>

      {/* 3. Footer Section with Hadi Saleh custom signature */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

