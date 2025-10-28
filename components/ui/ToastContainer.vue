<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '~/stores/notifications'

const notifications = useNotificationsStore()
const { toasts } = storeToRefs(notifications)

const variantClasses: Record<string, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
}
</script>

<template>
  <teleport to="body">
    <transition-group
      name="toast"
      tag="div"
      class="fixed top-6 right-6 z-[60] flex max-w-sm flex-col gap-3"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/5 backdrop-blur"
        :class="variantClasses[toast.variant]"
      >
        <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
        <button
          class="rounded-full p-1 text-xs text-current transition hover:bg-black/10"
          :aria-label="$t('ui.dismiss')"
          @click="notifications.remove(toast.id)"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
