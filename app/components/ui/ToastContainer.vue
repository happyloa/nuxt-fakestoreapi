<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Toast } from "~/stores/notifications";

const notifications = useNotificationsStore();
const { toasts } = storeToRefs(notifications);

// 收據式通知，左側色條區分類型；深色模式下底色變淺，色條改用深色調維持對比。
const variantClasses: Record<Toast["variant"], string> = {
  success: "border-emerald-400 dark:border-emerald-700",
  info: "border-slate-400 dark:border-slate-500",
  error: "border-brand-light dark:border-brand",
};

// 焦點離開整個通知區時才恢復計時。
const onFocusOut = (event: FocusEvent) => {
  const container = event.currentTarget as HTMLElement;
  if (!container.contains(event.relatedTarget as Node | null)) notifications.resume();
};
</script>

<template>
  <teleport to="body">
    <!-- 外層容器是 polite 即時區域，個別 toast 不再重複宣告角色。 -->
    <transition-group
      name="toast"
      tag="div"
      role="status"
      aria-live="polite"
      aria-atomic="false"
      class="fixed left-4 right-4 top-20 z-[60] flex flex-col gap-2 sm:left-auto sm:w-96"
      @mouseenter="notifications.pause"
      @mouseleave="notifications.resume"
      @focusin="notifications.pause"
      @focusout="onFocusOut">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-start gap-3 border-l-2 bg-slate-900 px-4 py-3 text-paper dark:bg-paper dark:text-slate-950"
        :class="variantClasses[toast.variant]">
        <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
        <button
          type="button"
          class="-my-1 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center opacity-70 transition-opacity hover:opacity-100"
          :aria-label="$t('ui.dismiss')"
          @click="notifications.remove(toast.id)">
          <SiteIcon name="close" class="h-4 w-4" />
        </button>
      </div>
    </transition-group>
  </teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.toast-move {
  transition: transform 0.2s ease;
}
</style>
