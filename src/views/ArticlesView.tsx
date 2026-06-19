import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tag, Calendar, User, Search, RefreshCw, X, FolderOpen } from 'lucide-react';
import { Post, Category } from '../types';
import SEOHelper from '../components/SEOHelper';
import AdSensePlaceholder from '../components/AdSensePlaceholder';

interface ArticlesViewProps {
  posts: Post[];
  categories: Category[];
  initialCategory?: string;
  onNavigate: (path: string) => void;
}

export default function ArticlesView({ posts, categories, initialCategory, onNavigate }: ArticlesViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category') || undefined;
  const tagParam = searchParams.get('tag') || undefined;

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(tagParam || null);

  // Sync state if category or tag query params are updated
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory(initialCategory || 'all');
    }

    const tag = searchParams.get('tag');
    if (tag) {
      setSelectedTag(tag);
    } else {
      setSelectedTag(null);
    }
  }, [searchParams, initialCategory]);

  const publishedPosts = posts.filter(p => p.status === 'published');

  // Filter posts based on UI selection criteria
  const filteredPosts = publishedPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  // Collect some popular tags
  const allTags = Array.from(new Set(publishedPosts.flatMap(p => p.tags))).slice(0, 15);

  const currentCategoryName = selectedCategory !== 'all' 
    ? categories.find(c => c.id === selectedCategory)?.name || 'القسم المختار'
    : 'كل المقالات التقنية';

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedTag(null);
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  const handleTagSelect = (tag: string) => {
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    if (nextTag) {
      if (selectedCategory !== 'all') {
        setSearchParams({ category: selectedCategory, tag: nextTag });
      } else {
        setSearchParams({ tag: nextTag });
      }
    } else {
      if (selectedCategory !== 'all') {
        setSearchParams({ category: selectedCategory });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleClearFilters = () => {
    setSelectedTag(null);
    setSelectedCategory('all');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Dynamic SEO Meta Updating */}
      <SEOHelper 
        title={`${currentCategoryName} - مقالات متخصصة`}
        description={`تصفح أحدث المقالات التقنية، الشروحات البرمجية، ومراجعات أدوات الذكاء الاصطناعي في الفئة: ${currentCategoryName} على موقع TechFix AI المطور.`}
        slug={selectedCategory !== 'all' ? `posts?category=${selectedCategory}` : 'posts'}
      />

      {/* Header Info */}
      <div className="space-y-2 border-r-4 border-blue-600 pr-4">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
          {currentCategoryName}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          تتوفر مقالاتنا بشروحات كودية وصور حية لتحقيق الفائدة القصوى لبيئة عملك اليومية.
        </p>
      </div>

      {/* Control Filters Area */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Categories Tab selector */}
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">تصفية حسب التخصص</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:bg-slate-50'}`}
              >
                الجميع
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:bg-slate-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search box in articles list */}
          <div className="w-full md:w-80 relative">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">البحث السريع</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أداة أو كود..."
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-750 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Tags Selection Bar */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-805 flex flex-wrap items-center gap-2 animate-fadeIn">
            <span className="text-[11px] font-bold text-slate-400">الكلمات المفتاحية الأكثر طلباً:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-2 py-0.5 text-[10px] rounded transition-all cursor-pointer ${selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-250 dark:hover:bg-slate-755'}`}
              >
                #{tag}
              </button>
            ))}
            {(selectedTag || searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="mr-auto text-[10px] text-red-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                إلغاء الفلاتر
              </button>
            )}
          </div>
        )}
      </div>

      {/* AdSense Placement */}
      <AdSensePlaceholder type="banner" slotId="middle-category-banner" />

      {/* Articles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate(`/post/${post.slug}`)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/60 hover:shadow-md transition-all duration-300 flex flex-col h-full hover:border-slate-350"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-850 shrink-0">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-gray-900/85 text-white backdrop-blur-xs">
                  {categories.find(c => c.id === post.category)?.name || post.category}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1 space-y-2.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' })}
                  </span>
                  <span className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-all">
                    عرض المقال
                  </span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-205 dark:border-slate-800/80 text-center text-gray-500 space-y-3">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-sm font-bold">لم نجد مقالات مطابقة للمعايير المحددة.</p>
            <p className="text-xs text-gray-400">حاول التصفية بقسم آخر أو تقليص عدد كلمات الاستعلام في مربع البحث.</p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 mt-2 font-bold text-xs bg-brand-blue text-white rounded-xl cursor-pointer"
            >
              عرض كافة التقارير
            </button>
          </div>
        )}
      </div>

      {/* AdSense Bottom Leaderboard */}
      <AdSensePlaceholder type="banner" slotId="bottom-articles-banner" />
    </div>
  );
}
