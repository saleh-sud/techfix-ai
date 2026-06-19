import SEOHelper from '../components/SEOHelper';
import { ShieldCheck, Target, Heart, Users, Laptop, Sparkles } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-12">
      {/* SEO metadata */}
      <SEOHelper 
        title="من نحن - قصة TechFix AI"
        description="تعرف على فريق عمل موقع TechFix AI ورسالتنا الهادفة إلى إثراء المحتوى التقني العربي وتوفير مراجعات برمجية ممتازة."
        slug="about"
      />

      {/* Hero Header */}
      <section className="text-center space-y-4 max-w-2xl mx-auto py-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-relaxed">
          نحن نوجه غدك الرقمي مع <span className="text-blue-600 dark:text-blue-400">TechFix AI</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-550 dark:text-slate-450 leading-relaxed">
          منصة عربية متكاملة تهدف إلى تعزيز المعارف التكنولوجية، مراجعة أدوات الذكاء الاصطناعي بدقة، وتقديم شروحات في البرمجة والتطوير.
        </p>
      </section>

      {/* Story Bento boxes */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-indigo-500/10 text-indigo-500">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">رؤيتنا التقنية</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed text-justify">
            سد الفجوة بين التقنيات العالمية المعقدة والقارئ العربي، بتهيئة شروحات برمجية خالية من التعقيدات وسهلة التطبيق مباشرة.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-pink-500/10 text-pink-500">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">قيمنا الأساسية</h3>
          <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed text-justify">
            النزاهة الأكاديمية والعملية في تقييم الأدوات الذكية، احترام خصوصية المستخدم، وضمان أمن الأنظمة التقنية المطروحة للشرح.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">أهداف الأرشفة</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed text-justify">
            تحسين تمثيل الكود العربي وسيو المواصفات التقنية لتأهيل الشباب لمستقبل واعد في وظائف التشفير وإدارة الذكاء الاصطناعي.
          </p>
        </div>
      </section>

      {/* Stats Counter Panel */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-around gap-6 text-center select-none shadow-xl">
        <div className="space-y-1">
          <h4 className="text-3xl font-extrabold text-blue-400 font-mono">15K+</h4>
          <p className="text-xs text-slate-450">قارئ تقني شهري</p>
        </div>
        <div className="w-px h-12 bg-slate-800 hidden sm:block" />
        <div className="space-y-1">
          <h4 className="text-3xl font-extrabold text-blue-500 font-mono">4.9/5</h4>
          <p className="text-xs text-slate-450">تقييم موثوقية المقالات</p>
        </div>
        <div className="w-px h-12 bg-slate-800 hidden sm:block" />
        <div className="space-y-1">
          <h4 className="text-3xl font-extrabold text-emerald-500 font-mono">100%</h4>
          <p className="text-xs text-slate-450">محتوى عربي خالي من الميوعة</p>
        </div>
      </section>

      {/* Behind the scenes info */}
      <section className="p-6 bg-white dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">من يدير TechFix AI؟</h2>
        <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed text-justify">
          بُنِيَ هذا الموقع ليكون نموذجاً حياً للمواقع ذات الطلاء التقني والجاهزية العالية للتحقيق المحكم للأرباح من جوجل إيدسنس. نحن نمزج التكنولوجيات العميقة مع فن الكلمات لتوريث المعرفة بسلاسة. يتم مراجعة كل دليل وصورة بشكل مستمر للتأكد من مطابقتها للتحديثات المتسارعة الصادرة عن كبريات شركات التقنية.
        </p>
      </section>
    </div>
  );
}
