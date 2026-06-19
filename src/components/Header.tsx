import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Search, Command, Menu, X, ShieldAlert } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  categories: Category[];
  currentPath: string;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onNavigate: (path: string) => void;
  isAdminLoggedIn: boolean;
}

export default function Header({
  categories,
  currentPath,
  isDarkMode,
  onThemeToggle,
  onNavigate,
  isAdminLoggedIn
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fastSearchQuery, setFastSearchQuery] = useState('');

  const navLinks = [
    { label: 'الرئيسية', path: '/' },
    { label: 'المقالات التقنية', path: '/posts' },
    { label: 'الأقسام والاهتمامات', path: '/categories' },
    { label: 'من نحن', path: '/about' },
    { label: 'اتصل بنا', path: '/contact' }
  ];

  const handleFastSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fastSearchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(fastSearchQuery.trim())}`);
      setFastSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-gray-150 dark:border-slate-850 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* LOGO area */}
        <div 
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 cursor-pointer shrink-0 font-black group"
        >
          <div className="p-2rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-current animate-pulse text-amber-300" />
          </div>
          <span className="text-xl tracking-tight text-gray-900 dark:text-white font-extrabold">
            TechFix <span className="text-brand-cyan">AI</span>
          </span>
        </div>

        {/* Desktop navigation bar */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${isActive ? 'bg-brand-blue/10 text-brand-blue dark:text-brand-cyan' : 'text-gray-655 hover:text-brand-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-900'}`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Search, Dark mode, and admin control panel indicator */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Fast Search input */}
          <form onSubmit={handleFastSearchSubmit} className="relative">
            <input
              type="text"
              value={fastSearchQuery}
              onChange={(e) => setFastSearchQuery(e.target.value)}
              placeholder="ابحث هنا..."
              className="w-40 xl:w-48 pl-3 pr-8 py-1.5 text-xs rounded-xl bg-gray-50 border border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800 focus:outline-none focus:w-56 transition-all duration-300"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
          </form>

          {/* Theme switcher toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-150 dark:bg-slate-900 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 cursor-pointer border border-gray-100 dark:border-slate-800 transition-colors"
            title={isDarkMode ? "تفعيل المود المضيء" : "تفعيل المود المظلم"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Admin controller links */}
          <button
            onClick={() => onNavigate('/admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${currentPath === '/admin' ? 'bg-brand-blue text-white' : 'bg-slate-950 dark:bg-slate-900 hover:opacity-90 text-white'}`}
          >
            {isAdminLoggedIn ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>الآدمن مفعل!</span>
              </>
            ) : (
              <>
                <Command className="w-3.5 h-3.5" />
                <span>لوحة التحكم</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile controls bar (Phone/Tablet) */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Theme Switcher */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl bg-gray-50 border border-gray-150 dark:bg-slate-900 dark:border-slate-800 text-gray-500 cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Hamburger Drawer */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-50 border border-gray-150 dark:bg-slate-900 dark:border-slate-800 text-gray-800 dark:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 border-b border-gray-200 dark:border-slate-800 py-4 px-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => { onNavigate(link.path); setMobileMenuOpen(false); }}
                  className={`w-full py-2.5 text-right font-bold text-xs rounded-xl transition-all ${isActive ? 'bg-brand-blue/10 text-brand-blue pr-3' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <form onSubmit={handleFastSearchSubmit} className="relative">
            <input
              type="text"
              value={fastSearchQuery}
              onChange={(e) => setFastSearchQuery(e.target.value)}
              placeholder="البحث في مقالات الذكاء الاصطناعي..."
              className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          </form>

          <button
            onClick={() => { onNavigate('/admin'); setMobileMenuOpen(false); }}
            className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Command className="w-3.5 h-3.5" />
            <span>لوحة تحكم المسؤول</span>
          </button>
        </div>
      )}
    </header>
  );
}
