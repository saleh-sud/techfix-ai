import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalAds from "./components/GlobalAds";
import CookieConsent from "./components/CookieConsent";
import HomeView from "./views/HomeView";
import ListView from "./views/ListView";
import ArticleView from "./views/ArticleView";
import CategoriesView from "./views/CategoriesView";
import SearchView from "./views/SearchView";
import NotFoundView from "./views/NotFoundView";
import { AboutView, ContactView, PrivacyView, TermsView, DisclaimerView } from "./views/InfoPages";

export default function App() {
  const { pathname } = useLocation();
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("techfix_dark_mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("techfix_dark_mode", String(dark));
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`min-h-screen flex flex-col font-sans arabic-rtl ${dark ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      <Header isDarkMode={dark} onThemeToggle={() => setDark(!dark)} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/posts" element={<ListView />} />
          <Route path="/posts/page/:page" element={<ListView />} />
          <Route path="/category/:category" element={<ListView />} />
          <Route path="/category/:category/page/:page" element={<ListView />} />
          <Route path="/post/:slug" element={<ArticleView />} />
          <Route path="/en/post/:slug" element={<ArticleView lang="en" />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/search" element={<SearchView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/privacy" element={<PrivacyView />} />
          <Route path="/terms" element={<TermsView />} />
          <Route path="/disclaimer" element={<DisclaimerView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>
      <Footer />
      <GlobalAds />
      <CookieConsent />
    </div>
  );
}
