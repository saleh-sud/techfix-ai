import list from "../data/articles.json";
import { CATEGORIES } from "../data/categories";
export { CATEGORIES };
import type { ArticleMeta } from "../types";
import config from "../../site.config.json";
export { parseArticle, blocksToHtml, relatedArticles, articleJsonLd, sourcesFor, tocOf, esc } from "./articleMarkup";

export const PAGE_SIZE = 24;
const NAME = config.siteName;

export interface RouteMeta {
  path: string;
  lang: "ar" | "en";
  title: string;
  description: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
  noindex?: boolean;
  article?: ArticleMeta;
  articleLang?: "ar" | "en";
  alternates?: { ar: string; en: string };
  /** صفحات القوائم: المقالات التي تُعرض روابطها في HTML الثابت */
  listing?: ArticleMeta[];
  pageNum?: number;
  totalPages?: number;
}

export const ARTICLES: ArticleMeta[] = [...(list as ArticleMeta[])].sort(
  (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
);

/** عنوان ووصف كل صفحة ثابتة (يُستخدم في React وفي prerender). */
export const STATIC_PAGES: Record<string, { title: string; description: string; noindex?: boolean }> = {
  "/": {
    title: `${NAME} | حلول تقنية وشروحات أندرويد وويندوز والذكاء الاصطناعي`,
    description: "موقع عربي لحلول المشاكل التقنية خطوة بخطوة: أندرويد، ويندوز، آيفون، الإنترنت والراوترات، الأمان، الألعاب والهاردوير، وأدوات الذكاء الاصطناعي.",
  },
  "/posts": { title: `كل المقالات التقنية | ${NAME}`, description: "أرشيف كامل لمقالات وشروحات TechFix AI التقنية، مرتبة من الأحدث للأقدم." },
  "/categories": { title: `أقسام الموقع | ${NAME}`, description: "تصفح مقالات TechFix AI حسب القسم: ذكاء اصطناعي، أندرويد، ويندوز، آيفون، إنترنت، أمان، برامج، ألعاب، هاردوير وشروحات." },
  "/search": { title: `البحث في المقالات | ${NAME}`, description: "ابحث في كل مقالات وشروحات TechFix AI.", noindex: true },
  "/about": { title: `من نحن | ${NAME}`, description: "تعرف على TechFix AI: موقع عربي مجاني يقدم حلولاً تقنية مبسطة وشروحات خطوة بخطوة." },
  "/contact": { title: `تواصل معنا | ${NAME}`, description: "تواصل مع فريق TechFix AI لأي سؤال أو اقتراح أو تصحيح أو استفسار إعلاني." },
  "/privacy": { title: `سياسة الخصوصية | ${NAME}`, description: "سياسة الخصوصية وملفات تعريف الارتباط (الكوكيز) والإعلانات في موقع TechFix AI." },
  "/terms": { title: `شروط الاستخدام | ${NAME}`, description: "شروط وأحكام استخدام موقع TechFix AI ومحتواه." },
  "/disclaimer": { title: `إخلاء المسؤولية | ${NAME}`, description: "إخلاء المسؤولية عن المحتوى التقني والإعلانات والروابط الخارجية في TechFix AI." },
};
export const NOT_FOUND_META = { title: `الصفحة غير موجودة | ${NAME}`, description: "الصفحة التي تبحث عنها غير موجودة." };

const pages = (items: ArticleMeta[]) => Math.max(1, Math.ceil(items.length / PAGE_SIZE));
const slice = (items: ArticleMeta[], p: number) => items.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

export function getAllRoutes(): RouteMeta[] {
  const today = ARTICLES[0]?.date;
  const routes: RouteMeta[] = [];
  for (const [path, m] of Object.entries(STATIC_PAGES)) {
    routes.push({
      path,
      lang: "ar",
      ...m,
      changefreq: path === "/" || path === "/posts" ? "daily" : "monthly",
      priority: path === "/" ? "1.0" : path === "/posts" || path === "/categories" ? "0.9" : "0.4",
      lastmod: path === "/" || path === "/posts" ? today : undefined,
      listing: path === "/" || path === "/posts" ? ARTICLES.slice(0, PAGE_SIZE) : undefined,
      totalPages: path === "/posts" ? pages(ARTICLES) : undefined,
      pageNum: path === "/posts" ? 1 : undefined,
    });
  }
  for (let p = 2; p <= pages(ARTICLES); p++)
    routes.push({
      path: `/posts/page/${p}`,
      lang: "ar",
      title: `كل المقالات التقنية - صفحة ${p} | ${NAME}`,
      description: `أرشيف مقالات TechFix AI - الصفحة ${p}.`,
      changefreq: "daily",
      priority: "0.5",
      listing: slice(ARTICLES, p),
      pageNum: p,
      totalPages: pages(ARTICLES),
    });
  for (const c of CATEGORIES) {
    const items = ARTICLES.filter((a) => a.category === c.id);
    for (let p = 1; p <= pages(items); p++)
      routes.push({
        path: p === 1 ? `/category/${c.id}` : `/category/${c.id}/page/${p}`,
        lang: "ar",
        title: `${p === 1 ? "" : `صفحة ${p} - `}مقالات ${c.name}: حلول وشروحات | ${NAME}`,
        description: c.description,
        lastmod: items[0]?.date,
        changefreq: "daily",
        priority: p === 1 ? "0.8" : "0.4",
        listing: slice(items, p),
        pageNum: p,
        totalPages: pages(items),
      });
  }
  for (const a of ARTICLES) {
    const alternates = a.hasEn ? { ar: `/post/${a.slug}`, en: `/en/post/${a.slug}` } : undefined;
    routes.push({
      path: `/post/${a.slug}`,
      lang: "ar",
      title: `${a.title} | ${NAME}`,
      description: a.summary,
      lastmod: a.date,
      changefreq: "monthly",
      priority: "0.8",
      article: a,
      articleLang: "ar",
      alternates,
    });
    if (a.hasEn)
      routes.push({
        path: `/en/post/${a.slug}`,
        lang: "en",
        title: `${a.titleEn} | ${NAME}`,
        description: a.summaryEn,
        lastmod: a.date,
        changefreq: "monthly",
        priority: "0.6",
        article: a,
        articleLang: "en",
        alternates,
      });
  }
  return routes;
}
