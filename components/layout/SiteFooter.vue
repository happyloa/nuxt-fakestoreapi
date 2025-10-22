<script setup lang="ts">
const links = [
  {
    title: 'API',
    items: [
      { label: 'Fake Store API', href: 'https://fakestoreapi.com' },
      { label: 'API Reference', href: 'https://fakestoreapi.com/docs' },
    ],
  },
  {
    title: 'Project',
    items: [
      { label: 'Source Code', href: 'https://github.com/keikaavousi/fake-store-api' },
      { label: 'Nuxt Documentation', href: 'https://nuxt.com/docs' },
    ],
  },
]
</script>

<template>
  <footer class="mt-16 border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('footer.title') }}</h3>
          <p class="mt-2 text-sm text-slate-600">
            {{ $t('footer.description') }}
          </p>
        </div>
        <div
          v-for="section in links"
          :key="section.title"
          class="space-y-3"
        >
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {{ section.title }}
          </h4>
          <ul class="space-y-1 text-sm text-slate-600">
            <li v-for="item in section.items" :key="item.href">
              <a
                :href="item.href"
                target="_blank"
                rel="noopener"
                class="transition hover:text-brand"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
        <div class="flex gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener" class="hover:text-brand">Twitter</a>
          <a href="https://github.com" target="_blank" rel="noopener" class="hover:text-brand">GitHub</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener" class="hover:text-brand">LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
</template>
