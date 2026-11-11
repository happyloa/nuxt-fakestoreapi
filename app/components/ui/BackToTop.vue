<script setup lang="ts">
const isVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > 300;
};

// 按鈕捲到頂端後會隱藏，先把焦點移到主要內容，鍵盤使用者才不會落回文件尾端。
const scrollToTop = () => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("main-content")?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
};

useWindowEvent("scroll", handleScroll, { passive: true });
onMounted(handleScroll);
</script>

<template>
  <!-- 由 layouts/default.vue 以 ClientOnly + Teleport 掛載。 -->
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      type="button"
      class="inline-flex h-12 w-12 cursor-pointer items-center justify-center border border-slate-900 bg-paper text-slate-900 transition-colors hover:bg-slate-900 hover:text-paper dark:border-paper/70 dark:bg-slate-950 dark:text-paper dark:hover:bg-paper dark:hover:text-slate-950"
      :aria-label="$t('ui.backToTop')"
      @click="scrollToTop">
      <SiteIcon name="up" class="h-5 w-5" />
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
