/** بيانات المقال الوصفية (src/data/articles.json). النص الكامل في src/content/articles/<slug>.json */
export interface ArticleMeta {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: string; // معرّف التصنيف من src/data/categories.ts
  readTime: string;
  date: string; // YYYY-MM-DD
  hasEn: boolean;
}

export interface ArticleBody {
  content: string;
  contentEn: string;
}

export type Article = ArticleMeta & Partial<ArticleBody>;

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string; // emoji
}
