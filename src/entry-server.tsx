import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import type { ArticleBody } from "./types";

/** يُستخدم في scripts/postbuild.mjs لتوليد HTML كامل لكل صفحة (نفس ما يرسمه React في المتصفح). */
export function render(url: string, article?: { slug: string } & ArticleBody) {
  (globalThis as { __TF_ARTICLE__?: unknown }).__TF_ARTICLE__ = article;
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
