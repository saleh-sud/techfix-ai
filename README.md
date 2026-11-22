# TechFix AI

موقع مقالات تقنية عربي (React + Vite + TypeScript) منشور على Cloudflare Pages.

- `npm run dev` تشغيل محلي — `npm run build` بناء + prerender + sitemaps + RSS (`scripts/postbuild.mjs`)
- المقالات: `src/data/articles.json` (بيانات وصفية) + `src/content/articles/<slug>.json` (النص)
- عامل المقالات: `scripts/generate-article.mjs` (Pollinations.ai، بدون مفتاح) — يعمل 3 مرات يومياً عبر `.github/workflows/articles.yml`
- المواضيع: `scripts/article-topics.json` (تتجدد تلقائياً)
- الإعلانات: `src/config/ads.ts` — الإعدادات العامة: `site.config.json`
- IndexNow: `npm run indexnow -- /post/slug`
