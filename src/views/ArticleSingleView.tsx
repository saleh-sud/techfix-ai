import { useState } from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, Copy, Check, ChevronLeft, Bookmark, Tag, Award } from 'lucide-react';
import { Post, Category } from '../types';
import SEOHelper from '../components/SEOHelper';
import MarkdownRenderer from '../components/MarkdownRenderer';
import AdSensePlaceholder from '../components/AdSensePlaceholder';

interface ArticleSingleViewProps {
  slug: string;
  posts: Post[];
  categories: Category[];
  onNavigate: (path: string) => void;
}

export default function ArticleSingleView({ slug, posts, categories, onNavigate }: ArticleSingleViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Locate current post
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-red-500">المقال غير موجود</h1>
        <p className="text-xs text-gray-500">من الممكن أنه تم حذفه مؤخراً أو نقل رابطه.</p>
        <button
          onClick={() => onNavigate('/')}
          className="px-4 py-2 font-bold text-xs bg-brand-blue text-white rounded-xl cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const postCategory = categories.find(c => c.id === post.category);
  const publishedPosts = posts.filter(p => p.status === 'published' && p.id !== post.id);
  const relatedPosts = publishedPosts.filter(p => p.category === post.category).slice(0, 3);

  // Parse Table of Contents headers (Lines starting with ##)
  const tocHeaders = post.content
    .split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => {
      const text = line.replace('## ', '').trim();
      return { text, id: text.replace(/\s+/g, '-') };
    });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedDate = new Date(post.createdAt || new Date()).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* Dynamic SEO Injector */}
      <SEOHelper 
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        slug={`post/${post.slug}`}
        type="article"
        imageUrl={post.featuredImage}
        publishDate={post.createdAt}
        modifiedDate={post.updatedAt}
        categoryName={postCategory?.name}
      />

      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-800">
        <span className="cursor-pointer hover:text-brand-blue" onClick={() => onNavigate('/')}>الرئيسية</span>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="cursor-pointer hover:text-brand-blue" onClick={() => onNavigate(`/posts?category=${post.category}`)}>
          {postCategory?.name || post.category}
        </span>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="truncate max-w-[200px] text-gray-800 dark:text-white font-bold">{post.title}</span>
      </nav>

      {/* 2. Article Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Post Section (8 Columns table) */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-950 p-5 md:p-8 rounded-3xl border border-gray-150 dark:border-slate-850 shadow-xs space-y-6">
          
          {/* Header Info */}
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-brand-cyan/10 text-brand-cyan">
              {postCategory?.name || post.category}
            </span>
            <h1 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white leading-relaxed">
              {post.title}
            </h1>
            
            {/* Meta tags author log */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 py-2 border-y border-gray-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-brand-blue" />
                فريق تحرير TechFix AI
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                قراءة في 5 دقائق
              </span>

              {/* Utility bookmarks */}
              <div className="mr-auto flex items-center gap-2">
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isBookmarked ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 text-amber-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-400 dark:bg-slate-900 dark:border-slate-800'}`}
                  title={isBookmarked ? "محفوظ في المفضلة" : "حفظ المقال"}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg border bg-gray-50 dark:bg-slate-900 dark:border-slate-800 border-gray-200 text-gray-400 hover:bg-gray-100 cursor-pointer"
                  title="نسخ الرابط"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* AdSense Top Single Banner */}
          <AdSensePlaceholder type="banner" slotId="single-article-header-ad" />

          {/* Post content body */}
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Post inline tags */}
          {post.tags.length > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-2 items-center">
              <Tag className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs font-bold text-gray-400">الوسوم:</span>
              {post.tags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => onNavigate(`/posts?tag=${tag}`)}
                  className="px-2.5 py-1 rounded-md text-xs bg-gray-100 dark:bg-slate-900 text-gray-650 dark:text-gray-350 hover:bg-brand-blue/10 hover:text-brand-blue"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Author Board */}
          <div className="p-6 rounded-2xl bg-indigo-50/30 dark:bg-slate-900/40 border border-indigo-100/50 dark:border-slate-800/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-black shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">بقلم: فريق التحرير العلمي لـ TechFix AI</h4>
              <p className="text-xs text-gray-500 max-w-xl">
                مجموعة من المهندسين وهواة السيو والتقنيات المعاصرة ملتزمون بإثراء المحتوى العربي من الصفر وبناء واثبات الفوائد المادية للإعلانات الرقمية والذكاء الاصطناعي.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Space (4 Columns table) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* 1. Dynamic Table of Contents (TOC) */}
          {tocHeaders.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-gray-400 tracking-wider">جدول محتويات المقال</h3>
              <nav className="space-y-2">
                {tocHeaders.map((header, index) => (
                  <a
                    key={index}
                    href={`#${header.id}`}
                    className="block text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-cyan transition-colors leading-relaxed border-r-2 border-transparent hover:border-brand-blue pr-2"
                  >
                    {header.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* AdSense Sidebar Rectangle Banner */}
          <AdSensePlaceholder type="rectangle" slotId="single-article-sidebar-ad" />

          {/* Related Articles list */}
          {relatedPosts.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold text-gray-400 tracking-wider">مقالات قد تهمك في نفس التخصص</h3>
              <div className="space-y-3 divide-y divide-gray-100 dark:divide-slate-800">
                {relatedPosts.map(rel => (
                  <div 
                    key={rel.id} 
                    onClick={() => onNavigate(`/post/${rel.slug}`)} 
                    className="pt-3 first:pt-0 cursor-pointer group"
                  >
                    <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 group-hover:text-brand-cyan transition-colors leading-relaxed line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(rel.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Built-in copy of standard LinkIcon for RTL compatibility and neatness
function LinkIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={props.className || "w-4 h-4"}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
