/**
 * يرسل روابط الموقع إلى IndexNow (Bing / Yandex / Seznam ...) حتى تُؤرشف بسرعة.
 * يُشغَّل بعد النشر:  npm run indexnow            (كل الروابط)
 *                     npm run indexnow -- /post/x  (روابط محددة)
 */
import fs from "node:fs";
import path from "node:path";

const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), "site.config.json"), "utf8"));
const SITE = config.siteUrl.replace(/\/+$/, "");
const host = new URL(SITE).host;

let urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : SITE + p));
if (urls.length === 0) {
  const xml = fs.readFileSync(path.join(process.cwd(), "dist", "sitemap.xml"), "utf8");
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key: config.indexNowKey,
    keyLocation: `${SITE}/${config.indexNowKey}.txt`,
    urlList: urls.slice(0, 10000),
  }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urls.length} URL(s)`);
// بعض الحالات ترفض الـ POST للقوائم القصيرة (422)؛ عندها نرسل كل رابط بطلب GET
if (res.status === 422 && urls.length <= 50) {
  for (const u of urls) {
    const r = await fetch(`https://api.indexnow.org/indexnow?url=${encodeURIComponent(u)}&key=${config.indexNowKey}`);
    console.log(`  ${r.status} ${u}`);
  }
}
if (res.status >= 400 && res.status !== 422) process.exitCode = 1;
