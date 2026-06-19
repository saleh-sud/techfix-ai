import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, Calendar, FileText } from 'lucide-react';
import { Post, Category } from '../types';
import SEOHelper from '../components/SEOHelper';

interface SearchViewProps {
  posts: Post[];
  categories: Category[];
  initialQuery?: string;
  onNavigate: (path: string) => void;
}

export default function SearchView({ posts, categories, initialQuery = '', onNavigate }: SearchViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam || initialQuery);
  const [results, setResults] = useState<Post[]>([]);

  // Sync state with url parameter when it changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    // Only search matching published posts
    const published = posts.filter(p => p.status === 'published');
    if (!query.trim()) {
      setResults(published);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const matches = published.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    setResults(matches);
  }, [query, posts]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-8">
      {/* SEO Tags */}
      <SEOHelper 
        title={`نتائج البحث عن: ${query || 'جميع المقالات'}`}
        description={`تصفح نتائج البحث التخصصي عن الأدوات الذكية، لغات البرمجة وشروحات سيو على موقعنا التقني TechFix AI.`}
        slug="search"
      />

      {/* Header index */}
      <div className="space-y-2 border-r-4 border-blue-600 pr-4">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">البحث الذكي في الموقع</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">ابحث عن أي أداة ذكاء اصطناعي، أو كود، أو دليل سيو متواجد بالأرشيف.</p>
      </div>

      {/* Modern Search bar widget */}
      <div className="relative max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="اكتب كلمة البحث باللغة العربية أو الإنجليزية..."
          className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
      </div>

      {/* Search results list */}
      <div className="space-y-4">
        <p className="text-xs text-slate-400 font-bold">وجدنا ({results.length}) نتيجة لموضوع البحث الخاص بك:</p>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((post) => (
              <div 
                key={post.id}
                onClick={() => onNavigate(`/post/${post.slug}`)}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-500 cursor-pointer transition-all duration-300 flex flex-col md:flex-row gap-5 items-start shadow-sm hover:shadow-md"
              >
                <div className="w-full md:w-36 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold">
                      {categories.find(c => c.id === post.category)?.name || post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-950 dark:text-white leading-relaxed ">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-300 shrink-0 self-center hidden md:block" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
            <FileText className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-500">لا توجد نتائج مطابقة لبحثك</p>
            <p className="text-xs text-gray-400">تأكد من كتابة الكلمات بشكل صحيح، أو ابحث عن كلمات عامة مثل "ذكاء" أو "تشفير".</p>
          </div>
        )}
      </div>
    </div>
  );
}
