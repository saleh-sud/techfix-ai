/**
 * إعدادات الإعلانات – الملف الوحيد الذي تعدّله لتشغيل/إيقاف المنصات ولصق أكوادها.
 *
 * - enabled: true/false لتشغيل المنصة أو إيقافها بالكامل.
 * - slots:   كود الإعلان (HTML/JS كما تعطيك المنصة) لكل مكان. فارغ "" => لا شيء في هذا المكان.
 * - global:  أكواد تُحمَّل مرة واحدة في كل الصفحات (Popunder / Social Bar / In-Page Push / Video Slider).
 *
 * أماكن الإعلان:
 *   top     بانر علوي 728×90 (الشاشات الكبيرة) — أعلى كل صفحة
 *   mobile  بانر الجوال (يحلّ مكان top تلقائياً على الشاشات الصغيرة)
 *   content وسط المحتوى 468×60 — داخل المقال وبين بطاقات القوائم
 *   sidebar جانبي 300×250
 *   native  إعلان Native بعرض المحتوى — أسفل المقال وفي قائمة المقالات
 *
 * كل المنصات مضبوطة على "بدون إعلانات للبالغين".
 */
export type AdSlotName = "top" | "mobile" | "content" | "sidebar" | "native";
export type AdNetworkId = "hilltopads" | "aads" | "adsterra";

export interface AdNetworkConfig {
  label: string;
  enabled: boolean;
  slots: Record<AdSlotName, string>;
  global: string;
}

/** صيغة كود HilltopAds (نفس الكود الذي تعطيه المنصة، فقط الرابط يتغير). */
export const hilltop = (src: string) =>
  `<script>(function(oast){var d=document,s=d.createElement('script'),l=d.currentScript||d.scripts[d.scripts.length-1];s.settings=oast||{};s.src="${src}";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})</script>`;

/** صيغة كود Adsterra Banner (iframe). */
export const adsterraBanner = (host: string, key: string, width: number, height: number) =>
  `<script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script src="https://${host}/${key}/invoke.js"></script>`;

/** A-ADS: وحدة Adaptive تتكيّف مع حجم كل مكان. */
export const aadsUnit = (id: string) =>
  `<iframe data-aa='${id}' src='https://acceptable.a-ads.com/${id}/?size=Adaptive' style='border:0;padding:0;width:100%;height:100%;overflow:hidden;display:block;margin:auto'></iframe>`;

const EMPTY: Record<AdSlotName, string> = { top: "", mobile: "", content: "", sidebar: "", native: "" };

export const ADS_CONFIG: Record<AdNetworkId, AdNetworkConfig> = {
  hilltopads: { label: "HilltopAds", enabled: true, slots: { ...EMPTY }, global: "" },
  aads: { label: "A-ADS", enabled: true, slots: { ...EMPTY }, global: "" },
  adsterra: { label: "Adsterra", enabled: true, slots: { ...EMPTY }, global: "" },
};

/** ترتيب ظهور المنصات داخل نفس المكان. */
export const AD_NETWORK_ORDER: AdNetworkId[] = ["adsterra", "hilltopads", "aads"];
