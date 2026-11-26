import type { Article, ArticleMeta } from "../types";

/**
 * يحوّل نص المقال (Markdown بسيط) إلى كتل منظمة. يُستخدم في صفحة المقال (React)
 * وفي ملفات HTML الثابتة (prerender) حتى يقرأ جوجل نفس المحتوى بالضبط.
 *   ## عنوان  => h2 (يظهر في الفهرس)     ### عنوان => h3
 *   - عنصر / 1. عنصر => قائمة              > نص => اقتباس       --- => يُتجاهل
 */
export type ArticleBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "p"; text: string };

export function parseArticle(raw = ""): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let code: string[] | null = null;
  let n = 0;
  const flush = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const line of raw.replace(/\r/g, "").split("\n")) {
    if (line.trim().startsWith("```")) {
      if (code) {
        blocks.push({ type: "code", text: code.join("\n") });
        code = null;
      } else {
        flush();
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }
    const t = line.trim();
    if (!t || /^-{3,}$|^\*{3,}$/.test(t)) {
      flush();
      continue;
    }
    const bullet = t.match(/^[-*•]\s+(.*)$/);
    const num = t.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || num) {
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) {
        flush();
        list = { type, items: [] };
      }
      list.items.push((bullet || num)![1]);
      continue;
    }
    flush();
    const h = t.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      const text = h[2].replace(/\*\*/g, "").trim();
      if (h[1].length === 2) blocks.push({ type: "h2", text, id: `s${++n}` });
      else blocks.push({ type: "h3", text });
      continue;
    }
    if (t.startsWith(">")) {
      blocks.push({ type: "quote", text: t.replace(/^>\s*/, "") });
      continue;
    }
    if (/^#\s/.test(t)) continue; // عنوان h1 مكرر داخل النص
    blocks.push({ type: "p", text: t });
  }
  flush();
  if (code) blocks.push({ type: "code", text: (code as string[]).join("\n") });
  return blocks;
}

export const esc = (v: string) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** **غامق** و `كود` و [رابط](https://...) */
export const inlineHtml = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener nofollow" target="_blank">$1</a>');

export function blocksToHtml(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `<h2 id="${b.id}">${esc(b.text)}</h2>`;
        case "h3":
          return `<h3>${esc(b.text)}</h3>`;
        case "ul":
        case "ol":
          return `<${b.type}>${b.items.map((i) => `<li>${inlineHtml(i)}</li>`).join("")}</${b.type}>`;
        case "quote":
          return `<blockquote>${inlineHtml(b.text)}</blockquote>`;
        case "code":
          return `<pre><code>${esc(b.text)}</code></pre>`;
        default:
          return `<p>${inlineHtml(b.text)}</p>`;
      }
    })
    .join("\n");
}

/** الفهرس (عناوين H2) */
export const tocOf = (blocks: ArticleBlock[]) =>
  blocks.filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2");

export const wordCount = (raw = "") => raw.split(/\s+/).filter(Boolean).length;

/** أسئلة شائعة: عناصر القائمة تحت عنوان "أسئلة شائعة" بصيغة **سؤال؟** جواب */
export function faqOf(raw = ""): { q: string; a: string }[] {
  const blocks = parseArticle(raw);
  const i = blocks.findIndex((b) => b.type === "h2" && /أسئلة شائعة|FAQ|Frequently/i.test(b.text));
  if (i < 0) return [];
  const out: { q: string; a: string }[] = [];
  for (const b of blocks.slice(i + 1)) {
    if (b.type === "h2") break;
    if (b.type === "ul" || b.type === "ol")
      for (const item of b.items) {
        const m = item.match(/^\*\*(.+?)\*\*\s*[:：-]?\s*(.+)$/);
        if (m) out.push({ q: m[1].trim(), a: m[2].replace(/\*\*/g, "").trim() });
      }
  }
  return out;
}

/** مقالات ذات صلة: نفس التصنيف أولاً ثم الأحدث. */
export function relatedArticles(all: ArticleMeta[], current: ArticleMeta, count = 4): ArticleMeta[] {
  const others = all.filter((a) => a.slug !== current.slug);
  const score = (a: ArticleMeta) => (a.category === current.category ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date)).slice(0, count);
}

