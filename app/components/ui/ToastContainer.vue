<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useNotificationsStore } from "~/stores/notifications";

const notifications = useNotificationsStore();
const { toasts } = storeToRefs(notifications);

const variantClasses: Record<string, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100",
  info: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-100",
  error:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-100",
};
</script>

<template>
  <teleport to="body">
    <transition-group
      name="toast"
      tag="div"
      class="fixed top-6 right-6 z-[60] flex max-w-sm flex-col gap-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/5 backdrop-blur"
        :class="variantClasses[toast.variant]">
        <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
        <button
          class="rounded-full p-1 text-xs text-current transition hover:bg-black/10 dark:hover:bg-white/10"
          :aria-label="$t('ui.dismiss')"
          @click="notifications.remove(toast.id)">
          ✕
        </button>
      </div>
    </transition-group>
  </teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(80px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
