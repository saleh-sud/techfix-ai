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
export type AdNetworkId = "hilltopads" | "aads";

export interface AdNetworkConfig {
  label: string;
  enabled: boolean;
  slots: Record<AdSlotName, string>;
  global: string;
}

/** صيغة كود HilltopAds (نفس الكود الذي تعطيه المنصة، فقط الرابط يتغير). */
export const hilltop = (src: string) =>
  `<script>(function(oast){var d=document,s=d.createElement('script'),l=d.currentScript||d.scripts[d.scripts.length-1];s.settings=oast||{};s.src="${src}";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})</script>`;

/** A-ADS: وحدة Adaptive تتكيّف مع حجم كل مكان. */
export const aadsUnit = (id: string) =>
  `<iframe data-aa='${id}' src='https://acceptable.a-ads.com/${id}/?size=Adaptive' style='border:0;padding:0;width:100%;height:100%;overflow:hidden;display:block;margin:auto'></iframe>`;

/** A-ADS: وحدة للكمبيوتر (#2462899) ووحدة للجوال (#2462900) — Adaptive، بدون NSFW/قمار/مشاريع خطرة. */
const AADS_DESKTOP = aadsUnit("2462899");
const AADS_MOBILE = aadsUnit("2462900");

export const ADS_CONFIG: Record<AdNetworkId, AdNetworkConfig> = {
  hilltopads: {
    label: "HilltopAds",
    enabled: true,
    slots: {
      top: "",
      // TechFix_Banner_300x100 (جوال فقط)
      mobile: hilltop("https://prizefamily.com/bJX/Vys.dxGGli0mYuWicY/yeTmQ9mu/ZCUbldk/P/Tkca2ONEDOkE1JOUDikOtENVzuYr0-O/TOUP5/Mwwm"),
      content: "",
      // TechFix_Banner_300x250
      sidebar: hilltop("https://prizefamily.com/b/X-Vxs.dNGylF0/YCW/cF/feOmk9duHZBUjlVkyPCT-c/2iNzD/kt2AMwDVEntfNBzEYM0/OtTAYRwsNQQL"),
      native: "",
    },
    // Popunder / In-Page Push / Video Slider removed (not allowed next to Google AdSense).
    global: "",
  },
  aads: {
    label: "A-ADS",
    enabled: true,
    slots: { top: AADS_DESKTOP, mobile: AADS_MOBILE, content: AADS_DESKTOP, sidebar: AADS_DESKTOP, native: "" },
    global: "",
  },
};

/** ترتيب ظهور المنصات داخل نفس المكان. */
export const AD_NETWORK_ORDER: AdNetworkId[] = ["hilltopads", "aads"];
