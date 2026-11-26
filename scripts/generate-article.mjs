/**
 * عامل المقالات: يكتب مقالاً تقنياً عربياً (~1000 كلمة) + نسخة إنجليزية.
 *   - البيانات الوصفية: src/data/articles.json      - النص الكامل: src/content/articles/<slug>.json
 * مجاني بالكامل وبدون أي مفتاح عبر Pollinations.ai (واجهة متوافقة مع OpenAI).
 * الكتابة على مراحل: مخطط ← كل قسم لحاله ← النسخة الإنجليزية.
 * عندما يبقى أقل من 5 مواضيع، يقترح مواضيع جديدة غير مكررة تلقائياً (القائمة لا تنتهي).
 *
 *   node scripts/generate-article.mjs            مقال واحد
 *   node scripts/generate-article.mjs --count 3  ثلاث مقالات
 *
 * يطبع:  NEW_URLS=/post/a,/post/b   ويكتب new_urls في GITHUB_OUTPUT (لـ IndexNow)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const META_FILE = path.join(ROOT, "src/data/articles.json");
const CONTENT_DIR = path.join(ROOT, "src/content/articles");
const TOPICS_FILE = path.join(ROOT, "scripts/article-topics.json");
const TOPICS = JSON.parse(fs.readFileSync(TOPICS_FILE, "utf8"));
const CATEGORIES = ["ai", "android", "windows", "iphone", "internet", "security", "software", "gaming", "hardware", "tutorials", "tech"];
const ENDPOINT = process.env.LLM_ENDPOINT || "https://text.pollinations.ai/openai";
const MODELS = (process.env.LLM_MODELS || "openai,openai-fast").split(",");
const MIN_WORDS = 850;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(CONTENT_DIR, { recursive: true });

const countArg = process.argv.indexOf("--count");
const COUNT = countArg > -1 ? Number(process.argv[countArg + 1]) || 1 : 1;

const articles = JSON.parse(fs.readFileSync(META_FILE, "utf8"));
const words = (s) => String(s || "").split(/\s+/).filter(Boolean).length;
const bodyOf = (slug) => {
  const f = path.join(CONTENT_DIR, `${slug}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : { content: "" };
};
// مقال "منجز" = موجود وطوله كافٍ
const done = new Set(articles.filter((a) => words(bodyOf(a.slug).content) >= MIN_WORDS).map((a) => a.slug));
const allKnownSlugs = () => new Set([...articles.map((a) => a.slug), ...TOPICS.new.map((t) => t.slug), ...TOPICS.expand]);
const allKnownTitles = () => [...articles.map((a) => a.title), ...TOPICS.new.map((t) => t.keyword)];
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
const normAr = (s) => String(s).replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 2);
/** تشابه بين عنوانين (نسبة الكلمات المشتركة) لمنع تكرار نفس الموضوع بصياغة مختلفة */
const similar = (a, b) => {
  const A = new Set(normAr(a)), B = new Set(normAr(b));
  if (!A.size || !B.size) return 0;
  let n = 0;
  for (const w of A) if (B.has(w)) n++;
  return n / Math.min(A.size, B.size);
};

const GAP_MS = Number(process.env.LLM_GAP_MS || 47000);
let lastCall = 0;
let limitHits = 0;
async function chat(messages, maxTokens = 2500) {
  let lastErr;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // الحد المجاني: رد واحد كل 45 ثانية لكل IP
        const wait = lastCall + GAP_MS - Date.now();
        if (wait > 0) await sleep(wait);
        lastCall = Date.now();
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 180000);
        const res = await fetch(ENDPOINT, {
          method: "POST",
          signal: ctrl.signal,
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ model, messages, max_tokens: maxTokens, response_format: { type: "json_object" }, referrer: "techfix-ai" }),
        }).finally(() => clearTimeout(timer));
        const text = await res.text();
        lastCall = Date.now();
        if (res.status === 402 || res.status === 429) {
          const after = Number(text.match(/after (\d+)s/)?.[1] || 45);
          lastCall = Date.now() + after * 1000 - GAP_MS + 2000;
          attempt--; // انتظار الحد لا يُحسب محاولة فاشلة
          if (++limitHits > 30) throw new Error("rate limit");
          continue;
        }
        if (!res.ok) throw new Error(`${model} HTTP ${res.status}: ${text.slice(0, 200)}`);
        const content = JSON.parse(text).choices?.[0]?.message?.content || "";
        return JSON.parse(content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1));
      } catch (e) {
        lastErr = e;
        console.warn(`  ⚠ ${String(e.message).slice(0, 160)}`);
        await sleep(5000 * attempt);
      }
    }
  }
  throw lastErr;
}

