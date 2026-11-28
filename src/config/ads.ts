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

/** A-ADS: وحدة للكمبيوتر (#2463566) ووحدة للجوال (#2463567) — Adaptive، المحجوب NSFW فقط. */
const AADS_DESKTOP = aadsUnit("2463566");
const AADS_MOBILE = aadsUnit("2463567");

export const ADS_CONFIG: Record<AdNetworkId, AdNetworkConfig> = {
  hilltopads: {
    label: "HilltopAds",
    enabled: true,
    slots: {
      top: "",
      // 300x100 zone 7669873, site techfix.wasl-jobs.com
      mobile: hilltop("https://prizefamily.com/b.XPVgsHdeGdlr0oY/W/cM/gelmN9fuUZ/Ujl/kZP/T/cp2JN_jrkg4DN-zJMTtmNfzvYM2NONT_gE3INowj"),
      content: "",
      // 300x250 zone 7669813, site techfix.wasl-jobs.com
      sidebar: hilltop("https://prizefamily.com/b.XMV/sbddG_l/0OYUWyce/Ue_mp9lu/ZQUPlzk/PTTEcf2dNpjekx4cM/ToMFtCNIzJY/2/OLTwgLxvNEww"),
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
