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
    class="relative mt-16 border-t border-slate-200/60 bg-white transition-colors duration-300 dark:border-slate-800/60 dark:bg-slate-950"
    data-aos="fade-up"
    data-aos-offset="0"
    data-aos-delay="0">
    <!-- 頂部漸層裝飾線 -->
    <div
      class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
    <div
      class="mx-auto max-w-7xl px-4 py-12 text-slate-600 sm:px-6 lg:px-8 xl:px-10 dark:text-slate-300">
      <div class="grid gap-10 md:grid-cols-3">
        <div>
          <h3
            class="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-xs font-bold text-white shadow-md shadow-brand/20"
              >FS</span
            >
            {{ $t("footer.title") }}
          </h3>
          <p
            class="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {{ $t("footer.description") }}
          </p>
        </div>
        <div v-for="section in links" :key="section.title" class="space-y-4">
          <h4
            class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {{ section.title }}
          </h4>
          <ul class="space-y-2 text-sm">
            <li v-for="item in section.items" :key="item.href">
              <a
                :href="item.href"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1.5 transition-all duration-200 hover:text-brand hover:translate-x-0.5 dark:hover:text-brand-light">
                {{ item.label }}
                <svg
                  class="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="mt-12 flex flex-col gap-5 border-t border-slate-200/60 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/60 dark:text-slate-500">
        <p>
          {{ $t("footer.copyright", { year: new Date().getFullYear() }) }}
        </p>
        <div class="flex gap-5">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            class="transition-all duration-200 hover:text-brand hover:scale-110 dark:hover:text-brand-light"
            >Twitter</a
          >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener"
            class="transition-all duration-200 hover:text-brand hover:scale-110 dark:hover:text-brand-light"
            >GitHub</a
          >
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener"
            class="transition-all duration-200 hover:text-brand hover:scale-110 dark:hover:text-brand-light"
            >LinkedIn</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
