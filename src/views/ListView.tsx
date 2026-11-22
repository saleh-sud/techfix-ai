import { useParams } from "react-router-dom";
import { ARTICLES } from "../data/articles";
import { CATEGORIES } from "../data/categories";
import { PAGE_SIZE } from "../config/site";
import { STATIC_PAGES } from "../seo/routes";
import { useSeo } from "../seo/useSeo";
import { ArticleGrid, Pagination } from "../components/ArticleList";
import AdSpace from "../components/AdSpace";
import NotFoundView from "./NotFoundView";

/** قائمة المقالات (كل المقالات أو قسم واحد) — 24 مقالاً في الصفحة. */
export default function ListView() {
  const { category, page: pageParam } = useParams();
  const page = Math.max(1, Number(pageParam) || 1);
  const cat = category ? CATEGORIES.find((c) => c.id === category) : undefined;
  const items = cat ? ARTICLES.filter((a) => a.category === cat.id) : ARTICLES;
  const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const base = cat ? `/category/${cat.id}` : "/posts";
  const path = page === 1 ? base : `${base}/page/${page}`;
  const title = cat
    ? `${page > 1 ? `صفحة ${page} - ` : ""}مقالات ${cat.name}: حلول وشروحات | TechFix AI`
    : page > 1
      ? `كل المقالات التقنية - صفحة ${page} | TechFix AI`
      : STATIC_PAGES["/posts"].title;
  useSeo({ title, description: cat ? cat.description : STATIC_PAGES["/posts"].description, path });

  if ((category && !cat) || page > total) return <NotFoundView />;
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black">{cat ? `${cat.icon} ${cat.name}` : "كل المقالات التقنية"}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{cat ? cat.description : `${items.length} مقالاً تقنياً، تُضاف مقالات جديدة كل يوم.`}</p>
      </header>
      <AdSpace type="top" />
      <ArticleGrid items={items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)} />
      <Pagination page={page} total={total} base={base} />
      <AdSpace type="native" />
    </div>
  );
}
