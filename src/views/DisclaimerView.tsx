import SEOHelper from '../components/SEOHelper';

export default function DisclaimerView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SEOHelper 
        title="إخلاء المسؤولية - TechFix AI"
        description="إخلاء مسؤولية موقع TechFix AI بخصوص دقة الشروحات البرمجية والاستخدام غير المعتمد للأكواد وأدوات الذكاء الاصطناعي."
        slug="disclaimer"
      />

      <div className="space-y-2 border-r-4 border-brand-cyan pr-4">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">إخلاء المسؤولية القانونية والمعماري</h1>
        <p className="text-xs text-gray-400">آخر تحديث: 31 مايو 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-2xl border border-gray-150 dark:border-slate-850 space-y-6 leading-relaxed text-xs md:text-sm text-gray-700 dark:text-gray-300">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-950 dark:text-white">1. الاستهلاك الإرشادي العام للمحتوى</h2>
          <p className="text-justify">
            كافة المعلومات والشروحات المتواجدة على بوابتنا الرقمية **TechFix AI** منشورة بحسن نية ولأهداف إرشادية وتثقيفية عامة فقط. لا يتحمل الموقع أو فريق كتابته أي كفالة بخصوص كمال أو موثوقية أو دقة الأكواد أو تعليمات الفلترة البرمجية المطروحة. أي خطوة تتخذها بالاسترشاد بالمعلومات الواردة على عاتقك ومسؤوليتك الفئوية التامة.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-950 dark:text-white">2. الروابط الخارجية وشركاء الرعاية</h2>
          <p className="text-justify">
            قد يحتوي الموقع على روابط تؤدي إلى مواقع تقنية ومكاتب برمجية خارجية لا تقع تحت سلطتنا الإدارية. نحن نهدف لرصد وتجميع روابط المواقع الأخلاقية والمفيدة، ولكننا لا نملك أي سيطرة على طبيعة محتواها وتحديثاتها الطارئة، وقد تتغير الروابط قبل أن نتمكن من تعديلها في بوابتنا.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-950 dark:text-white">3. الاستخدام المهني والبرمجي</h2>
          <p className="text-justify">
            برغم دلة الشروحات المقدمة وكفاءة الكود المولد من الذكاء الاصطناعي، يوصى دائماً باختبار التعليمات وتثبيتها في بيئة اختبار افتراضية (Sandbox) قبل إلحاقها بيئات التشغيل والإنتاج الفعلية لتلافي أي تعطل للسيرفرات أو خسائر مالية.
          </p>
        </section>
      </div>
    </div>
  );
}
