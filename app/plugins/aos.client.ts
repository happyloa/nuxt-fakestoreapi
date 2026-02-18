import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  nuxtApp.hooks.hook("app:mounted", () => {
    AOS.init({
      duration: 800,
      easing: "ease-out-quart",
      once: true,
      offset: 60,
      delay: 0,
      disable: "mobile",
    });
  });

  // 路由切換後重新整理 AOS
  nuxtApp.hook("page:finish", () => {
    setTimeout(() => {
      AOS.refresh();
    }, 300);
  });
});
