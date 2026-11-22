import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

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
if (root.firstElementChild) startTransition(() => void hydrateRoot(root, app));
else createRoot(root).render(app);
