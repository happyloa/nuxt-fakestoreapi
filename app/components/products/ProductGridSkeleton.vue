<script setup lang="ts">
const props = defineProps<{ count?: number }>();

const skeletonCount = computed(() => props.count ?? 6);

/**
 * 商品列表載入時的骨架畫面，提升使用者對於資料狀態的感知。
 */
</script>

<template>
  <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
    <li v-for="index in skeletonCount" :key="index">
      <BaseCard class="space-y-4">
        <BaseSkeleton height="12rem" rounded="xl" />
        <BaseSkeleton width="75%" />
        <BaseSkeleton width="50%" height="0.75rem" />
        <div class="flex gap-2">
          <BaseSkeleton width="4rem" height="1.5rem" rounded="full" />
          <BaseSkeleton width="5rem" height="1.5rem" rounded="full" />
        </div>
      </BaseCard>
    </li>
  </ul>
</template>
