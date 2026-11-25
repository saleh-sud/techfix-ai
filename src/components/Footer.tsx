import { Link } from "react-router-dom";
import { Sparkles, Mail } from "lucide-react";
import { CATEGORIES } from "../data/categories";
import { SITE } from "../config/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const a = "text-xs text-gray-600 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan";
  return (
    <footer className="bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        <div className="md:col-span-4 space-y-4">
          <Link to="/" className="flex items-center gap-2 font-black">
            <span className="p-2 rounded-lg bg-brand-cyan text-white">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </span>
            <span className="text-lg text-gray-950 dark:text-white font-extrabold" dir="ltr">
              TechFix <span className="text-brand-cyan">AI</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            موقع عربي مجاني يقدّم حلولاً عملية للمشاكل التقنية وشروحات خطوة بخطوة لأندرويد وويندوز وآيفون والإنترنت والذكاء الاصطناعي.
          </p>
          <a href={`mailto:${SITE.contactEmail}`} className={`${a} inline-flex items-center gap-1.5`} dir="ltr">
            <Mail className="w-3.5 h-3.5" /> {SITE.contactEmail}
          </a>
        </div>

        <div className="md:col-span-5 space-y-3">
          <h2 className="text-xs font-extrabold text-gray-500 uppercase">الأقسام</h2>
          <ul className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.id}`} className={a}>
                  {c.icon} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h2 className="text-xs font-extrabold text-gray-500 uppercase">روابط مهمة</h2>
          <ul className="space-y-2">
            <li><Link to="/about" className={a}>من نحن</Link></li>
            <li><Link to="/contact" className={a}>تواصل معنا</Link></li>
            <li><Link to="/privacy" className={a}>سياسة الخصوصية</Link></li>
            <li><Link to="/terms" className={a}>شروط الاستخدام</Link></li>
            <li><Link to="/disclaimer" className={a}>إخلاء المسؤولية</Link></li>
            <li><a href="/rss.xml" className={a}>خلاصة RSS</a></li>
            <li><a href="https://jobtools-cv-generator.web.app/" className={a}>أدوات الوظائف: سيرة ذاتية مجاناً</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-200 dark:border-slate-800 text-center text-[11px] text-gray-500">
        <p>© {year} TechFix AI. جميع الحقوق محفوظة.</p>
        <p dir="ltr" className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          Made with 🖤 by <span className="text-gray-800 dark:text-white font-extrabold">Hadi Saleh</span>
        </p>
      </div>
    </footer>
  );
}
