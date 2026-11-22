import { Link } from "react-router-dom";
import { NOT_FOUND_META } from "../seo/routes";
import { useSeo } from "../seo/useSeo";

export default function NotFoundView() {
  useSeo({ ...NOT_FOUND_META, path: "/404", noindex: true });
  return (
    <div className="py-20 text-center space-y-6 max-w-md mx-auto">
      <div className="text-7xl font-black text-indigo-200 dark:text-slate-800">404</div>
      <h1 className="text-2xl font-black">الصفحة غير موجودة</h1>
      <p className="text-xs text-gray-500">الرابط الذي فتحته غير موجود أو تم نقله.</p>
      <Link to="/" className="inline-block px-6 py-2.5 font-bold text-xs bg-brand-blue text-white rounded-xl">
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
}
