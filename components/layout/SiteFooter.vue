<script setup lang="ts">
const links = [
  {
    title: "API",
    items: [
      { label: "Fake Store API", href: "https://fakestoreapi.com" },
      { label: "API Reference", href: "https://fakestoreapi.com/docs" },
    ],
  },
  {
    title: "Project",
    items: [
      {
        label: "Source Code",
        href: "https://github.com/happyloa/nuxt-fakestoreapi",
      },
      { label: "Nuxt Documentation", href: "https://nuxt.com/docs" },
    ],
  },
];
</script>

<template>
  <footer
    class="mt-16 border-t border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950">
    <div
      class="mx-auto max-w-7xl px-4 py-10 text-slate-600 sm:px-6 lg:px-8 xl:px-10 dark:text-slate-300">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ $t("footer.title") }}
          </h3>
          <p class="mt-2 text-sm text-inherit">
            {{ $t("footer.description") }}
          </p>
        </div>
        <div v-for="section in links" :key="section.title" class="space-y-3">
          <h4
            class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {{ section.title }}
          </h4>
          <ul class="space-y-1 text-sm text-inherit">
            <li v-for="item in section.items" :key="item.href">
              <a
                :href="item.href"
                target="_blank"
                rel="noopener"
                class="transition hover:text-brand dark:hover:text-brand-light">
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
        <p class="text-inherit">
          {{ $t("footer.copyright", { year: new Date().getFullYear() }) }}
        </p>
        <div class="flex gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            class="hover:text-brand dark:hover:text-brand-light"
            >Twitter</a
          >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            class="hover:text-brand dark:hover:text-brand-light"
            >GitHub</a
          >
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener"
            class="hover:text-brand dark:hover:text-brand-light"
            >LinkedIn</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
