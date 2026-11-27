import { Link } from "react-router-dom";
import { Sparkles, Mail } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { SITE } from "../config/site";
import { useLang } from "../lib/lang";

export default function Footer() {
  const { en, to, t } = useLang();
  const year = new Date().getFullYear();
  const a = "text-xs text-gray-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan";
  return (
    <footer className="bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        <div className="md:col-span-4 space-y-4">
          <Link to={to("/")} className="flex items-center gap-2 font-black">
            <span className="p-2 rounded-lg bg-brand-cyan text-white">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </span>
            <span className="text-lg text-gray-950 dark:text-white font-extrabold" dir="ltr">
              TechFix <span className="text-brand-cyan">AI</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            {t(
              "موقع عربي مجاني يقدّم حلولاً عملية للمشاكل التقنية وشروحات خطوة بخطوة لأندرويد وويندوز وآيفون والإنترنت والذكاء الاصطناعي.",
              "A free site with practical fixes and step-by-step guides for Android, Windows, iPhone, the internet and AI."
            )}
          </p>
          <a href={`mailto:${SITE.contactEmail}`} className={`${a} inline-flex items-center gap-1.5`} dir="ltr">
            <Mail className="w-3.5 h-3.5" /> {SITE.contactEmail}
          </a>
        </div>

        <div className="md:col-span-5 space-y-3">
          <h2 className="text-xs font-extrabold text-gray-500 uppercase">{t("الأقسام", "Categories")}</h2>
          <ul className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={to(`/category/${c.id}`)} className={a}>
                  {c.icon} {en ? c.nameEn : c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h2 className="text-xs font-extrabold text-gray-500 uppercase">{t("روابط مهمة", "Useful links")}</h2>
          <ul className="space-y-2">
            <li><Link to={to("/about")} className={a}>{t("من نحن", "About us")}</Link></li>
            <li><Link to={to("/contact")} className={a}>{t("تواصل معنا", "Contact us")}</Link></li>
            <li><Link to={to("/privacy")} className={a}>{t("سياسة الخصوصية", "Privacy Policy")}</Link></li>
            <li><Link to={to("/terms")} className={a}>{t("شروط الاستخدام", "Terms of Use")}</Link></li>
            <li><Link to={to("/disclaimer")} className={a}>{t("إخلاء المسؤولية", "Disclaimer")}</Link></li>
            <li><a href="/rss.xml" className={a}>{t("خلاصة RSS (بالإنجليزية)", "RSS feed")}</a></li>
            <li><a href="https://cv.wasl-jobs.com/" className={a}>{t("أدوات الوظائف: سيرة ذاتية مجاناً", "Job tools: free CV maker")}</a></li>
          </ul>
        </div>
      </div>
      <nav aria-label={t("مواقعنا الأخرى", "Our other sites")} className="max-w-7xl mx-auto py-6 border-t border-gray-200 dark:border-slate-800 text-center">
        <p className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-200">{t("مواقعنا الأخرى", "Our other sites")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://wasl-jobs.com/" className="min-w-40 rounded-xl bg-slate-900 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-slate-900 hover:opacity-85">{t("وصل للوظائف", "WASL Jobs")}</a>
          <a href="https://tools.wasl-jobs.com/" className="min-w-40 rounded-xl bg-slate-900 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-slate-900 hover:opacity-85">{t("أدوات وصل المهنية", "Career Tools")}</a>
          <a href="https://cv.wasl-jobs.com/" className="min-w-40 rounded-xl bg-slate-900 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-slate-900 hover:opacity-85">{t("منشئ السيرة الذاتية", "CV Generator")}</a>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-200 dark:border-slate-800 text-center text-[11px] text-gray-500">
        <p>© {year} TechFix AI. {t("جميع الحقوق محفوظة.", "All rights reserved.")}</p>
        <p dir="ltr" className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          Made with 🖤 by <span className="text-gray-800 dark:text-white font-extrabold">Hadi Saleh</span>
        </p>
      </div>
    </footer>
  );
}
