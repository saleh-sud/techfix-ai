import { Link } from "react-router-dom";
import { ARTICLES } from "../data/articles";
import { CATEGORIES } from "../data/categories";
import { STATIC_PAGES } from "../seo/routes";
import { useSeo } from "../seo/useSeo";

export default function CategoriesView() {
  useSeo({ ...STATIC_PAGES["/categories"], path: "/categories" });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">أقسام الموقع</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to={`/category/${c.id}`} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 hover:border-brand-cyan space-y-2">
            <div className="text-3xl">{c.icon}</div>
            <h2 className="font-black">{c.name}</h2>
            <p className="text-xs text-gray-500 leading-relaxed">{c.description}</p>
            <span className="text-[11px] text-brand-blue font-bold">{ARTICLES.filter((a) => a.category === c.id).length} مقال</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
