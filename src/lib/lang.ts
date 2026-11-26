import { useLocation } from "react-router-dom";

export type Lang = "ar" | "en";

/** اللغة تُحدَّد من الرابط: كل ما يبدأ بـ /en إنجليزي (حتى يكون لكل لغة صفحاتها المفهرسة). */
export const langOf = (pathname: string): Lang => (pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ar");

/** يحوّل مساراً عربياً (/posts) لنظيره باللغة المطلوبة (/en/posts). */
export const localPath = (path: string, lang: Lang) => (lang === "en" ? (path === "/" ? "/en" : `/en${path}`) : path);

/** المسار بدون بادئة اللغة */
export const basePath = (pathname: string) => (langOf(pathname) === "en" ? pathname.slice(3) || "/" : pathname);

export function useLang() {
  const { pathname } = useLocation();
  const lang = langOf(pathname);
  const en = lang === "en";
  return {
    lang,
    en,
    to: (path: string) => localPath(path, lang),
    t: (ar: string, english: string) => (en ? english : ar),
  };
}
