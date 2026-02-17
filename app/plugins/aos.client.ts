import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  nuxtApp.hooks.hook("app:mounted", () => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
      delay: 0,
    });
  });

  // 路由切換後重新整理 AOS
  nuxtApp.hook("page:finish", () => {
    setTimeout(() => {
      AOS.refresh();
    }, 300);
  });
});
