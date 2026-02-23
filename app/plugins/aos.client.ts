import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  // 最佳實踐：等待整個應用的 Suspense 與非同步元件完全掛載、Hydration 完成後，才讓 AOS 介入 DOM
  // 以免 AOS 提早插入 "aos-init" class 而導致 Vue Hydration mismatch
  nuxtApp.hook("app:suspense:resolve", () => {
    AOS.init({
      duration: 800,
      easing: "ease-out-quart",
      once: true,
      offset: 60,
      delay: 0,
    });
  });

  // 作為沒有 Suspense 情況下的備用防護，給予充足的延遲
  nuxtApp.hook("app:mounted", () => {
    setTimeout(() => {
      AOS.refreshHard(); // 強制重新掃描
    }, 500);
  });

  // 路由切換後重新整理 AOS
  nuxtApp.hook("page:finish", () => {
    setTimeout(() => {
      AOS.refreshHard();
    }, 300);
  });
});
