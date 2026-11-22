import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, ChevronLeft, ExternalLink } from "lucide-react";
import { ARTICLES, loadArticleBody, preloadedBody } from "../data/articles";
import { categoryById } from "../data/categories";
import { parseArticle, inlineHtml, relatedArticles, sourcesFor, tocOf, type ArticleBlock } from "../seo/articleMarkup";
import { useSeo } from "../seo/useSeo";
import type { ArticleBody } from "../types";
import AdSpace from "../components/AdSpace";
import NotFoundView from "./NotFoundView";

function Block({ b }: { b: ArticleBlock }) {
  const html = (s: string) => ({ dangerouslySetInnerHTML: { __html: inlineHtml(s) } });
  switch (b.type) {
    case "h2":
      return <h2 id={b.id} className="scroll-mt-24 text-xl font-black mt-8 mb-3 text-gray-900 dark:text-white">{b.text}</h2>;
    case "h3":
      return <h3 className="text-base font-extrabold mt-5 mb-2">{b.text}</h3>;
    case "ul":
      return <ul className="list-disc pr-6 space-y-1.5 my-3">{b.items.map((i, k) => <li key={k} {...html(i)} />)}</ul>;
    case "ol":
      return <ol className="list-decimal pr-6 space-y-1.5 my-3">{b.items.map((i, k) => <li key={k} {...html(i)} />)}</ol>;
    case "quote":
      return <blockquote className="border-r-4 border-brand-cyan bg-cyan-50 dark:bg-slate-900 px-4 py-3 my-4 rounded-l-xl" {...html(b.text)} />;
    case "code":
      return <pre dir="ltr" className="bg-slate-900 text-slate-100 text-xs p-4 rounded-xl overflow-x-auto my-4"><code>{b.text}</code></pre>;
    default:
      return <p className="my-3" {...html(b.text)} />;
  }
}

export default function ArticleView({ lang = "ar" }: { lang?: "ar" | "en" }) {
  const { slug = "" } = useParams();
  const en = lang === "en";
  const meta = ARTICLES.find((a) => a.slug === slug);
  const [loaded, setLoaded] = useState<{ slug: string; body: ArticleBody } | null>(null);
  const [failed, setFailed] = useState(false);
  const pre = preloadedBody(slug);
  const body = pre || (loaded?.slug === slug ? loaded.body : null);

  useEffect(() => {
    if (preloadedBody(slug)) return;
    setFailed(false);
    let alive = true;
    loadArticleBody(slug).then(
      (b) => alive && (b ? setLoaded({ slug, body: b }) : setFailed(true)),
      () => alive && setFailed(true)
    );
    return () => {
      alive = false;
    };
  }, [slug]);

  const blocks = useMemo(() => parseArticle((en ? body?.contentEn : body?.content) || ""), [body, en]);
  const alternates = meta?.hasEn ? { ar: `/post/${slug}`, en: `/en/post/${slug}` } : undefined;
  useSeo({
    title: `${(en ? meta?.titleEn : meta?.title) || "مقال"} | TechFix AI`,
    description: (en ? meta?.summaryEn : meta?.summary) || "",
    path: `${en ? "/en" : ""}/post/${slug}`,
    type: "article",
    lang,
    alternates,
  });

  if (!meta || failed || (en && !meta.hasEn)) return <NotFoundView />;
  const cat = categoryById(meta.category);
  const toc = tocOf(blocks);
  const related = relatedArticles(ARTICLES, meta, 4);
  const sources = sourcesFor(meta.category);
  // إعلان وسط المحتوى بعد القسم الثاني والقسم الخامس
  const adAfter = new Set([toc[2]?.id, toc[5]?.id].filter(Boolean));

  return (
    <div dir={en ? "ltr" : "rtl"} className={`space-y-6 ${en ? "text-left" : ""}`}>
      <nav className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800" aria-label="breadcrumb">
        <Link to="/" className="hover:text-brand-blue">{en ? "Home" : "الرئيسية"}</Link>
        <ChevronLeft className={`w-3.5 h-3.5 ${en ? "rotate-180" : ""}`} />
        <Link to={`/category/${cat.id}`} className="hover:text-brand-blue">{en ? cat.nameEn : cat.name}</Link>
        <ChevronLeft className={`w-3.5 h-3.5 ${en ? "rotate-180" : ""}`} />
        <span className="truncate max-w-[220px] font-bold text-gray-800 dark:text-white">{en ? meta.titleEn : meta.title}</span>
      </nav>

      <AdSpace type="top" isRtl={!en} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <article className="lg:col-span-8 bg-white dark:bg-slate-950 p-5 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800">
          <header className="space-y-4 mb-6">
            <Link to={`/category/${cat.id}`} className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-brand-cyan/10 text-brand-cyan">
              {cat.icon} {en ? cat.nameEn : cat.name}
            </Link>
            <h1 className="text-2xl md:text-3xl font-black leading-relaxed text-gray-900 dark:text-white">{en ? meta.titleEn : meta.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-loose">{en ? meta.summaryEn : meta.summary}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 py-2 border-y border-gray-100 dark:border-slate-800">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /><time dateTime={meta.date}>{meta.date}</time></span>
              {!en && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{meta.readTime}</span>}
              {meta.hasEn && (
                <Link to={en ? `/post/${slug}` : `/en/post/${slug}`} className="ms-auto font-bold text-brand-blue">
                  {en ? "اقرأ بالعربية" : "Read in English"}
                </Link>
              )}
            </div>
          </header>

          {toc.length > 2 && (
            <nav className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 mb-6 border border-gray-200 dark:border-slate-800" aria-label={en ? "Contents" : "فهرس المقال"}>
              <h2 className="text-sm font-black mb-3">{en ? "Table of contents" : "فهرس المقال"}</h2>
              <ol className="list-decimal pr-5 pl-5 space-y-1.5 text-xs">
                {toc.map((h) => (
                  <li key={h.id}><a href={`#${h.id}`} className="inline-block py-1.5 text-gray-600 dark:text-gray-300 hover:text-brand-blue">{h.text}</a></li>
                ))}
              </ol>
            </nav>
          )}

          {!body ? (
            <div className="py-16 text-center"><div className="w-8 h-8 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="text-[15px] leading-loose text-gray-800 dark:text-gray-200 article-body">
              {blocks.map((b, i) => (
                <Fragment key={i}>
                  {b.type === "h2" && adAfter.has(b.id) && <AdSpace type="content" isRtl={!en} />}
                  <Block b={b} />
                </Fragment>
              ))}
            </div>
          )}

          <AdSpace type="native" isRtl={!en} />

          <section className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
            <h2 className="text-base font-black mb-3">{en ? "Trusted sources" : "مصادر خارجية موثوقة"}</h2>
            <ul className="space-y-2 text-xs">
              {sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-brand-blue hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" /> {en ? s.labelEn : s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <AdSpace type="sidebar" isRtl={!en} />
          <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800">
            <h2 className="text-sm font-black mb-3">{en ? "Related articles" : "مقالات ذات صلة"}</h2>
            <ul className="space-y-3 divide-y divide-gray-100 dark:divide-slate-800">
              {related.map((r) => (
                <li key={r.slug} className="pt-3 first:pt-0">
                  <Link to={en && r.hasEn ? `/en/post/${r.slug}` : `/post/${r.slug}`} className="text-xs font-bold leading-relaxed hover:text-brand-cyan">
                    {en && r.hasEn ? r.titleEn : r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
