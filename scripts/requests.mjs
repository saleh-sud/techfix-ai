// طلب مقال بأي وقت: صاحب المستودع يردّ على صفحة «اطلب مقال» (من الإيميل أو الموقع).
//   node scripts/requests.mjs handle   -> يقرأ الرد (COMMENT) ويشغّل عامل المقالات أو يغيّر الحد اليومي
//   node scripts/requests.mjs run      -> يكتب المقالات ويفتح طلب موافقة لكل مقال (من articles.yml)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIMIT_FILE = "scripts/article-limit.json";
export const HARD_MAX = 10; // أعلى حد يومي مسموح لكل موقع
const DEFAULT_LIMIT = 5;

const META = () => ["src/data/articles.json", "src/data/generatedArticles.json"].find((p) => fs.existsSync(path.join(ROOT, p)));

/** أول سطر من الرد فقط (الباقي توقيع أو نص مقتبس). */
export function parse(comment) {
  const first = String(comment || "").split(/\r?\n/).map((l) => l.trim()).find(Boolean) || "";
  const line = first
    .replace(/[ً-ْـ‎‏]/g, "")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660))
    .replace(/\s+/g, " ")
    .trim();
  const limit = line.match(/^(?:الحد|حد|limit)(?: اليومي)? ?[:=]? ?(\d{1,3})$/i);
  if (limit) return { action: "limit", n: Number(limit[1]) };
  if (line.startsWith(">")) return { action: "unknown" };
  // كلمة «مقال» لازم تكون ضمن أول 3 كلمات، حتى لا يُفهم كلام عادي على أنه طلب
  const m = line.match(/^(?:\S+ ){0,3}?(مقالين|مقالتين|مقالات|مقالة|مقاله|مقالا|مقال|articles|article)(?![\p{L}])(.*)$/iu);
  if (!m) return { action: "unknown" };
  const before = line.slice(0, line.indexOf(m[1]));
  if (/(?:^| )(لا|ما|بلا|بدون|no|not|don't)(?: |$)/i.test(before)) return { action: "unknown" };
  const rest = m[2].trim();
  const topic = rest.match(/(?:^|\s)(?:عن|حول|about)(?::| )\s*(.+)$/i);
  if (topic) return { action: "write", count: 1, topic: topic[1].replace(/[.!؟?]+$/, "").trim().slice(0, 150) };
  if (/^(مقالين|مقالتين)$/.test(m[1])) return { action: "write", count: 2, topic: "" };
  const num = (rest.match(/\d{1,3}/) || before.match(/\d{1,3}/) || [])[0];
  const count = num === undefined ? 1 : Number(num);
  return count >= 1 ? { action: "write", count, topic: "" } : { action: "unknown" };
}

export const dayOf = (date) => new Date(date).toLocaleDateString("en-CA", { timeZone: "Asia/Damascus" });
export const articlePrs = (list) => list.filter((p) => String(p.headRefName || "").startsWith("article/"));
export const slugOf = (branch) => String(branch).replace(/^article\//, "").replace(/-\d+(?:-\d+)?$/, "");

export function readLimit() {
  try {
    const n = JSON.parse(fs.readFileSync(path.join(ROOT, LIMIT_FILE), "utf8")).perDay;
    return Number.isInteger(n) && n >= 1 ? Math.min(n, HARD_MAX) : DEFAULT_LIMIT;
  } catch {
    return DEFAULT_LIMIT;
  }
}

const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], ...opts });
const show = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit", ...opts });
const prs = () => articlePrs(JSON.parse(sh("gh", ["pr", "list", "--state", "all", "--limit", "100", "--json", "headRefName,createdAt,state"])));
const madeToday = (list) => list.filter((p) => dayOf(p.createdAt) === dayOf(Date.now())).length;
const say = (text) => (process.env.ISSUE ? show("gh", ["issue", "comment", process.env.ISSUE, "--body", text]) : console.log(text));
const identity = () => {
  sh("git", ["config", "user.name", "articles-bot"]);
  sh("git", ["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
};

export const HELP = [
  "اكتب في أول سطر من ردّك واحدة من هذه:",
  "- `مقال` — مقال واحد الآن",
  "- `مقال 3` — ثلاثة مقالات",
  "- `مقال عن حل مشكلة كذا` — مقال بموضوع تختاره",
  "- `الحد 5` — تغيير الحد اليومي (من 1 إلى " + HARD_MAX + ")",
  "",
  "كل مقال يصلك للموافقة، ولا يُنشر قبل ردّك بكلمة «انشر».",
].join("\n");

function handle() {
  const base = process.env.BASE;
  const ask = parse(process.env.COMMENT);
  if (ask.action === "unknown") return say("لم أفهم الطلب.\n\n" + HELP);
  if (ask.action === "limit") {
    if (ask.n < 1 || ask.n > HARD_MAX) return say(`الحد اليومي لازم يكون من 1 إلى ${HARD_MAX}.`);
    identity();
    fs.writeFileSync(path.join(ROOT, LIMIT_FILE), JSON.stringify({ perDay: ask.n }) + "\n");
    sh("git", ["add", LIMIT_FILE]);
    try {
      sh("git", ["diff", "--cached", "--quiet"]);
    } catch {
      sh("git", ["commit", "-m", `Daily article limit: ${ask.n} [skip netlify]`]);
      sh("git", ["pull", "--rebase", "origin", base]);
      sh("git", ["push", "origin", `HEAD:${base}`]);
    }
    return say(`تم. الحد اليومي صار ${ask.n}.`);
  }
  const busy = ["queued", "in_progress", "pending", "waiting"].some(
    (s) => JSON.parse(sh("gh", ["run", "list", "--workflow", "articles.yml", "--status", s, "--json", "databaseId"])).length,
  );
  if (busy) return say("في كتابة شغّالة الآن. استنّى لحد ما يوصلك المقال (حوالي 20 دقيقة للمقال) واطلب من جديد.");
  const limit = readLimit();
  const left = limit - madeToday(prs());
  if (left <= 0) return say(`وصلت الحد اليومي (${limit}). لزيادته اكتب مثلاً: الحد ${Math.min(limit + 2, HARD_MAX)}`);
  const count = Math.min(ask.count, left);
  show("gh", ["workflow", "run", "articles.yml", "--ref", base, "-f", `count=${count}`, "-f", `topic=${ask.topic}`, "-f", `issue=${process.env.ISSUE}`]);
  const cut = count < ask.count ? ` (طلبت ${ask.count}، والباقي لك اليوم ${left} فقط)` : "";
  say(`حاضر. بدأت كتابة ${count === 1 ? "مقال واحد" : count + " مقالات"}${ask.topic ? ` عن: ${ask.topic.replace(/@/g, "")}` : ""}${cut}. يصلك للموافقة بعد حوالي ${count * 20} دقيقة.`);
}

function run() {
  const base = process.env.BASE;
  const scheduled = process.env.EVENT === "schedule";
  const topic = String(process.env.TOPIC || "").trim();
  const list = prs();
  const open = list.filter((p) => p.state === "OPEN");
  if (scheduled && open.length) return console.log("::notice::An article is still waiting for approval. Nothing new is written.");
  const limit = readLimit();
  const wanted = scheduled || topic ? 1 : Math.max(1, Number(process.env.COUNT) || 1);
  const count = Math.min(wanted, limit - madeToday(list));
  if (count <= 0) return say(`وصلت الحد اليومي (${limit}). لم أكتب مقالاً.`);
  identity();
  const meta = META();
  const skip = open.map((p) => slugOf(p.headRefName));
  const output = path.join(process.env.RUNNER_TEMP || ROOT, "article-output.txt");
  let made = 0;
  for (let i = 0; i < count; i++) {
    sh("git", ["fetch", "-q", "origin", base]);
    sh("git", ["checkout", "-q", "-f", "--detach", `origin/${base}`]);
    sh("git", ["clean", "-fdq", "src/content/articles"]);
    fs.writeFileSync(output, "");
    try {
      show("node", ["scripts/generate-article.mjs", "--count", "1"], {
        timeout: 60 * 60 * 1000,
        env: { ...process.env, SKIP_SLUGS: skip.join(","), TOPIC: topic, GITHUB_OUTPUT: output },
      });
    } catch (e) {
      console.error("::warning::The article could not be written:", String(e.message).slice(0, 200));
    }
    const slug = (fs.readFileSync(output, "utf8").match(/new_urls=(\S+)/)?.[1] || "").split("/").pop();
    if (!slug) {
      // نحفظ ترتيب المواضيع حتى لا يعلق العامل على الموضوع نفسه في كل مرة
      try {
        sh("git", ["diff", "--quiet", "--", "scripts/article-topics.json"]);
      } catch {
        sh("git", ["add", "scripts/article-topics.json"]);
        sh("git", ["commit", "-m", "Topic list after a failed article [skip netlify]"]);
        sh("git", ["pull", "--rebase", "origin", base]);
        sh("git", ["push", "origin", `HEAD:${base}`]);
      }
      continue;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("unexpected slug");
    show("npm", ["run", "build"], { shell: process.platform === "win32" });
    const branch = `article/${slug}-${process.env.RUN_ID}`;
    sh("git", ["checkout", "-q", "-b", branch]);
    sh("git", ["add", meta, "src/content/articles", "scripts/article-topics.json"]);
    sh("git", ["commit", "-q", "-m", `Article for approval: ${slug}`]);
    sh("git", ["push", "-q", "origin", branch]);
    const body = path.join(process.env.RUNNER_TEMP || ROOT, "article-body.md");
    fs.writeFileSync(body, sh("node", ["scripts/approval.mjs", "body", slug]));
    const title = JSON.parse(fs.readFileSync(path.join(ROOT, meta), "utf8")).find((a) => a.slug === slug)?.title || slug;
    show("gh", ["pr", "create", "--base", base, "--head", branch, "--title", `مقال بانتظار موافقتك: ${title}`, "--body-file", body, "--assignee", process.env.OWNER]);
    skip.push(slug);
    made++;
  }
  if (made < count) {
    say(`تعذّرت كتابة ${count - made} من ${count} (خدمة الكتابة المجانية لم تُرجع مقالاً صالحاً). جرّب الطلب بعد قليل.`);
    if (!made) process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const command = process.argv[2];
  if (command === "handle") handle();
  else if (command === "run") run();
  else process.exit(1);
}
