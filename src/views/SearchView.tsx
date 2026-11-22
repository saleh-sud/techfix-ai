import { useSearchParams } from "react-router-dom";
import { ARTICLES } from "../data/articles";
import { STATIC_PAGES } from "../seo/routes";
import { useSeo } from "../seo/useSeo";
import { ArticleGrid } from "../components/ArticleList";

const norm = (s: string) =>
  s.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[ً-ْ]/g, "");

export default function SearchView() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  useSeo({ ...STATIC_PAGES["/search"], path: "/search" });
  const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
  const results = terms.length
    ? ARTICLES.map((a) => {
        const hay = norm(`${a.title} ${a.titleEn} ${a.summary}`);
        return { a, score: terms.filter((t) => hay.includes(t)).length };
      })
        .filter((x) => x.score > 0)
        .sort((x, y) => y.score - x.score)
        .slice(0, 48)
        .map((x) => x.a)
    : [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">البحث في المقالات</h1>
      <input
        type="search"
        defaultValue={q}
        onKeyDown={(e) => e.key === "Enter" && setParams({ q: (e.target as HTMLInputElement).value })}
        placeholder="اكتب مشكلتك، مثلاً: بطء الإنترنت"
        className="w-full max-w-xl px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 outline-none focus:border-brand-cyan"
      />
      {q && <p className="text-xs text-gray-500">{results.length} نتيجة لـ "{q}"</p>}
      {q && <ArticleGrid items={results} />}
    </div>
  );
}
