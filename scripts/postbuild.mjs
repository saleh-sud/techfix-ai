/**
 * بعد vite build (يُشغَّل تلقائياً ضمن npm run build):
 *  1) sitemap.xml + sitemap-pages.xml + sitemap-articles.xml + sitemap-index.xml + rss.xml + robots.txt + ملف مفتاح IndexNow
 *  2) نسخة HTML ثابتة لكل صفحة ومقال (title / description / canonical / Open Graph / hreflang / JSON-LD + المحتوى الكامل)
 *     حتى يرى جوجل المحتوى بدون تشغيل JavaScript، و 404.html
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const config = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const SITE_URL = config.siteUrl.replace(/\/+$/, "");
const NAME = config.siteName;
const today = new Date().toISOString().slice(0, 10);

const tmp = path.join(ROOT, "node_modules", ".cache-routes.mjs");
await build({ entryPoints: [path.join(ROOT, "src/seo/routes.ts")], bundle: true, format: "esm", platform: "node", outfile: tmp, logLevel: "silent" });
const R = await import(`${pathToFileURL(tmp).href}?v=${Date.now()}`);
fs.rmSync(tmp, { force: true });
const { getAllRoutes, NOT_FOUND_META, parseArticle, blocksToHtml, relatedArticles, articleJsonLd, sourcesFor, tocOf, esc, ARTICLES, CATEGORIES } = R;
const catName = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

const loadBody = (slug) => {
  const f = path.join(ROOT, "src/content/articles", `${slug}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : { content: "", contentEn: "" };
};
const routes = getAllRoutes().map((r) => (r.article ? { ...r, article: { ...r.article, ...loadBody(r.article.slug) } } : r));
const urlOf = (p) => (p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`);

// ---------- 1) sitemaps / rss / robots ----------
const urlset = (list) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${list
  .filter((r) => !r.noindex)
  .map(
    (r) => `  <url>
    <loc>${esc(urlOf(r.path))}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>${
      r.alternates
        ? `
    <xhtml:link rel="alternate" hreflang="ar" href="${urlOf(r.alternates.ar)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${urlOf(r.alternates.en)}" />`
        : ""
    }
  </url>`
  )
  .join("\n")}
</urlset>
`;
const pageRoutes = routes.filter((r) => !r.article);
const articleRoutes = routes.filter((r) => r.article);
fs.writeFileSync(path.join(DIST, "sitemap.xml"), urlset(routes));
fs.writeFileSync(path.join(DIST, "sitemap-pages.xml"), urlset(pageRoutes));
fs.writeFileSync(path.join(DIST, "sitemap-articles.xml"), urlset(articleRoutes));
fs.writeFileSync(
  path.join(DIST, "sitemap-index.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-pages.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-articles.xml</loc><lastmod>${ARTICLES[0]?.date || today}</lastmod></sitemap>
</sitemapindex>
`
);

const rssItems = articleRoutes
  .filter((r) => r.articleLang === "ar")
  .slice(0, 50)
  .map(
    (r) => `    <item>
      <title>${esc(r.article.title)}</title>
      <link>${esc(urlOf(r.path))}</link>
      <guid isPermaLink="true">${esc(urlOf(r.path))}</guid>
      <pubDate>${new Date(`${r.article.date}T08:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(catName(r.article.category).name)}</category>
      <description>${esc(r.article.summary)}</description>
    </item>`
  )
  .join("\n");
fs.writeFileSync(
  path.join(DIST, "rss.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(NAME)}</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(config.tagline)}</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`
);

if (config.indexNowKey) fs.writeFileSync(path.join(DIST, `${config.indexNowKey}.txt`), config.indexNowKey);
fs.writeFileSync(
  path.join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: ${SITE_URL}/sitemap.xml\nSitemap: ${SITE_URL}/sitemap-index.xml\nSitemap: ${SITE_URL}/rss.xml\n`
);
// ملف ads.txt (إن وُجد) يُنسخ من public تلقائياً عبر vite

// ---------- 2) prerender ----------
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const image = SITE_URL + config.ogImage;

const jsonLd = (r) => {
  if (r.path === "/")
    return ld({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: NAME,
      url: `${SITE_URL}/`,
      inLanguage: "ar",
      potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={q}`, "query-input": "required name=q" },
    }) + ld({ "@context": "https://schema.org", "@type": "Organization", name: NAME, url: `${SITE_URL}/`, logo: `${SITE_URL}/favicon.svg`, email: config.contactEmail });
  if (r.article) return articleJsonLd(r.article, SITE_URL, NAME, image, r.articleLang).map(ld).join("");
  if (r.listing) return ld({ "@context": "https://schema.org", "@type": "CollectionPage", name: r.title, url: urlOf(r.path) });
  return "";
};

// ---------- SSR: نفس مكوّنات React تُرسم لـ HTML كامل (يظهر فوراً ويقرأه جوجل بدون JavaScript) ----------
const { render: ssr } = await import(pathToFileURL(path.join(ROOT, "dist-ssr", "entry-server.js")).href);

// CSS مضمّن في الصفحة (بدون طلب يعيق العرض) + تحميل مسبق لخط Cairo العربي
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
const cssText = cssLink ? fs.readFileSync(path.join(DIST, cssLink[1]), "utf8") : "";
const arabicFont = "cairo-arabic.woff2";
const baseTemplate = (cssLink ? template.replace(cssLink[0], `<style>${cssText}</style>`) : template).replace(
  "<!--preload-->",
  arabicFont ? `<link rel="preload" href="/fonts/${arabicFont}" as="font" type="font/woff2" crossorigin />` : ""
);

function render(r, { noindex = false } = {}) {
  const url = urlOf(r.path);
  const head = `<title>${esc(r.title)}</title>
    <meta name="description" content="${esc(r.description)}" />
    <meta name="robots" content="${noindex || r.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />
    <link rel="canonical" href="${esc(url)}" />${
      r.alternates
        ? `
    <link rel="alternate" hreflang="ar" href="${urlOf(r.alternates.ar)}" />
    <link rel="alternate" hreflang="en" href="${urlOf(r.alternates.en)}" />
    <link rel="alternate" hreflang="x-default" href="${urlOf(r.alternates.ar)}" />`
        : ""
    }
    <meta property="og:site_name" content="${esc(NAME)}" />
    <meta property="og:title" content="${esc(r.title)}" />
    <meta property="og:description" content="${esc(r.description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:type" content="${r.article ? "article" : "website"}" />${
      r.article
        ? `
    <meta property="article:published_time" content="${r.article.date}" />
    <meta property="article:section" content="${esc(catName(r.article.category).name)}" />`
        : ""
    }
    <meta property="og:locale" content="${r.lang === "en" ? "en_US" : "ar_AR"}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(r.title)}" />
    <meta name="twitter:description" content="${esc(r.description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    ${jsonLd(r)}`;
  const art = r.article ? { slug: r.article.slug, content: r.article.content || "", contentEn: r.article.contentEn || "" } : undefined;
  const html = ssr(r.path, art);
  const preload = art ? `<script>window.__TF_ARTICLE__=${JSON.stringify(art).replace(/</g, String.fromCharCode(92) + "u003c")}</script>` : "";
  return baseTemplate
    .replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, head)
    .replace('<html lang="ar" dir="rtl">', `<html lang="${r.lang}" dir="${r.lang === "en" ? "ltr" : "rtl"}">`)
    .replace('<div id="root"><!--prerender--></div>', `<div id="root">${html}</div>${preload}`);
}

let count = 0;
for (const r of routes) {
  const file = r.path === "/" ? "index.html" : `${r.path.slice(1)}.html`;
  const out = path.join(DIST, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(r));
  count++;
}
fs.writeFileSync(path.join(DIST, "404.html"), render({ ...NOT_FOUND_META, path: "/404", lang: "ar", changefreq: "", priority: "" }, { noindex: true }));

const files = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? files(path.join(d, e.name)) : 1), 0);
fs.rmSync(path.join(ROOT, "dist-ssr"), { recursive: true, force: true });
console.log(`✅ sitemaps + rss + robots + ${count} prerendered pages + 404.html — ${files(DIST)} files in dist (Cloudflare limit 20000)  site: ${SITE_URL}`);