/** لما يقرب يخلص المواضيع: اقتراح 20 موضوع جديد غير مكرر. */
async function refillTopics() {
  const remaining = TOPICS.new.filter((t) => !done.has(t.slug)).length;
  if (remaining >= 5) return;
  const known = allKnownSlugs();
  const titles = allKnownTitles();
  // نختار الأقسام الأقل مقالات حتى يتوزع المحتوى
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  for (const a of articles) counts[a.category] = (counts[a.category] || 0) + 1;
  const focus = [...CATEGORIES].sort((a, b) => counts[a] - counts[b]).slice(0, 6);
  const res = await chat([
    { role: "system", content: "You are an SEO content strategist for an Arabic tech help website. Return JSON only." },
    {
      role: "user",
      content: `Suggest 20 NEW article topics that Arabic-speaking people actually search on Google: tech problems and their fixes, step-by-step how-tos, comparisons and explainers.
Allowed categories: ${CATEGORIES.join(", ")} (ai=artificial intelligence tools, internet=internet/wifi/routers, security=security & privacy, software=apps & programs, tutorials=step-by-step guides, tech=tech explainers & trends).
Focus mostly on these categories: ${focus.join(", ")}.
Each topic must be clearly different from these existing ones: ${titles.slice(-200).join(" | ")}
Return JSON: {"topics": [{"slug": "short-english-kebab-case-slug", "keyword": "عنوان الموضوع بالعربية كما يبحث عنه الناس", "category": "one of the allowed categories"}]}`,
    },
  ]);
  let added = 0;
  for (const t of res.topics || []) {
    const slug = slugify(t.slug);
    const keyword = String(t.keyword || "").trim();
    if (!slug || !keyword || known.has(slug)) continue;
    if (titles.some((x) => similar(x, keyword) >= 0.75)) continue;
    TOPICS.new.push({ slug, keyword, category: CATEGORIES.includes(t.category) ? t.category : "tech" });
    known.add(slug);
    titles.push(keyword);
    added++;
  }
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(TOPICS, null, 2) + "\n");
  console.log(`🧠 أُضيف ${added} موضوع جديد إلى القائمة`);
}

function nextTask() {
  const expand = TOPICS.expand.filter((s) => !done.has(s));
  const fresh = TOPICS.new.filter((t) => !done.has(t.slug));
  const newSoFar = TOPICS.new.length - fresh.length;
  // توسيع المقالات القديمة القصيرة (واحد مقابل كل 3 جديدة)
  if (expand.length && (newSoFar % 3 === 0 || !fresh.length)) {
    const a = articles.find((x) => x.slug === expand[0]);
    if (a) return { kind: "expand", slug: a.slug, keyword: a.title, category: a.category, existing: a };
    done.add(expand[0]);
    return nextTask();
  }
  if (fresh.length) return { kind: "new", slug: fresh[0].slug, keyword: fresh[0].keyword, category: fresh[0].category };
  return null;
}

