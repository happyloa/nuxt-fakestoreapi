<script setup lang="ts">
const { t } = useI18n()

const highlights = computed(() => [
  {
    title: t('home.highlights.products'),
    description: t('home.highlights.productsDescription'),
    link: '/products',
    action: t('home.actions.browseProducts'),
  },
  {
    title: t('home.highlights.cart'),
    description: t('home.highlights.cartDescription'),
    link: '/cart',
    action: t('home.actions.manageCart'),
  },
  {
    title: t('home.highlights.users'),
    description: t('home.highlights.usersDescription'),
    link: '/users',
    action: t('home.actions.reviewUsers'),
  },
])
</script>

<template>
  <section class="bg-white py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-3">
        <article v-for="item in highlights" :key="item.title" class="card">
          <h3 class="text-xl font-semibold text-slate-900">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ item.description }}</p>
          <NuxtLink :to="item.link" class="link-button mt-6 w-full justify-center">
            {{ item.action }}
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>
