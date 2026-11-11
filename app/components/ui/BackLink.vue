<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{ to: RouteLocationRaw }>();
</script>

<template>
  <NuxtLink
    :to="to"
    class="meta inline-flex min-h-11 items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-paper"
  >
    <SiteIcon name="back" class="h-3.5 w-3.5" />
    <slot />
  </NuxtLink>
</template>
