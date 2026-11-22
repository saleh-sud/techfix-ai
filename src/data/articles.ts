import list from "./articles.json";
import type { ArticleBody, ArticleMeta } from "../types";

/** كل المقالات (بيانات وصفية فقط)، الأحدث أولاً. */
export const ARTICLES: ArticleMeta[] = [...(list as ArticleMeta[])].sort(
  (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
);

// كل مقال ملف JSON مستقل يُحمَّل عند الطلب فقط (chunk منفصل) حتى يبقى الموقع سريعاً مع آلاف المقالات
const loaders = import.meta.glob<ArticleBody>("../content/articles/*.json", { import: "default" });

export async function loadArticleBody(slug: string): Promise<ArticleBody | null> {
  const load = loaders[`../content/articles/${slug}.json`];
  return load ? await load() : null;
}

/** نص المقال المضمّن في الصفحة المنشورة مسبقاً (SSR) حتى يظهر فوراً بدون طلب إضافي. */
export function preloadedBody(slug: string): ArticleBody | null {
  const g = globalThis as { __TF_ARTICLE__?: { slug: string } & ArticleBody };
  return g.__TF_ARTICLE__?.slug === slug ? g.__TF_ARTICLE__ : null;
}

/** المقالات التي لها نسخة إنجليزية */
export const hasEnglish = (a: ArticleMeta) => !!a.hasEn;
