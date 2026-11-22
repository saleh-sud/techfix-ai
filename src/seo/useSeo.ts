import { useEffect } from "react";
import { SITE, SITE_URL } from "../config/site";

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  lang?: "ar" | "en";
  noindex?: boolean;
  alternates?: { ar: string; en: string };
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** يحدّث title / description / canonical / Open Graph عند التنقل داخل الموقع (HTML الثابت يحملها أصلاً). */
export function useSeo({ title, description, path, type = "website", lang = "ar", noindex, alternates }: SeoOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;
    document.title = title;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    setLink("canonical", url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE.siteName);
    setMeta("property", "og:locale", lang === "en" ? "en_US" : "ar_AR");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove());
    if (alternates) {
      setLink("alternate", SITE_URL + alternates.ar, "ar");
      setLink("alternate", SITE_URL + alternates.en, "en");
      setLink("alternate", SITE_URL + alternates.ar, "x-default");
    }
  }, [title, description, path, type, lang, noindex, alternates?.ar, alternates?.en]);
}
