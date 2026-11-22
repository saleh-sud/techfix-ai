import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Sun, Moon, Search, Menu, X } from "lucide-react";

const NAV = [
  { label: "الرئيسية", path: "/" },
  { label: "كل المقالات", path: "/posts" },
  { label: "الأقسام", path: "/categories" },
  { label: "من نحن", path: "/about" },
  { label: "تواصل معنا", path: "/contact" },
];

export default function Header({ isDarkMode, onThemeToggle }: { isDarkMode: boolean; onThemeToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ("");
    setOpen(false);
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-xs font-bold rounded-xl transition-all ${
      isActive ? "bg-brand-blue/10 text-brand-blue dark:text-brand-cyan" : "text-gray-600 hover:text-brand-blue hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-900"
    }`;

  const searchBox = (
    <form onSubmit={submit} className="relative" role="search">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث عن حل لمشكلتك..."
        aria-label="بحث"
        className="w-full md:w-56 pr-9 pl-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-brand-cyan outline-none"
      />
      <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
    </form>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 font-black" aria-label="TechFix AI الرئيسية">
          <span className="p-2 bg-gradient-to-tr from-brand-blue to-brand-cyan text-white rounded-xl shadow-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </span>
          <span className="text-xl tracking-tight text-gray-900 dark:text-white font-extrabold" dir="ltr">
            TechFix <span className="text-brand-cyan">AI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="القائمة الرئيسية">
          {NAV.map((l) => (
            <NavLink key={l.path} to={l.path} end={l.path === "/"} className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">{searchBox}</div>
          <button
            onClick={onThemeToggle}
            aria-label="تبديل الوضع الليلي"
            className="p-2 rounded-xl bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-amber-300 cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} aria-label="القائمة" className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-slate-900 cursor-pointer">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200 dark:border-slate-800 px-4 py-3 space-y-2 bg-white dark:bg-slate-950">
          {searchBox}
          {NAV.map((l) => (
            <NavLink key={l.path} to={l.path} end={l.path === "/"} onClick={() => setOpen(false)} className={(s) => `block ${linkCls(s)}`}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
