import { useParams } from "react-router-dom";
import { ARTICLES } from "../data/articles";
import { CATEGORIES } from "../data/categories";
import { PAGE_SIZE } from "../config/site";
import { articlesIn, listMeta } from "../seo/routes";
import { localPath, useLang } from "../lib/lang";
import { useSeo } from "../seo/useSeo";
import { ArticleGrid, Pagination } from "../components/ArticleList";
import AdSpace from "../components/AdSpace";
import NotFoundView from "./NotFoundView";

/** قائمة المقالات (كل المقالات أو قسم واحد) — 24 مقالاً في الصفحة. */
export default function ListView() {
  const { category, page: pageParam } = useParams();
  const { lang, en, to, t } = useLang();
  const page = Math.max(1, Number(pageParam) || 1);
  const cat = category ? CATEGORIES.find((c) => c.id === category) : undefined;
  const inScope = cat ? ARTICLES.filter((a) => a.category === cat.id) : ARTICLES;
  const items = articlesIn(inScope, lang);
  const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const base = cat ? `/category/${cat.id}` : "/posts";
  const path = page === 1 ? base : `${base}/page/${page}`;
  const bothLangs = page <= Math.max(1, Math.ceil(articlesIn(inScope, "en").length / PAGE_SIZE));
  useSeo({ ...listMeta(lang, cat?.id, page), path: to(path), lang, alternates: bothLangs ? { ar: localPath(path, "ar"), en: path } : undefined });

  if ((category && !cat) || page > total) return <NotFoundView />;
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black">{cat ? `${cat.icon} ${en ? cat.nameEn : cat.name}` : t("كل المقالات التقنية", "All tech articles")}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{cat
            ? t(cat.description, cat.descriptionEn)
            : t(`${items.length} مقالاً تقنياً، تُضاف مقالات جديدة كل يوم.`, `${items.length} tech articles, with new ones added every day.`)}</p>
      </header>
      <AdSpace type="top" />
      <ArticleGrid items={items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)} />
      <Pagination page={page} total={total} base={base} />
      <AdSpace type="native" />
    </div>
  );
}
