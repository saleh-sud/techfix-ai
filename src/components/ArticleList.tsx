import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import type { ArticleMeta } from "../types";
import { categoryById } from "../data/categories";
import AdSpace from "./AdSpace";
import { useLang } from "../lib/lang";

const GRADIENTS: Record<string, string> = {
  ai: "from-violet-500 to-fuchsia-500",
  android: "from-green-500 to-emerald-600",
  windows: "from-sky-500 to-blue-600",
  iphone: "from-slate-500 to-slate-800",
  internet: "from-cyan-500 to-teal-600",
  security: "from-rose-500 to-red-600",
  software: "from-amber-500 to-orange-600",
  gaming: "from-indigo-500 to-purple-700",
  hardware: "from-zinc-500 to-stone-700",
  tutorials: "from-lime-500 to-green-700",
  tech: "from-blue-500 to-cyan-500",
};

export function ArticleCard({ a }: { a: ArticleMeta }) {
  const c = categoryById(a.category);
  const { en, to } = useLang();
  const href = to(`/post/${a.slug}`);
  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link to={href} className={`h-28 bg-gradient-to-br ${GRADIENTS[c.id] || GRADIENTS.tech} flex items-center justify-center text-5xl`} aria-hidden="true" tabIndex={-1}>
        {c.icon}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link to={to(`/category/${c.id}`)} className="text-[11px] font-bold text-brand-cyan">
          {en ? c.nameEn : c.name}
        </Link>
        <h3 className="text-sm font-extrabold leading-relaxed text-gray-900 dark:text-white group-hover:text-brand-blue">
          <Link to={href}>{en ? a.titleEn : a.title}</Link>
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{en ? a.summaryEn : a.summary}</p>
        <div className="mt-auto pt-2 flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{en ? `${parseInt(a.readTime, 10) || 5} min read` : a.readTime}</span>
        </div>
      </div>
    </article>
  );
}

/** شبكة بطاقات + إعلان Native بعد كل 8 بطاقات */
export function ArticleGrid({ items }: { items: ArticleMeta[] }) {
  const { t } = useLang();
  if (!items.length) return <p className="text-sm text-gray-500 py-10 text-center">{t("لا توجد مقالات هنا بعد — مقالات جديدة تُضاف يومياً.", "No articles here yet — new ones are added daily.")}</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((a, i) => (
        <Fragment key={a.slug}>
          <ArticleCard a={a} />
          {(i + 1) % 8 === 0 && i < items.length - 1 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <AdSpace type={i % 16 === 7 ? "native" : "content"} />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function Pagination({ page, total, base }: { page: number; total: number; base: string }) {
  const { to, t } = useLang();
  if (total <= 1) return null;
  const href = (p: number) => to(p === 1 ? base : `${base}/page/${p}`);
  const nums = Array.from({ length: total }, (_, i) => i + 1).filter((p) => p === 1 || p === total || Math.abs(p - page) <= 2);
  return (
    <nav className="flex flex-wrap justify-center gap-2 pt-8" aria-label={t("الصفحات", "Pages")}>
      {page > 1 && <Link to={href(page - 1)} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-slate-900">{t("السابق", "Previous")}</Link>}
      {nums.map((p, i) => (
        <Fragment key={p}>
          {i > 0 && p - nums[i - 1] > 1 && <span className="px-1 text-gray-500">…</span>}
          <Link
            to={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${p === page ? "bg-brand-blue text-white" : "bg-gray-100 dark:bg-slate-900"}`}
          >
            {p}
          </Link>
        </Fragment>
      ))}
      {page < total && <Link to={href(page + 1)} className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 dark:bg-slate-900">{t("التالي", "Next")}</Link>}
    </nav>
  );
}
