import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { SITE } from "../config/site";
import { staticPage } from "../seo/routes";
import { useLang } from "../lib/lang";
import { useSeo } from "../seo/useSeo";

const UPDATED = "2026-11-22";

function Page({ path, heading, children }: { path: string; heading: string; children: ReactNode }) {
  const { lang, to } = useLang();
  useSeo({ ...staticPage(path, lang), path: to(path), lang, alternates: { ar: `/ar${path}`, en: path } });
  return (
    <article className="max-w-3xl mx-auto bg-white dark:bg-slate-950 p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-slate-800 text-sm leading-loose text-gray-700 dark:text-gray-300 space-y-4 info-page">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white">{heading}</h1>
      {children}
    </article>
  );
}

const H = ({ children }: { children: ReactNode }) => <h2 className="text-lg font-black text-gray-900 dark:text-white pt-2">{children}</h2>;
const Email = () => (
  <a href={`mailto:${SITE.contactEmail}`} className="text-brand-blue font-bold" dir="ltr">
    {SITE.contactEmail}
  </a>
);

export function AboutView() {
  if (useLang().en) return <AboutEn />;
  return (
    <Page path="/about" heading="من نحن">
      <p>
        <strong>TechFix AI</strong> موقع عربي مجاني هدفه تبسيط التقنية للجميع. ننشر كل يوم مقالات وشروحات عملية تساعدك على حل مشاكل هاتفك
        وكمبيوترك واتصالك بالإنترنت بنفسك، بلغة واضحة وخطوات مرتبة.
      </p>
      <H>ماذا نقدّم؟</H>
      <ul className="list-disc ps-6 space-y-1">
        <li>حلول مشاكل أندرويد وآيفون وويندوز خطوة بخطوة.</li>
        <li>شروحات تسريع الإنترنت وضبط الراوتر والواي فاي.</li>
        <li>نصائح الأمان وحماية الحسابات من الاختراق والاحتيال.</li>
        <li>مراجعات وشروحات لأدوات الذكاء الاصطناعي والبرامج والتطبيقات.</li>
        <li>دلائل الألعاب والهاردوير وتجميع الأجهزة.</li>
      </ul>
      <H>كيف نكتب المحتوى؟</H>
      <p>
        نستعين بأدوات الذكاء الاصطناعي في إعداد المسودات وتنظيمها، ونعتمد على المصادر الرسمية (مثل مراكز دعم Google وApple وMicrosoft) ونضع
        روابطها أسفل المقالات. التقنية تتغير بسرعة، لذلك إذا لاحظت معلومة قديمة أو خطأ فراسلنا وسنصحّحه.
      </p>
      <H>تواصل معنا</H>
      <p>
        لأي سؤال أو اقتراح أو تصحيح: <Email />
      </p>
    </Page>
  );
}

