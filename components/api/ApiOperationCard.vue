<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  successMessage: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <BaseCard class="space-y-6">
    <BaseSectionHeading :title="props.title" :description="props.description" />
    <div class="space-y-4">
      <slot />
    </div>
    <div v-if="props.loading" class="pt-2">
      <BaseLoader />
    </div>
    <BaseAlert v-if="props.error" variant="error">
      {{ props.error }}
    </BaseAlert>
    <BaseAlert v-else-if="props.successMessage" variant="success">
      {{ props.successMessage }}
    </BaseAlert>
    <slot name="footer" />
  </BaseCard>
</template>
