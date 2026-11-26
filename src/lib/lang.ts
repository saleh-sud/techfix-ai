import { useLocation } from "react-router-dom";

export type Lang = "ar" | "en";

/** الإنجليزية هي الأساسية (بدون بادئة)، وكل ما يبدأ بـ /ar عربي (لكل لغة صفحاتها المفهرسة). */
export const langOf = (pathname: string): Lang => (pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en");

/** يحوّل المسار الأساسي (/posts) لنظيره باللغة المطلوبة (/ar/posts للعربية). */
export const localPath = (path: string, lang: Lang) => (lang === "ar" ? (path === "/" ? "/ar" : `/ar${path}`) : path);

/** المسار بدون بادئة اللغة */
export const basePath = (pathname: string) => (langOf(pathname) === "ar" ? pathname.slice(3) || "/" : pathname);

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