const clean = (t = "") =>
  String(t)
    .replace(/\\n/g, "\n")
    .replace(/^#{1,4}\s+.*$/gm, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const SYS_AR =
  "أنت كاتب محتوى تقني عربي محترف ومحرر لغوي وخبير SEO. تكتب بعربية فصحى سهلة وواضحة، بجمل قصيرة وخطوات عملية مرقّمة يستطيع أي مستخدم تطبيقها. تذكر أسماء القوائم والإعدادات كما تظهر في الأجهزة (بالعربية مع الاسم الإنجليزي بين قوسين عند الحاجة). لا تخترع إحصاءات أو أرقام إصدارات أو أسماء دراسات. تعيد JSON فقط.";

async function writeArabic(task) {
  const askOutline = () => chat([
    { role: "system", content: SYS_AR },
    {
      role: "user",
      content: `${task.kind === "expand" ? "خطط لدليل شامل يعيد كتابة ويوسّع مقالاً بعنوان" : "خطط لمقال تقني شامل عن"}: "${task.keyword}".
أعد JSON:
{"title": "عنوان جذاب 50-65 حرفاً يحتوي الكلمة المفتاحية",
 "summary": "وصف ميتا 140-160 حرفاً",
 "intro": "مقدمة 80-100 كلمة تذكر المشكلة أو الموضوع في أول جملة وتوضح ماذا سيتعلم القارئ",
 "sections": [{"heading": "عنوان فرعي", "points": ["نقطة يجب تغطيتها"]}],
 "faq": [{"q": "سؤال يبحث عنه الناس؟", "a": "جواب 30-45 كلمة"}]}
عدد الأقسام 7 (العناوين بدون ترقيم)، تبدأ بالأسباب أو الأساسيات ثم الحلول/الخطوات العملية ثم النصائح. عدد الأسئلة 4. لا تذكر كلمة SEO أو "الكلمة المفتاحية" في النص.`,
    },
  ]);
  // أداة الكتابة المجانية تعيد أحياناً مخططاً ناقصاً: نطلبه من جديد قبل أن نتخلى عن المقال.
  let outline = {}, sections = [];
  for (let tries = 1; tries <= 5 && sections.length < 5; tries++) {
    outline = (await askOutline()) || {};
    sections = (Array.isArray(outline.sections) ? outline.sections : []).filter((x) => x && x.heading).slice(0, 8);
    if (sections.length < 5) console.warn(`  ⚠ مخطط ناقص (${sections.length} أقسام، الحقول: ${Object.keys(outline).join(",")}) — محاولة ${tries}`);
  }
  if (sections.length < 5) throw new Error("مخطط ناقص");
  const parts = [clean(outline.intro)];
  for (const sec of sections) {
    const body = await chat([
      { role: "system", content: SYS_AR },
      {
        role: "user",
        content: `ضمن مقال بعنوان "${outline.title}"، اكتب محتوى القسم: "${sec.heading}".
غطِّ هذه النقاط: ${(sec.points || []).join("، ")}.
الطول 140-170 كلمة: فقرة قصيرة ثم خطوات أو نقاط عملية — كل خطوة في سطر يبدأ بـ "1. " و"2. " ... أو كل نقطة في سطر يبدأ بـ "- ". استخدم **غامق** لأسماء الإعدادات أو كلمة مهمة فقط. لا تكتب العنوان.
أعد JSON: {"text": "..."}`,
      },
    ]);
    parts.push(`## ${String(sec.heading).replace(/^#+\s*/, "").replace(/^\d+[.)-]\s*/, "").trim()}\n\n${clean(body.text)}`);
  }
  const faq = (outline.faq || []).map((f) => `- **${String(f.q).trim()}** ${String(f.a).trim()}`).join("\n");
  if (faq) parts.push(`## أسئلة شائعة\n\n${faq}`);
  return { title: outline.title, summary: outline.summary, sections, faq: outline.faq || [], content: parts.join("\n\n") };
}

async function writeEnglish(ar) {
  const sys = "You are a professional tech-help writer and SEO editor writing clear, natural English with practical steps. Return JSON only.";
  const head = await chat([
    { role: "system", content: sys },
    {
      role: "user",
      content: `Adapt this Arabic tech article for an English audience.
Title: ${ar.title}
Summary: ${ar.summary}
Section headings: ${ar.sections.map((x) => x.heading).join(" | ")}
FAQ: ${ar.faq.map((f) => f.q).join(" | ")}
Return JSON: {"titleEn": "...", "summaryEn": "140-160 chars", "intro": "70-90 word intro", "headings": ["English heading for each section, same order"], "faq": [{"q": "...", "a": "30-40 words"}]}`,
    },
  ]);
  const blocks = ar.content.split(/\n(?=## )/).slice(1, 1 + ar.sections.length);
  const parts = [clean(head.intro)];
  for (let i = 0; i < blocks.length; i++) {
    const body = await chat([
      { role: "system", content: sys },
      {
        role: "user",
        content: `Write the English version (natural, not literal, 100-130 words) of this article section. Keep numbered steps as "1. " lines and bullet points as "- " lines. Do not write the heading.\n\n${blocks[i]}\n\nReturn JSON: {"text": "..."}`,
      },
    ]);
    const h = String((head.headings || [])[i] || `Section ${i + 1}`).replace(/^\d+\s*[.)\-–:]\s*/, "");
    parts.push(`## ${h}\n\n${clean(body.text)}`);
  }
  const faq = (head.faq || []).map((f) => `- **${String(f.q).trim()}** ${String(f.a).trim()}`).join("\n");
  if (faq) parts.push(`## Frequently asked questions\n\n${faq}`);
  return { titleEn: head.titleEn, summaryEn: head.summaryEn, contentEn: parts.join("\n\n") };
}

const today = new Date().toISOString().slice(0, 10);
const newUrls = [];

for (let i = 0; i < COUNT; i++) {
  try {
    await refillTopics();
  } catch (e) {
    console.warn("تعذّر اقتراح مواضيع جديدة الآن:", String(e.message).slice(0, 120));
  }
  const task = nextTask();
  if (!task) {
    console.log("لا توجد مواضيع متبقية.");
    break;
  }
  console.log(`✍️  ${task.kind === "expand" ? "توسيع" : "جديد"}: ${task.slug}`);
  try {
    let ar;
    for (let tries = 1; tries <= 2; tries++) {
      ar = await writeArabic(task);
      const w = words(ar.content);
      console.log(`   العربي: ${w} كلمة`);
      if (w >= MIN_WORDS) break;
      if (tries === 2) throw new Error(`المقال قصير جداً (${w} كلمة) — لم يُحفظ.`);
    }
    // الإنجليزية هي لغة الموقع الأساسية: بدونها لا يُحفظ المقال (محاولتان)
    let en;
    for (let tries = 1; ; tries++) {
      try {
        en = await writeEnglish(ar);
        console.log(`   الإنجليزي: ${words(en.contentEn)} كلمة`);
        if (words(en.contentEn) >= 300 && en.titleEn) break;
        throw new Error("النسخة الإنجليزية ناقصة");
      } catch (e) {
        if (tries === 2) throw e;
        console.warn("   إعادة محاولة النسخة الإنجليزية:", String(e.message).slice(0, 120));
      }
    }
    const w = words(ar.content);
    const meta = {
      slug: task.slug,
      title: String(ar.title).trim(),
      titleEn: String(en.titleEn || "").trim(),
      summary: String(ar.summary).trim(),
      summaryEn: String(en.summaryEn || "").trim(),
      category: CATEGORIES.includes(task.category) ? task.category : "tech",
      readTime: `${Math.max(4, Math.round(w / 200))} دقائق`,
      date: today,
      hasEn: true,
    };
    fs.writeFileSync(path.join(CONTENT_DIR, `${task.slug}.json`), JSON.stringify({ content: ar.content.trim(), contentEn: String(en.contentEn || "").trim() }, null, 2) + "\n");
    const idx = articles.findIndex((a) => a.slug === task.slug);
    if (idx >= 0) articles[idx] = meta;
    else articles.push(meta);
    done.add(task.slug);
    newUrls.push(`/post/${task.slug}`);
    newUrls.push(`/ar/post/${task.slug}`);
    fs.writeFileSync(META_FILE, JSON.stringify(articles, null, 2) + "\n");
    console.log(`   ✅ حُفظ: ${meta.title}`);
  } catch (e) {
    // مقال فاشل لا يوقف الباقي؛ ننقل الموضوع لآخر القائمة حتى لا يعلق العامل عليه
    console.error(`   ❌ فشل ${task.slug}: ${String(e.message).slice(0, 200)}`);
    if (task.kind === "new") {
      const t = TOPICS.new.splice(TOPICS.new.findIndex((x) => x.slug === task.slug), 1)[0];
      TOPICS.new.push(t);
    } else {
      TOPICS.expand.push(TOPICS.expand.splice(TOPICS.expand.indexOf(task.slug), 1)[0]);
    }
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(TOPICS, null, 2) + "\n");
  }
}

console.log(`NEW_URLS=${newUrls.join(",")}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `new_urls=${newUrls.join(" ")}\n`);
