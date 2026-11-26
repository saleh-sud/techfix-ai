import list from "../data/articles.json";
import { CATEGORIES } from "../data/categories";
export { CATEGORIES };
import type { ArticleMeta } from "../types";
import { localPath, type Lang } from "../lib/lang";
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
export const STATIC_PAGES_EN: typeof STATIC_PAGES = {
  "/": {
    title: `${NAME} | Tech Fixes and Guides for Android, Windows and AI`,
    description: "Step-by-step fixes for everyday tech problems: Android, Windows, iPhone, internet and routers, security, gaming, hardware and AI tools.",
  },
  "/posts": { title: `All Tech Articles | ${NAME}`, description: "The full archive of TechFix AI tech articles and guides, newest first." },
  "/categories": { title: `Categories | ${NAME}`, description: "Browse TechFix AI articles by topic: AI, Android, Windows, iPhone, internet, security, software, gaming, hardware and guides." },
  "/search": { title: `Search Articles | ${NAME}`, description: "Search all TechFix AI articles and guides.", noindex: true },
  "/about": { title: `About Us | ${NAME}`, description: "About TechFix AI: a free site with simple tech fixes and step-by-step guides." },
  "/contact": { title: `Contact Us | ${NAME}`, description: "Contact TechFix AI with questions, suggestions, corrections or advertising enquiries." },
  "/privacy": { title: `Privacy Policy | ${NAME}`, description: "TechFix AI privacy, cookies and advertising policy." },
  "/terms": { title: `Terms of Use | ${NAME}`, description: "Terms and conditions for using TechFix AI and its content." },
  "/disclaimer": { title: `Disclaimer | ${NAME}`, description: "Disclaimer about technical content, ads and external links on TechFix AI." },
};
export const staticPage = (path: string, lang: Lang) => (lang === "en" ? STATIC_PAGES_EN : STATIC_PAGES)[path];
export const NOT_FOUND_META_EN = { title: `Page Not Found | ${NAME}`, description: "The page you are looking for does not exist." };

/** المقالات المعروضة بلغة معيّنة (الإنجليزية: فقط ما له نسخة إنجليزية) */
export const articlesIn = <T extends ArticleMeta>(items: T[], lang: Lang) => (lang === "en" ? items.filter((a) => a.hasEn) : items);

/** عنوان ووصف صفحات القوائم (كل المقالات أو قسم) */
export function listMeta(lang: Lang, categoryId: string | undefined, page: number) {
  const en = lang === "en";
  const c = CATEGORIES.find((x) => x.id === categoryId);
  if (c) {
    const prefix = page > 1 ? (en ? `Page ${page} - ` : `صفحة ${page} - `) : "";
    return {
      title: en ? `${prefix}${c.nameEn} Fixes and Guides | ${NAME}` : `${prefix}مقالات ${c.name}: حلول وشروحات | ${NAME}`,
      description: en ? c.descriptionEn : c.description,
    };
  }
  if (page === 1) return staticPage("/posts", lang);
  return en
    ? { title: `All Tech Articles - Page ${page} | ${NAME}`, description: `TechFix AI article archive - page ${page}.` }
    : { title: `كل المقالات التقنية - صفحة ${page} | ${NAME}`, description: `أرشيف مقالات TechFix AI - الصفحة ${page}.` };
}
export const NOT_FOUND_META = { title: `الصفحة غير موجودة | ${NAME}`, description: "الصفحة التي تبحث عنها غير موجودة." };

const pages = (items: ArticleMeta[]) => Math.max(1, Math.ceil(items.length / PAGE_SIZE));
const slice = (items: ArticleMeta[], p: number) => items.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

export function getAllRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [];
  for (const lang of ["en", "ar"] as Lang[]) {
    const all = articlesIn(ARTICLES, lang);
    const today = all[0]?.date;
    // hreflang: فقط عندما توجد الصفحة باللغتين
    const alt = (path: string, page = 1, items = ARTICLES) =>
      page <= pages(articlesIn(items, "en")) ? { ar: localPath(path, "ar"), en: path } : undefined;
    for (const path of Object.keys(STATIC_PAGES)) {
      routes.push({
        path: localPath(path, lang),
        lang,
        ...staticPage(path, lang),
        changefreq: path === "/" || path === "/posts" ? "daily" : "monthly",
        priority: path === "/" ? "1.0" : path === "/posts" || path === "/categories" ? "0.9" : "0.4",
        lastmod: path === "/" || path === "/posts" ? today : undefined,
        listing: path === "/" || path === "/posts" ? all.slice(0, PAGE_SIZE) : undefined,
        totalPages: path === "/posts" ? pages(all) : undefined,
        pageNum: path === "/posts" ? 1 : undefined,
        alternates: alt(path),
      });
    }
    for (let p = 2; p <= pages(all); p++)
      routes.push({
        path: localPath(`/posts/page/${p}`, lang),
        lang,
        ...listMeta(lang, undefined, p),
        changefreq: "daily",
        priority: "0.5",
        listing: slice(all, p),
        pageNum: p,
        totalPages: pages(all),
        alternates: alt(`/posts/page/${p}`, p),
      });
    for (const c of CATEGORIES) {
      const inCat = ARTICLES.filter((a) => a.category === c.id);
      const items = articlesIn(inCat, lang);
      for (let p = 1; p <= pages(items); p++) {
        const path = p === 1 ? `/category/${c.id}` : `/category/${c.id}/page/${p}`;
        routes.push({
          path: localPath(path, lang),
          lang,
          ...listMeta(lang, c.id, p),
          lastmod: items[0]?.date,
          changefreq: "daily",
          priority: p === 1 ? "0.8" : "0.4",
          listing: slice(items, p),
          pageNum: p,
          totalPages: pages(items),
          alternates: alt(path, p, inCat),
        });
      }
    }
  }
  for (const a of ARTICLES) {
    const alternates = a.hasEn ? { ar: `/ar/post/${a.slug}`, en: `/post/${a.slug}` } : undefined;
    for (const lang of (a.hasEn ? ["en", "ar"] : ["ar"]) as Lang[])
      routes.push({
        path: localPath(`/post/${a.slug}`, lang),
        lang,
        title: `${lang === "en" ? a.titleEn : a.title} | ${NAME}`,
        description: lang === "en" ? a.summaryEn : a.summary,
        lastmod: a.date,
        changefreq: "monthly",
        priority: lang === "en" ? "0.8" : "0.7",
        article: a,
        articleLang: lang,
        alternates,
      });
  }
  return routes;
}
