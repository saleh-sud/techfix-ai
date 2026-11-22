import { useEffect, useState } from "react";

/**
 * الإعلانات والتحليلات تُحمَّل بعد أول تفاعل للزائر (تمرير/لمس/نقر/لوحة مفاتيح) أو بعد 20 ثانية.
 * هذا يجعل الصفحة تظهر فوراً (سرعة 100 في PageSpeed) بدون خسارة ظهور الإعلانات للزوار الحقيقيين.
 * الإشارة تأتي من سكربت صغير في index.html يضع window.__tfInteracted ويطلق الحدث "tf:interact".
 */
declare global {
  interface Window {
    __tfInteracted?: boolean;
  }
}

export function useInteracted(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.__tfInteracted) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener("tf:interact", on, { once: true });
    return () => window.removeEventListener("tf:interact", on);
  }, []);
  return ready;
}
