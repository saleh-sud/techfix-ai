import { useEffect } from "react";
import { AD_NETWORK_ORDER, ADS_CONFIG } from "../config/ads";

/** يحمّل مرة واحدة الأكواد العامة (Popunder / Social Bar ...) للمنصات المفعّلة. */
export default function GlobalAds() {
  useEffect(() => {
    const nodes: HTMLElement[] = [];
    AD_NETWORK_ORDER.forEach((id) => {
      const cfg = ADS_CONFIG[id];
      if (!cfg.enabled || !cfg.global.trim()) return;
      const holder = document.createElement("div");
      holder.setAttribute("data-ad-global", id);
      // createContextualFragment ينفّذ وسوم <script> (innerHTML لا ينفّذها)
      holder.appendChild(document.createRange().createContextualFragment(cfg.global));
      document.body.appendChild(holder);
      nodes.push(holder);
    });
    return () => nodes.forEach((n) => n.remove());
  }, []);
  return null;
}
