import React, { useState } from 'react';
import { Mail, Send, CheckCircle, Info, MessageSquare, ShieldCheck } from 'lucide-react';
import SEOHelper from '../components/SEOHelper';

interface ContactViewProps {
  onSubmit: (msg: any) => Promise<void>;
}

export default function ContactView({ onSubmit }: ContactViewProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('كل الحقول مطلوبة لإتمام التواصل.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await onSubmit({
        ...formData,
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء رصد رسالتك. يرجى المحاولة لاحقاً بشكل سليم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* SEO metadata */}
      <SEOHelper 
        title="اتصل بنا - تواصل مع TechFix AI"
        description="لديك سؤال أو ترغب في الإعلان على موقعنا؟ راسلنا مباشرة عبر نموذج الاتصال، وسيرد عليك فريق العمل خلال أقل من 12 ساعة."
        slug="contact"
      />

      <div className="space-y-2 border-r-4 border-indigo-500 pr-4 text-right">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">تواصل معنا</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">نرحب بمراجعات أدوات الذكاء الاصطناعي وبلاغات المشاكل التقنية على مدار الساعة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Fast channels details (4 columns) */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 space-y-3 text-right">
            <h3 className="text-xs font-bold text-gray-400">قنوات التواصل</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-white">
              <MessageSquare className="w-4 h-4 text-brand-blue" />
              <span>المراسلة المباشرة:</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">يرجى ملء النموذج المرفق لإيصال استفساراتكم مباشرة إلى إدارة التحرير لـ TechFix AI.</p>
          </div>

          <div className="p-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-150 dark:border-slate-800 space-y-2 text-right">
            <h4 className="text-xs font-bold text-gray-400">تنظيم الـ AdSense</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>موقعنا مسجل ومحمى ومستعد لطلب الإشارات الإعلانية بنسبة 100%.</span>
            </div>
          </div>
        </div>

        {/* Form panel (8 columns) */}
        <div className="md:col-span-8 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-gray-150 dark:border-slate-850 shadow-sm">
          {success ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">تم استلام رسالتك التقنية بنجاح!</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                سيعمل مهندسو الدعم والتحرير لـ TechFix AI على الرد على استفسارك ومقترحاتك عبر البريد المدخل في أسرع وقت.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-4 py-2 text-xs font-bold bg-brand-blue text-white rounded-xl cursor-pointer"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-100 text-red-600 rounded-lg text-xs leading-relaxed flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300">الاسم الكريم</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: أحمد عبد الله"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300">البريد الإلكتروني للرد</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="مثال: name@domain.com"
                  className="w-full px-3 py-2 text-xs text-left english-ltr rounded-xl border border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300">موضوع الرسالة</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="مثال: طلب رعاية أو مراجعة أداة ذكاء اصطناعي"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300">نص الرسالة والاستعلام</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب تفاصيل استفسارك بوضوح هنا..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/80 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'جاري الإرسال للتأكيد...' : 'إرسال الرسالة الإلكترونية'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
