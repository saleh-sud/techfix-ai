import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-slate-950 border-t border-gray-150 dark:border-slate-850 transition-colors duration-300 py-12 px-4 md:px-8 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8 text-right">
        
        {/* Branding (5 cols space) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2 font-black cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="p-2 rounded-lg bg-brand-cyan text-white shadow-sm">
              <Sparkles className="w-4 h-4 fill-current text-yellow-300" />
            </div>
            <span className="text-lg text-gray-950 dark:text-white font-extrabold">TechFix <span className="text-brand-cyan">AI</span></span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            بوابة عربية رائدة لصقل مهاراتك التقنية، فحص أدوات الذكاء الاصطناعي بدقة، ورسم طريق التحصيل المعقول للأرباح من الإنترنت.
          </p>
        </div>

        {/* Directory Links (3 cols space) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider">الوصول السريع</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('/')} className="text-xs text-gray-650 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan cursor-pointer">
                الصفحة الرئيسية
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/posts')} className="text-xs text-gray-655 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan cursor-pointer">
                أرشيف المقالات
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/categories')} className="text-xs text-gray-655 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan cursor-pointer">
                التصنيفات والقنوات
              </button>
            </li>
          </ul>
        </div>

        {/* Legal and compliance (4 cols space) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider">سياسات وإرشادات</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('/privacy')} className="text-xs text-gray-655 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan cursor-pointer">
                سياسة الخصوصية والكوكيز (AdSense)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/disclaimer')} className="text-xs text-gray-655 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan cursor-pointer">
                إخلاء المسؤولية العلمية
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/contact')} className="text-xs text-gray-655 hover:text-brand-blue dark:text-gray-400 dark:hover:text-brand-cyan cursor-pointer">
                أرسل مقترح رعاية وإعلانات
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright area */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-150 dark:border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-[11px] text-gray-400">
        <p>© {currentYear} جميع الحقوق محفوظة لـ TechFix AI. مهيأ كلياً للسيو والأرشفة.</p>
        <p className="flex items-center gap-1.5 justify-center md:justify-end text-xs font-bold text-gray-500 dark:text-gray-400">
          Made with 🖤 by <span className="text-gray-800 dark:text-white font-extrabold hover:text-brand-cyan transition-colors">Hadi Saleh</span>
        </p>
      </div>
    </footer>
  );
}
