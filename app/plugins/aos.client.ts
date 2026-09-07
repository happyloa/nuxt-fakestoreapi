import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  // 最佳實踐：等待整個應用的 Suspense 與非同步元件完全掛載、Hydration 完成後，才讓 AOS 介入 DOM
  // 以免 AOS 提早插入 "aos-init" class 而導致 Vue Hydration mismatch
  nuxtApp.hook("app:mounted", () => {
    // 尊重「減少動態」偏好：直接停用 AOS 進場動畫
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    AOS.init({
      duration: 800,
      easing: "ease-out-quart",
      once: true,
      offset: 60,
      delay: 0,
      disable: prefersReducedMotion,
    });
  });

  // 路由切換後重新整理 AOS
  nuxtApp.hook("page:finish", async () => {
    await nextTick();
    AOS.refreshHard();
  });
});
