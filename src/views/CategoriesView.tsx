import { Category, Post } from '../types';
import SEOHelper from '../components/SEOHelper';
import AdSensePlaceholder from '../components/AdSensePlaceholder';

interface CategoriesViewProps {
  categories: Category[];
  posts: Post[];
  onNavigate: (path: string) => void;
}

export default function CategoriesView({ categories, posts, onNavigate }: CategoriesViewProps) {
  const publishedPosts = posts.filter(p => p.status === 'published');

  return (
    <div className="space-y-8">
      {/* SEO Integration */}
      <SEOHelper 
        title="التصنيفات التقنية والأدوات"
        description="تصفح أرشيف TechFix AI المنظم لمقالات الذكاء الاصطناعي، الحوسبة الكمومية، التطوير البرمجي والإرشادات التقنية المهمة."
        slug="categories"
      />

      <div className="space-y-2 border-r-4 border-blue-600 pr-4">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">تصنيفات المقالات والأدوات</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">تابع المواضيع التي تهمك مباشرة من قِبل خبراء ومهندسي منصتنا.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catPosts = publishedPosts.filter(p => p.category === cat.id);
          return (
            <div 
              key={cat.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 font-mono text-[10px] font-bold rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 uppercase">
                    ID: {cat.id}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    {catPosts.length} منشور
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors" onClick={() => onNavigate(`/posts?category=${cat.id}`)}>
                  {cat.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(`/posts?category=${cat.id}`)}
                  className="px-3.5 py-2 font-bold text-xs bg-slate-150 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                >
                  تصفح المقالات
                </button>
                <span className="text-[10px] text-gray-400 font-mono">/posts?category={cat.slug}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard layout placeholder */}
      <AdSensePlaceholder type="banner" slotId="categories-bottom-banner" />
    </div>
  );
}
