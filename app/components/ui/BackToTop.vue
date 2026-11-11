<script setup lang="ts">
const isVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > 300;
};

const scrollToTop = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
};

useWindowEvent("scroll", handleScroll, { passive: true });

onMounted(() => {
  if (import.meta.client) handleScroll();
});
</script>

<template>
  <!-- 由 layouts/default.vue 以 ClientOnly + Teleport 掛載，這裡不需再包一層。 -->
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="inline-flex h-12 w-12 cursor-pointer items-center justify-center border border-slate-900 bg-paper text-slate-900 transition-colors hover:bg-slate-900 hover:text-paper dark:border-paper/70 dark:bg-slate-950 dark:text-paper dark:hover:bg-paper dark:hover:text-slate-950"
      :aria-label="$t('ui.backToTop')"
      @click="scrollToTop">
      <svg
        class="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