export function ContactView() {
  if (useLang().en) return <ContactEn />;
  return (
    <Page path="/contact" heading="تواصل معنا">
      <p>يسعدنا تواصلك معنا لأي سؤال تقني، أو اقتراح موضوع مقال، أو الإبلاغ عن خطأ، أو استفسار يخص الإعلانات والتعاون.</p>
      <a
        href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent("رسالة من موقع TechFix AI")}`}
        className="inline-flex items-center gap-2 bg-brand-blue text-white font-bold px-5 py-3 rounded-xl not-prose"
      >
        <Mail className="w-4 h-4" /> راسلنا عبر البريد الإلكتروني
      </a>
      <p>
        البريد الإلكتروني: <Email />
      </p>
      <p className="text-xs text-gray-500">نرد عادة خلال 2–5 أيام عمل. لا نطلب منك أبداً كلمات سر أو بيانات دفع.</p>
    </Page>
  );
}

export function PrivacyView() {
  if (useLang().en) return <PrivacyEn />;
  return (
    <Page path="/privacy" heading="سياسة الخصوصية">
      <p className="text-xs text-gray-500">آخر تحديث: {UPDATED}</p>
      <p>
        خصوصيتك مهمة لنا. توضّح هذه السياسة ما يجمعه موقع TechFix AI ({SITE.siteUrl}) من معلومات وكيف تُستخدم.
      </p>
      <H>المعلومات التي نجمعها</H>
      <p>
        لا نطلب منك إنشاء حساب ولا نجمع اسمك أو بياناتك الشخصية مباشرة. عند مراسلتنا بالبريد الإلكتروني نستخدم عنوانك فقط للرد عليك. قد تُسجَّل
        بيانات تقنية عامة تلقائياً لدى مزوّد الاستضافة (مثل نوع المتصفح وعنوان IP وتاريخ الزيارة) لأغراض الأمان وقياس الأداء.
      </p>
      <H>ملفات تعريف الارتباط (الكوكيز)</H>
      <p>
        نستخدم الكوكيز والتخزين المحلي لحفظ تفضيلاتك (مثل الوضع الليلي وموافقتك على الكوكيز). كما تستخدم شبكات الإعلانات الكوكيز لعرض إعلانات
        وقياس أدائها. يمكنك حذف الكوكيز أو منعها من إعدادات متصفحك في أي وقت.
      </p>
      <H>الإعلانات وأطراف ثالثة</H>
      <p>
        يعرض الموقع إعلانات من شبكات خارجية مثل <strong>Google AdSense</strong> و<strong>HilltopAds</strong> و<strong>A-ADS</strong>. قد تستخدم هذه
        الشبكات الكوكيز أو تقنيات مشابهة ومعرّفات الأجهزة لعرض إعلانات مناسبة وقياس النقرات ومنع الاحتيال، وفق سياسات الخصوصية الخاصة بها. لا
        نتحكم في هذه الكوكيز ولا نبيع بياناتك لأي طرف.
      </p>
      <H>إعلانات Google</H>
      <p>
        يستخدم موردون من أطراف ثالثة، ومنهم Google، ملفات كوكيز لعرض الإعلانات بناءً على زياراتك السابقة لهذا الموقع أو لمواقع أخرى، ويتيح ذلك
        لـGoogle وشركائها عرض إعلانات لك وفق تلك الزيارات. يمكنك إيقاف الإعلانات المخصصة من <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">إعدادات إعلانات Google</a> أو
        عبر <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
      </p>
      <H>الروابط الخارجية</H>
      <p>تحتوي المقالات على روابط لمواقع خارجية. لسنا مسؤولين عن محتوى أو سياسات خصوصية تلك المواقع.</p>
      <H>حقوقك (GDPR وCCPA)</H>
      <p>
        إذا كنت في الاتحاد الأوروبي أو كاليفورنيا يحق لك طلب معرفة البيانات المتعلقة بك أو حذفها، ورفض الكوكيز غير الضرورية عبر شريط الموافقة.
        للتواصل بخصوص الخصوصية: <Email />
      </p>
      <H>الأطفال</H>
      <p>الموقع غير موجّه للأطفال دون 13 عاماً ولا نجمع بياناتهم عن قصد.</p>
      <H>التعديلات</H>
      <p>قد نحدّث هذه السياسة من وقت لآخر، وسيظهر تاريخ آخر تحديث أعلى الصفحة.</p>
    </Page>
  );
}

export function TermsView() {
  if (useLang().en) return <TermsEn />;
  return (
    <Page path="/terms" heading="شروط الاستخدام">
      <p className="text-xs text-gray-500">آخر تحديث: {UPDATED}</p>
      <p>باستخدامك موقع TechFix AI فأنت توافق على الشروط التالية. إذا لم توافق عليها فيرجى عدم استخدام الموقع.</p>
      <H>طبيعة المحتوى</H>
      <p>
        المحتوى لأغراض تعليمية ومعلوماتية عامة. نبذل جهدنا ليكون دقيقاً ومحدّثاً، لكن لا نضمن خلوّه من الأخطاء أو ملاءمته لجهازك أو حالتك
        تحديداً. اتّبع الخطوات على مسؤوليتك، واحتفظ بنسخة احتياطية من بياناتك قبل أي تعديل على النظام.
      </p>
      <H>الملكية الفكرية</H>
      <p>
        النصوص والتصميم ملك لموقع TechFix AI. يُسمح بالاقتباس القصير مع ذكر المصدر ووضع رابط للمقال، ولا يُسمح بنسخ المقالات كاملة أو إعادة نشرها
        دون إذن مكتوب. العلامات التجارية المذكورة (مثل Android وWindows وiPhone) ملك لأصحابها.
      </p>
      <H>الاستخدام المقبول</H>
      <p>يُمنع استخدام الموقع لأي غرض غير قانوني، أو محاولة اختراقه أو تعطيله، أو جمع محتواه آلياً بشكل يضر بأدائه.</p>
      <H>الإعلانات والروابط</H>
      <p>
        يعرض الموقع إعلانات من أطراف ثالثة وروابط خارجية. تعاملك مع أي معلن أو موقع خارجي يخضع لشروطه هو، ولسنا طرفاً فيه. انظر أيضاً{" "}
        <Link to="/ar/disclaimer" className="text-brand-blue">إخلاء المسؤولية</Link> و<Link to="/ar/privacy" className="text-brand-blue">سياسة الخصوصية</Link>.
      </p>
      <H>تحديد المسؤولية</H>
      <p>لا يتحمّل الموقع أي مسؤولية عن خسارة بيانات أو تلف أجهزة أو أضرار مباشرة أو غير مباشرة ناتجة عن استخدام المحتوى.</p>
      <H>التواصل</H>
      <p>
        لأي استفسار عن هذه الشروط: <Email />
      </p>
    </Page>
  );
}

export function DisclaimerView() {
  if (useLang().en) return <DisclaimerEn />;
  return (
    <Page path="/disclaimer" heading="إخلاء المسؤولية">
      <p>
        المعلومات المنشورة في TechFix AI مقدّمة بحسن نية ولأغراض تعليمية عامة فقط. لا تمثّل نصيحة مهنية، وقد تختلف الخطوات حسب نوع جهازك أو إصدار
        النظام.
      </p>
      <p>
        يُستعان بأدوات الذكاء الاصطناعي في إعداد بعض المقالات، ويُراجع المحتوى ويُصحح عند الإبلاغ عن أي خطأ. ننصحك دائماً بمراجعة المصادر الرسمية
        المرفقة أسفل كل مقال قبل تنفيذ أي إجراء حساس.
      </p>
      <p>
        لا نتحمّل مسؤولية أي ضرر ينتج عن تطبيق الخطوات، ولا عن محتوى الإعلانات أو المواقع الخارجية. ظهور إعلان في الموقع لا يعني أننا نوصي بالمنتج
        أو الخدمة المعلن عنها.
      </p>
      <p>
        للإبلاغ عن خطأ: <Email />
      </p>
    </Page>
  );
}

// ---------- النسخة الإنجليزية ----------
function AboutEn() {
  return (
    <Page path="/about" heading="About Us">
      <p>
        <strong>TechFix AI</strong> is a free website that makes technology simple for everyone. We publish practical articles and guides every day to
        help you fix problems with your phone, computer and internet connection yourself, in plain language and clear steps. The site is available in
        Arabic and English.
      </p>
      <H>What do we offer?</H>
      <ul className="list-disc ps-6 space-y-1">
        <li>Step-by-step fixes for Android, iPhone and Windows problems.</li>
        <li>Guides to faster internet and router and Wi-Fi setup.</li>
        <li>Security tips to protect your accounts from hacking and scams.</li>
        <li>Reviews and tutorials for AI tools, software and apps.</li>
        <li>Gaming, hardware and PC building guides.</li>
      </ul>
      <H>How do we write our content?</H>
      <p>
        We use AI tools to draft and organise articles, rely on official sources (such as Google, Apple and Microsoft support centres) and link to them
        below the articles. Technology changes quickly, so if you spot outdated information or a mistake, tell us and we will correct it.
      </p>
      <H>Contact us</H>
      <p>
        For questions, suggestions or corrections: <Email />
      </p>
    </Page>
  );
}

function ContactEn() {
  return (
    <Page path="/contact" heading="Contact Us">
      <p>We are happy to hear from you about technical questions, article suggestions, error reports, or advertising and partnership enquiries.</p>
      <a
        href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent("Message from TechFix AI")}`}
        className="inline-flex items-center gap-2 bg-brand-blue text-white font-bold px-5 py-3 rounded-xl not-prose"
      >
        <Mail className="w-4 h-4" /> Email us
      </a>
      <p>
        Email: <Email />
      </p>
      <p className="text-xs text-gray-500">We usually reply within 2–5 working days. We will never ask you for passwords or payment details.</p>
    </Page>
  );
}

