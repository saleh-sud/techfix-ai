import { AD_NETWORK_ORDER, ADS_CONFIG, AdNetworkId, AdSlotName } from "../config/ads";
import { useInteracted } from "../lib/interaction";
import { useLang } from "../lib/lang";

interface AdSpaceProps {
  type: AdSlotName;
}

const SIZE: Record<AdSlotName, { w: number; h: number }> = {
  top: { w: 728, h: 90 },
  mobile: { w: 320, h: 100 },
  content: { w: 468, h: 60 },
  sidebar: { w: 300, h: 250 },
  native: { w: 1000, h: 320 },
};

const srcDoc = (code: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent;text-align:center}</style></head><body>${code}</body></html>`;

/** مكان إعلان واحد: يحجز المساحة مسبقاً (بدون اهتزاز للصفحة) ويحمّل الإعلانات بعد أول تفاعل. */
function Slot({ type, className = "", only }: { type: AdSlotName; className?: string; only?: AdNetworkId }) {
  const ready = useInteracted();
  const { t } = useLang();
  const { w, h } = SIZE[type];
  const fluid = type === "native";
  const ids = AD_NETWORK_ORDER.filter((id) => (!only || id === only) && ADS_CONFIG[id].enabled && ADS_CONFIG[id].slots[type].trim());
  if (!ids.length) return null;
  return (
    <div className={`my-4 flex-col items-center gap-3 ${className}`} aria-label={t("إعلان", "Advertisement")} role="complementary">
      {ids.map((id) =>
        ready ? (
          <iframe
            key={id}
            title={`${t("إعلان", "Ad")} ${ADS_CONFIG[id].label}`}
            loading="lazy"
            scrolling="no"
            width={fluid ? "100%" : w}
            height={h}
            style={{ border: 0, maxWidth: fluid ? w : "100%", width: fluid ? "100%" : undefined }}
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            srcDoc={srcDoc(ADS_CONFIG[id].slots[type])}
          />
        ) : (
          <div key={id} style={{ width: fluid ? "100%" : w, maxWidth: fluid ? w : "100%", height: h }} />
        )
      )}
    </div>
  );
}

/**
 * مكوّن إعلانات واحد لكل المنصات (HilltopAds / A-ADS). كل إعلان داخل iframe معزول (sandbox).
 * البانر العلوي: 728×90 على الشاشات الكبيرة وبانر الجوال على الصغيرة (عبر CSS حتى يتطابق مع الـ SSR).
 */
export default function AdSpace({ type }: AdSpaceProps) {
  if (type === "top")
    return (
      <>
        <Slot type="top" className="hidden md:flex" />
        <Slot type="mobile" className="flex md:hidden" />
      </>
    );
  return <Slot type={type} className="flex" />;
}

/** HilltopAds banner on every page (A-ADS is already static in index.html). Hidden when printing. */
export function SiteAd() {
  return <Slot type="sidebar" only="hilltopads" className="flex print:hidden" />;
}
