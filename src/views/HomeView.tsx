import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "../lib/lang";
import { ARTICLES } from "../data/articles";
import { CATEGORIES } from "../data/categories";
import { articlesIn, staticPage } from "../seo/routes";
import { useSeo } from "../seo/useSeo";
import { ArticleGrid } from "../components/ArticleList";
import AdSpace from "../components/AdSpace";

export default function HomeView() {
  const { lang, en, to, t } = useLang();
  useSeo({ ...staticPage("/", lang), path: to("/"), lang, alternates: { ar: "/", en: "/en" } });
  const latest = articlesIn(ARTICLES, lang).slice(0, 12);
  const Arrow = en ? ArrowRight : ArrowLeft;
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-brand-blue to-brand-cyan text-white p-8 md:p-12 space-y-4">
        <h1 className="text-2xl md:text-4xl font-black leading-relaxed">{t("حلول تقنية بسيطة لكل مشكلة تواجهك", "Simple tech fixes for every problem you face")}</h1>
        <p className="text-sm md:text-base text-white/90 max-w-2xl leading-loose">
          {t(
            "شروحات خطوة بخطوة لمشاكل أندرويد وويندوز وآيفون، وتسريع الإنترنت والراوتر، وحماية حساباتك، وأفضل أدوات الذكاء الاصطناعي — مقالات جديدة كل يوم.",
            "Step-by-step guides for Android, Windows and iPhone problems, faster internet and routers, account security and the best AI tools — new articles every day."
          )}
        </p>
        <Link to={to("/posts")} className="inline-flex items-center gap-2 bg-white text-brand-blue font-bold text-sm px-5 py-2.5 rounded-xl">
          {t("تصفح كل المقالات", "Browse all articles")} <Arrow className="w-4 h-4" />
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-black">{t("الأقسام", "Categories")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={to(`/category/${c.id}`)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-brand-cyan">
              <div className="text-3xl mb-1">{c.icon}</div>
              <div className="text-xs font-bold">{en ? c.nameEn : c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <AdSpace type="content" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">{t("أحدث المقالات", "Latest articles")}</h2>
          <Link to={to("/posts")} className="text-xs font-bold text-brand-blue">{t("عرض الكل ←", "View all →")}</Link>
        </div>
        <ArticleGrid items={latest} />
      </section>
    </div>
  );
}
