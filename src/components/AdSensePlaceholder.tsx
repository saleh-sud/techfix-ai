import { Landmark } from 'lucide-react';

interface AdProps {
  type?: 'banner' | 'rectangle' | 'native';
  slotId?: string;
}

export default function AdSensePlaceholder({ type = 'banner', slotId = 'default-ad-slot' }: AdProps) {
  return (
    <div className="my-6 mx-auto w-full transition-all duration-300">
      {type === 'banner' && (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 p-4 text-center max-w-4xl mx-auto min-h-[90px] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Landmark className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-amber-500 tracking-wider">مساحة إعلانية متجاوبة (AdSense)</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">منطقة مخصصة للوحات الإعلانات الأفقية الذكية (Leaderboard 728x90)</p>
            </div>
          </div>
          <div className="text-[9px] font-mono text-gray-400 bg-gray-200/50 dark:bg-slate-800 p-1.5 rounded border border-gray-200 dark:border-slate-700">
            Ad Slot ID: {slotId}
          </div>
        </div>
      )}

      {type === 'rectangle' && (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-300 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 p-6 text-center min-h-[250px] flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
            <Landmark className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-amber-500 tracking-wider">مساحة إعلانية مستطيلة</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">AdSense Medium Rectangle (300x250)</p>
          </div>
          <div className="text-[9px] font-mono text-gray-400 bg-gray-200/50 dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-700 mt-2">
            ID: {slotId}
          </div>
        </div>
      )}

      {type === 'native' && (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900/40 bg-gradient-to-tr from-indigo-50/20 to-emerald-50/20 dark:from-slate-900/20 dark:to-slate-900/40 p-4 min-h-[110px] flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
            <Landmark className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase">إعلان مدفوع</span>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">إعلان محتوى مدمج (Native Feed Ad)</p>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed truncate">انضم إلى أداة سيو روبوت لفلترة المقالات وأرشفة التنسيقات في ثوانٍ معدودة بكود ذكي.</p>
          </div>
          <div className="text-[9px] font-mono text-gray-400 shrink-0 hidden sm:block">
            Slot: {slotId}
          </div>
        </div>
      )}
    </div>
  );
}
