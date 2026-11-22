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
export const adsterraBanner = (key: string, width: number, height: number) =>
  `<script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script src="https://bauval.org/22/${key}"></script>`;

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
    global: [
      // TechFix_Popunder (zone 7649581)
      hilltop("https://enchantingboss.com/cuD.9/6ybx2H5cllSkWwQY9/Nwz/Y-0/OYTvUn4eMdSy0/3kNyj_QB5hN/TNgh1u"),
      // TechFix_InPagePush
      hilltop("https://prizefamily.com/bxX.VRswd-GSly0PYLWncl/reRm/9IufZLUelSkNPST/cc2CNWDlka2ZMGTccJtMNPzVYC0DOzTVYbyTMlQl"),
      // TechFix_VideoSlider
      hilltop("https://prizefamily.com/bPXOVws.doG/ls0cYfWJcH/melmD9bu_ZZU/l/kJPoTHc/2/NuDiks2lMOzjMItfN/zkYp0-OmTQYAzVNcwQ"),
    ].join(""),
  },
  aads: {
    label: "A-ADS",
    enabled: true,
    slots: { top: AADS_DESKTOP, mobile: AADS_MOBILE, content: AADS_DESKTOP, sidebar: AADS_DESKTOP, native: "" },
    global: "",
  },
  adsterra: {
    label: "Adsterra",
    enabled: true,
    slots: {
      top: adsterraBanner("b21e7e05b3b53ec5e9b34f72f51e0086", 728, 90),
      mobile: adsterraBanner("804e4795197f371c8870513c62c05399", 320, 50),
      content: adsterraBanner("917caa5f52f99c2d70333cf30a153a48", 468, 60),
      sidebar: adsterraBanner("99d5aa917e2fe726af79e6c68acc04f8", 300, 250),
      native: `<script async="async" data-cfasync="false" src="https://bauval.org/21/cd85c09a05c5a99bfcf6f9f10decdd7d"></script><div id="container-cd85c09a05c5a99bfcf6f9f10decdd7d"></div>`,
    },
    global: [
      // Social Bar
      `<script data-cfasync="false" src="https://bauval.org/14/a39b06cd9f7fb3f62cb74a0159e8b0a8"></script>`,
      // Popunder
      `<script data-cfasync="false" src="https://abscloud.org/1/93ec7b067e4bb41ecbeef1f5c42fb152"></script>`,
    ].join(""),
  },
};

/** ترتيب ظهور المنصات داخل نفس المكان. */
export const AD_NETWORK_ORDER: AdNetworkId[] = ["adsterra", "hilltopads", "aads"];