function PrivacyEn() {
  return (
    <Page path="/privacy" heading="Privacy Policy">
      <p className="text-xs text-gray-500">Last updated: {UPDATED}</p>
      <p>Your privacy matters to us. This policy explains what information TechFix AI ({SITE.siteUrl}) collects and how it is used.</p>
      <H>Information we collect</H>
      <p>
        We do not ask you to create an account and we do not directly collect your name or personal data. When you email us, we use your address only to
        reply. General technical data (such as browser type, IP address and visit date) may be logged automatically by our hosting provider for
        security and performance purposes.
      </p>
      <H>Cookies</H>
      <p>
        We use cookies and local storage to remember your preferences (such as dark mode and your cookie choice). Advertising networks also use cookies
        to show ads and measure their performance. You can delete or block cookies in your browser settings at any time.
      </p>
      <H>Advertising and third parties</H>
      <p>
        The site shows ads from external networks such as <strong>Google AdSense</strong>, <strong>HilltopAds</strong> and <strong>A-ADS</strong>.
        These networks may use cookies or similar technologies and device identifiers to show relevant ads, measure clicks and prevent fraud, under
        their own privacy policies. We do not control those cookies and we do not sell your data to anyone.
      </p>
      <H>Google advertising</H>
      <p>
        Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this site or other sites, which enables Google
        and its partners to show you ads based on those visits. You can opt out of personalised advertising in{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or at{" "}
        <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
      </p>
      <H>External links</H>
      <p>Articles contain links to external sites. We are not responsible for their content or privacy policies.</p>
      <H>Your rights (GDPR and CCPA)</H>
      <p>
        If you are in the European Union or California, you may ask what data relates to you or request its deletion, and you may refuse non-essential
        cookies through the consent banner. Privacy contact: <Email />
      </p>
      <H>Children</H>
      <p>The site is not directed at children under 13 and we do not knowingly collect their data.</p>
      <H>Changes</H>
      <p>We may update this policy from time to time; the latest update date appears at the top of the page.</p>
    </Page>
  );
}

function TermsEn() {
  return (
    <Page path="/terms" heading="Terms of Use">
      <p className="text-xs text-gray-500">Last updated: {UPDATED}</p>
      <p>By using TechFix AI you agree to the following terms. If you do not agree, please do not use the site.</p>
      <H>Nature of the content</H>
      <p>
        Content is for general educational and informational purposes. We do our best to keep it accurate and current, but we do not guarantee that it
        is free of errors or suitable for your particular device or situation. Follow the steps at your own risk and back up your data before changing
        your system.
      </p>
      <H>Intellectual property</H>
      <p>
        The text and design belong to TechFix AI. Short quotations are allowed with attribution and a link to the article; copying or republishing full
        articles without written permission is not. Trademarks mentioned (such as Android, Windows and iPhone) belong to their owners.
      </p>
      <H>Acceptable use</H>
      <p>You may not use the site for any unlawful purpose, try to breach or disrupt it, or harvest its content automatically in a way that harms its performance.</p>
      <H>Ads and links</H>
      <p>
        The site shows third-party ads and external links. Your dealings with any advertiser or external site are governed by their own terms, and we
        are not a party to them. See also our <Link to="/disclaimer" className="text-brand-blue">Disclaimer</Link> and{" "}
        <Link to="/privacy" className="text-brand-blue">Privacy Policy</Link>.
      </p>
      <H>Limitation of liability</H>
      <p>The site accepts no liability for data loss, device damage, or direct or indirect harm resulting from use of the content.</p>
      <H>Contact</H>
      <p>
        Questions about these terms: <Email />
      </p>
    </Page>
  );
}

function DisclaimerEn() {
  return (
    <Page path="/disclaimer" heading="Disclaimer">
      <p>
        Information on TechFix AI is provided in good faith and for general educational purposes only. It is not professional advice, and steps may
        differ depending on your device or system version.
      </p>
      <p>
        AI tools are used to prepare some articles, and content is reviewed and corrected when errors are reported. Always check the official sources
        listed under each article before taking any sensitive action.
      </p>
      <p>
        We accept no responsibility for damage resulting from following the steps, or for the content of ads or external sites. An ad appearing on the
        site does not mean we recommend the advertised product or service.
      </p>
      <p>
        To report an error: <Email />
      </p>
    </Page>
  );
}
