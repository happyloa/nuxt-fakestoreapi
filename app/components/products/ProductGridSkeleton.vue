<script setup lang="ts">
const props = defineProps<{ count?: number }>();

const skeletonCount = computed(() => props.count ?? 6);

/**
 * 商品列表載入時的骨架畫面，提升使用者對於資料狀態的感知。
 */
</script>

<template>
  <ul
    class="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
    aria-live="polite"
  >
    <li v-for="index in skeletonCount" :key="index">
      <div class="space-y-4">
        <BaseSkeleton height="auto" class="aspect-square" rounded="xl" />
        <BaseSkeleton width="75%" />
        <BaseSkeleton width="50%" height="0.75rem" />
        <div class="flex gap-2">
          <BaseSkeleton width="4rem" height="1.5rem" rounded="full" />
          <BaseSkeleton width="5rem" height="1.5rem" rounded="full" />
        </div>
      </div>
    </li>
  </ul>
</template>
