<script setup lang="ts">
import type { NuxtError } from "#app";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  error: NuxtError;
}>();

const { t } = useI18n();

const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16 dark:bg-slate-950 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-md text-center">
      <div class="mb-8 flex justify-center">
        <div
          class="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            class="h-12 w-12 text-red-600 dark:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <h1
        class="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        {{
          error.statusCode === 404
            ? t("error.title404")
            : t("error.titleGeneric")
        }}
      </h1>
      <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
        {{
          error.statusCode === 404
            ? t("error.desc404")
            : error.message || t("error.descGeneric")
        }}
      </p>

      <div class="mt-10 flex items-center justify-center gap-x-6">
        <BaseButton @click="handleError" size="lg">
          {{ t("error.backToHome") }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
