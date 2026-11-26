import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../lib/lang";

const KEY = "cookie-consent-v1";

/** شريط موافقة الكوكيز (مطلوب لزوار أوروبا بسبب الإعلانات). */
export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { en, to, t } = useLang();

  useEffect(() => {
    try {
      setShow(!localStorage.getItem(KEY));
    } catch {
      setShow(false);
    }
  }, []);

  const choose = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;
  return (
    <div
      dir={en ? "ltr" : "rtl"}
      className="fixed bottom-3 inset-x-3 md:inset-x-auto md:right-4 md:max-w-md z-[100000] bg-slate-900 text-white rounded-2xl shadow-2xl p-4 text-xs leading-relaxed"
      role="dialog"
      aria-label={t("موافقة ملفات تعريف الارتباط", "Cookie consent")}
      aria-live="polite"
    >
      <p className="mb-3">
        {t("نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك ولعرض الإعلانات وقياس الزيارات.", "We use cookies to improve your experience, show ads and measure traffic.")}{" "}
        <Link to={to("/privacy")} className="underline text-cyan-300">
          {t("سياسة الخصوصية", "Privacy Policy")}
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <button onClick={() => choose("essential")} className="px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-800 cursor-pointer">
          {t("الضرورية فقط", "Essential only")}
        </button>
        <button onClick={() => choose("all")} className="px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 font-bold cursor-pointer">
          {t("موافق", "Accept")}
        </button>
      </div>
    </div>
  );
}
