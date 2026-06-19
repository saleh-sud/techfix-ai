import SEOHelper from '../components/SEOHelper';

export default function PrivacyView() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SEOHelper 
        title="سياسة الخصوصية - TechFix AI"
        description="سياسة خصوصية موقع TechFix AI المنظمة لملفات الارتباط الكوكيز لـ Google AdSense والتحصيل الآمن للبيانات."
        slug="privacy"
      />

      <div className="space-y-2 border-r-4 border-brand-cyan pr-4">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">سياسة الخصوصية وتأمين البيانات</h1>
        <p className="text-xs text-gray-400">آخر تحديث: 31 مايو 2026</p>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-2xl border border-gray-150 dark:border-slate-850 space-y-6 leading-relaxed text-xs md:text-sm text-gray-700 dark:text-gray-300">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-950 dark:text-white">1. جمع وإدارة البيانات الشخصية</h2>
          <p className="text-justify">
            في موقع **TechFix AI**، نلتزم بحماية خصوصية زوارنا بشكل كامل. نحن لا نطلب أي معلومات شخصية لغالبية الخدمات، إلا عند رغبتك بالتمثيل طوعاً في النشرات الإعلانية، أو كتابة رسالة من خلال نموذج الاتصال بنا.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-950 dark:text-white">2. ملفات تعريف الارتباط (Cookies) وجوجل أدسنس</h2>
          <p className="text-justify">
            نحن نستعين بـ **Google AdSense** وشركائنا الإعلانيين لعرض الإعلانات عند زيارتكم لموقعنا. تستخدم جوجل ملفات تعريف الارتباط (مثل ملف تعريف الارتباط DART) لعرض إعلانات للمستخدمين استنادًا إلى زياراتهم لموقعنا وغيره من المواقع على شبكة الإنترنت. يمكن للمستخدمين اختيار تعطيل استخدام DART عبر زيارة سياسة خصوصية شبكة إعلانات جوجل ومحتواها.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-950 dark:text-white">3. ملفات سجلات الأنظمة (Log Files)</h2>
          <p className="text-justify">
            شأنها شأن جميع المواقع الأخرى، نستخدم ملفات السجلات في رصد حركة وتوجيه صفحات الويب. يتضمن ذلك معرفات بروتوكول الإنترنت (IP)، ونوع المتصفح الخاص ببيئة الزائر، ومزود خدمات الإنترنت (ISP)، والوقت والتاريخ ومعدل التنقل. نؤكد أن هذه البيانات ليست مرتبطة بأي شكل من الأشكال لتعريف هويتك الشخصية، وتستخدم بالقصور في رصد السيو وتحسين تجربة التحميل.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-950 dark:text-white">4. الالتزام بقواعد حماية البيانات العامة (GDPR)</h2>
          <p className="text-justify">
            إذا كنت من سكان المنطقة الاقتصادية الأوروبية (EEA)، يخول لك القانون العام لحماية البيانات كافة الحقوق في تعديل بياناتك المودعة للاشتراك، أو طلب حذف أرشيف تواصلك فورياً، وذلك بمجرد مخاطبتنا رسمياً عبر البريد المصلحي.
          </p>
        </section>
      </div>
    </div>
  );
}
