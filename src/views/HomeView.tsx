import { useState } from 'react';
import { ArrowLeft, Cpu, Sparkles, Flame, Tag, Calendar, User, Eye, ArrowLeftRight } from 'lucide-react';
import { Post, Category } from '../types';
import AdSensePlaceholder from '../components/AdSensePlaceholder';

interface HomeViewProps {
  posts: Post[];
  categories: Category[];
  onNavigate: (path: string) => void;
}

export default function HomeView({ posts, categories, onNavigate }: HomeViewProps) {
  // Only show published articles for standard visitors
  const publishedPosts = posts.filter(p => p.status === 'published');
  const featuredPost = publishedPosts[0] || null;
  const recentPosts = publishedPosts.slice(1, 4);
  const allOtherPosts = publishedPosts.slice(4);

  return (
    <div className="space-y-12">
      {/* 1. Hero Dynamic Spotlight */}
      {featuredPost && (
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 md:p-12 border border-slate-800 shadow-2xl transition-all hover:border-brand-cyan/20 duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/60 to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105"
            style={{ backgroundImage: `url(${featuredPost.featuredImage})` }}
          />

          <div className="relative z-20 max-w-3xl flex flex-col justify-end h-full min-h-[300px] space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                المقال المميز اليوم
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                {categories.find(c => c.id === featuredPost.category)?.name || featuredPost.category}
              </span>
            </div>

            <h1 
              onClick={() => onNavigate(`/post/${featuredPost.slug}`)}
              className="text-2xl md:text-4xl font-extrabold tracking-tight leading-relaxed cursor-pointer hover:text-brand-cyan transition-colors"
            >
              {featuredPost.title}
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2">
              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(featuredPost.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                فريق التحرير
              </span>
              <button 
                onClick={() => onNavigate(`/post/${featuredPost.slug}`)}
                className="mr-auto flex items-center gap-1 group font-bold text-brand-cyan hover:text-white transition-colors"
              >
                اقرأ الآن
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* AdSense Top Leaderboard */}
      <AdSensePlaceholder type="banner" slotId="top-home-leaderboard" />

      {/* 2. Grid Categories Quick Links */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">الأقسام والاهتمامات التكنولوجية</h2>
          </div>
          <button 
            onClick={() => onNavigate('/categories')}
            className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            تصفح كل الفئات
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => {
            const count = publishedPosts.filter(p => p.category === cat.id).length;
            return (
              <div 
                key={cat.id}
                onClick={() => onNavigate(`/posts?category=${cat.id}`)}
                className="group cursor-pointer p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 px-2.5 rounded-lg bg-blue-100/50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold text-xs">
                    {cat.name.slice(0, 2)}
                  </div>
                  <span className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded text-slate-500 font-mono">
                    {count} مقال
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Bento Recent Articles Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Sparkles className="w-5 h-5 font-bold" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">جديد المقالات والأدوات الذكية</h2>
          </div>
          <button 
            onClick={() => onNavigate('/posts')}
            className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            جميع المقالات
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <article 
                key={post.id}
                onClick={() => onNavigate(`/post/${post.slug}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-900/85 text-white backdrop-blur-xs">
                    {categories.find(c => c.id === post.category)?.name || post.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1 space-y-2.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' })}
                    </span>
                    <span className="flex items-center gap-1 hover:text-brand-cyan font-bold transition-colors">
                      قراءة
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[-3px]" />
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
              لا توجد مقالات مضافة حالياً. سجل دخولك كآدمن لإدراج مقالاتك الأولى.
            </div>
          )}
        </div>
      </section>

      {/* AdSense Native Inline Content Ad */}
      <AdSensePlaceholder type="native" slotId="mid-home-native" />

      {/* 4. Archives Listing & Monetization Info */}
      {allOtherPosts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
            المزيد من الأرشيف والمقالات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allOtherPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => onNavigate(`/post/${post.slug}`)}
                className="group cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-white dark:bg-slate-900/40 flex items-center gap-4 transition-all duration-300 shadow-sm"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Dynamic Newsletter & Sells Anchor */}
      <section className="p-8 rounded-3xl bg-indigo-500/10 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 text-center space-y-3">
        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200">اشترك في نشرتنا البريدية التقنية</h3>
        <p className="text-xs text-indigo-700 dark:text-indigo-400 max-w-xl mx-auto leading-relaxed">
          انضم إلى أكثر من 18K مهندس ومطور ومستخدم ذكي يتلقون أسبوعياً مراجعات الأدوات الذكية الذكية، الأكواد، وحصريات سيو التقنية من TechFix AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
          <input 
            type="email" 
            placeholder="بريدك الإلكتروني التخصصي..." 
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-indigo-200 focus:outline-none focus:border-indigo-500 dark:bg-slate-900 dark:text-white dark:border-indigo-900" 
          />
          <button className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">
            تأكيد الاشتراك
          </button>
        </div>
      </section>
    </div>
  );
}
