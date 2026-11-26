// موافقة صاحب الموقع على المقال بالرد على إيميل GitHub: «انشر» أو «لا».
// الاستعمال داخل GitHub Actions:
//   node scripts/approval.mjs body <slug>        -> نص طلب الموافقة (يصل بالإيميل، وفيه المقال كاملاً)
//   node scripts/approval.mjs decide             -> يقرأ COMMENT من البيئة ويطبع publish أو reject أو unknown
//   node scripts/approval.mjs drop <slug>        -> يحذف الموضوع المرفوض من قائمة المواضيع
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const META = ["src/data/articles.json", "src/data/generatedArticles.json"].find((p) => fs.existsSync(path.join(ROOT, p)));
const LIMIT = 60000; // حد نص طلب GitHub 65536 حرفاً

/** أول سطر من الرد فقط؛ الباقي (التوقيع أو النص المقتبس) لا يؤثر. */
export function decide(comment) {
  const first = String(comment || "").split(/\r?\n/).map((l) => l.trim()).find(Boolean) || "";
  const word = first.replace(/[ً-ْـ]/g, "").replace(/[^\p{L}\s]/gu, " ").trim().replace(/\s+/g, " ").toLowerCase();
  if (["انشر", "إنشر", "أنشر", "نشر", "publish"].includes(word)) return "publish";
  if (["لا", "لا تنشر", "ارفض", "إرفض", "أرفض", "رفض", "no", "reject"].includes(word)) return "reject";
  return "unknown";
}

export function body(slug) {
  const meta = read(META).find((a) => a.slug === slug) || {};
  const text = read(`src/content/articles/${slug}.json`);
  const out = [
    "## للنشر: رُدّ على هذا الإيميل بكلمة **انشر**",
    "## للرفض: رُدّ بكلمة **لا**",
    "اكتب الكلمة وحدها في أول سطر. لا يُنشر شيء بدون ردّك.",
    "",
    "---",
    `# ${meta.title || slug}`,
    meta.summary ? `> ${meta.summary}` : "",
    "",
    String(text.content || ""),
    text.contentEn ? `\n---\n# ${meta.titleEn || "English version"}\n\n${text.contentEn}` : "",
  ].join("\n");
  // لا إشارات @ داخل المقال حتى لا يُنبَّه حساب غريب
  const safe = out.replace(/@(?=[A-Za-z0-9])/g, "@​");
  return safe.length > LIMIT ? safe.slice(0, LIMIT) + "\n\n…(النص مقطوع هنا لطوله)" : safe;
}

export function drop(slug) {
  const file = "scripts/article-topics.json";
  const topics = read(file);
  topics.new = (topics.new || []).filter((t) => t.slug !== slug);
  topics.expand = (topics.expand || []).filter((s) => s !== slug);
  fs.writeFileSync(path.join(ROOT, file), JSON.stringify(topics, null, 2) + "\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const [command, slug] = process.argv.slice(2);
  if (command === "decide") console.log(decide(process.env.COMMENT));
  else if (command === "body") process.stdout.write(body(slug));
  else if (command === "drop") drop(slug);
  else process.exit(1);
}
