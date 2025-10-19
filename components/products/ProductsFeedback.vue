<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  message: string
}>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="props.visible"
      class="mt-6 rounded-3xl border border-primary-200 bg-primary-50 px-6 py-4 text-sm font-semibold text-primary-700 shadow-sm"
      role="status"
      aria-live="assertive"
    >
      {{ props.message }}
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
