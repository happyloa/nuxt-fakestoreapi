<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  loading?: boolean;
  error?: string;
  successMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  loading: false,
  error: "",
  successMessage: "",
});
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
