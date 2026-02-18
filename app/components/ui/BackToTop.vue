<script setup lang="ts">
const isVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  if (!import.meta.client) return;
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <ClientOnly>
    <Transition name="back-to-top">
      <button
        v-if="isVisible"
        type="button"
        class="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-200/60 bg-white/80 text-slate-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-brand/30 hover:text-brand hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-slate-600/60 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:border-brand-light/30 dark:hover:text-brand-light dark:focus-visible:ring-offset-slate-900"
        :aria-label="$t('ui.backToTop') || 'Back to top'"
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
  </ClientOnly>
</template>

<style scoped>
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.8);
}
</style>
