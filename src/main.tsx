import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { langOf } from "./lib/lang";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// الصفحات منشورة مسبقاً بالـ HTML الكامل (SSR) => hydrate بدل إعادة الرسم
// startTransition يقسّم الـ hydration لمهام صغيرة (لا يحجب الصفحة => TBT قريب من الصفر)
// نرسم من جديد بدل hydrate عندما يختلف الـ HTML المنشور: صفحة 404 الإنجليزية تحت /ar، أو البحث برابط فيه كلمة
const samePage =
  document.documentElement.lang === langOf(window.location.pathname) && !(window.location.pathname.endsWith("/search") && window.location.search);
if (root.firstElementChild && samePage) startTransition(() => void hydrateRoot(root, app));
else createRoot(root).render(app);
