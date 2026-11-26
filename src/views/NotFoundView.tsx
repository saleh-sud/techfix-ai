import { Link } from "react-router-dom";
import { NOT_FOUND_META, NOT_FOUND_META_EN } from "../seo/routes";
import { useLang } from "../lib/lang";
import { useSeo } from "../seo/useSeo";

export default function NotFoundView() {
  const { lang, en, to, t } = useLang();
  useSeo({ ...(en ? NOT_FOUND_META_EN : NOT_FOUND_META), path: "/404", lang, noindex: true });
  return (
    <div className="py-20 text-center space-y-6 max-w-md mx-auto">
      <div className="text-7xl font-black text-indigo-200 dark:text-slate-800">404</div>
      <h1 className="text-2xl font-black">{t("الصفحة غير موجودة", "Page not found")}</h1>
      <p className="text-xs text-gray-500">{t("الرابط الذي فتحته غير موجود أو تم نقله.", "The link you opened does not exist or has moved.")}</p>
      <Link to={to("/")} className="inline-block px-6 py-2.5 font-bold text-xs bg-brand-blue text-white rounded-xl">
        {t("العودة للصفحة الرئيسية", "Back to home")}
      </Link>
    </div>
  );
}