/** مصادر خارجية موثوقة حسب التصنيف (تظهر أسفل كل مقال). */
const SOURCES: Record<string, { label: string; labelEn: string; url: string }[]> = {
  ai: [
    { label: "الذكاء الاصطناعي (ويكيبيديا)", labelEn: "Artificial intelligence (Wikipedia)", url: "https://en.wikipedia.org/wiki/Artificial_intelligence" },
    { label: "مدونة Google AI", labelEn: "Google AI Blog", url: "https://blog.google/technology/ai/" },
  ],
  android: [
    { label: "مركز مساعدة أندرويد من Google", labelEn: "Android Help Center", url: "https://support.google.com/android/" },
    { label: "موقع Android الرسمي", labelEn: "Android official site", url: "https://www.android.com/" },
  ],
  windows: [
    { label: "دعم Microsoft Windows", labelEn: "Microsoft Windows Support", url: "https://support.microsoft.com/windows" },
    { label: "Microsoft Learn", labelEn: "Microsoft Learn", url: "https://learn.microsoft.com/" },
  ],
  iphone: [
    { label: "دعم آيفون من Apple", labelEn: "Apple iPhone Support", url: "https://support.apple.com/iphone" },
    { label: "دليل مستخدم iPhone", labelEn: "iPhone User Guide", url: "https://support.apple.com/guide/iphone/welcome/ios" },
  ],
  internet: [
    { label: "اختبار سرعة الإنترنت (Speedtest)", labelEn: "Speedtest by Ookla", url: "https://www.speedtest.net/" },
    { label: "الواي فاي (ويكيبيديا)", labelEn: "Wi-Fi (Wikipedia)", url: "https://en.wikipedia.org/wiki/Wi-Fi" },
  ],
  security: [
    { label: "نصائح الأمان من CISA", labelEn: "CISA Secure Our World", url: "https://www.cisa.gov/secure-our-world" },
    { label: "هل تم تسريب بريدك؟ (Have I Been Pwned)", labelEn: "Have I Been Pwned", url: "https://haveibeenpwned.com/" },
  ],
  software: [
    { label: "Microsoft Learn", labelEn: "Microsoft Learn", url: "https://learn.microsoft.com/" },
    { label: "متجر Google Play", labelEn: "Google Play", url: "https://play.google.com/store/apps" },
  ],
  gaming: [
    { label: "دعم Steam", labelEn: "Steam Support", url: "https://help.steampowered.com/" },
    { label: "دعم Xbox", labelEn: "Xbox Support", url: "https://support.xbox.com/" },
  ],
  hardware: [
    { label: "قاعدة PCPartPicker", labelEn: "PCPartPicker", url: "https://pcpartpicker.com/" },
    { label: "Tom's Hardware", labelEn: "Tom's Hardware", url: "https://www.tomshardware.com/" },
  ],
};
const GENERAL = [
  { label: "ويكيبيديا التقنية", labelEn: "Wikipedia – Technology", url: "https://en.wikipedia.org/wiki/Technology" },
  { label: "دعم Google", labelEn: "Google Help", url: "https://support.google.com/" },
];
export const sourcesFor = (category: string) => [...(SOURCES[category] || []), ...GENERAL].slice(0, 4);

export function articleJsonLd(a: Article, siteUrl: string, siteName: string, image: string, lang: "ar" | "en" = "ar") {
  const en = lang === "en";
  const url = `${siteUrl}${en ? "/en" : ""}/post/${a.slug}`;
  const content = (en ? a.contentEn : a.content) || "";
  const faq = faqOf(content);
  const out: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: en ? a.titleEn : a.title,
      description: en ? a.summaryEn : a.summary,
      inLanguage: lang,
      datePublished: a.date,
      dateModified: a.date,
      wordCount: wordCount(content),
      image,
      url,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: siteName, url: siteUrl },
      publisher: { "@type": "Organization", name: siteName, url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/favicon.svg` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteName, item: `${siteUrl}${en ? "/en" : "/"}` },
        { "@type": "ListItem", position: 2, name: en ? "Articles" : "المقالات", item: `${siteUrl}${en ? "/en" : ""}/posts` },
        { "@type": "ListItem", position: 3, name: en ? a.titleEn : a.title, item: url },
      ],
    },
  ];
  if (faq.length)
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  return out;
}
