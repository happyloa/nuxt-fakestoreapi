<template>
  <footer class="border-t border-slate-800 bg-slate-950/70">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <p class="font-semibold text-slate-200">
          {{ $t("footer.title") }}
        </p>
        <p class="mt-1 max-w-xl text-xs text-slate-400">
          {{ $t("footer.subtitle") }}
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-3 text-xs">
        <NuxtLink to="/products" class="rounded-full border border-slate-800 px-3 py-1 hover:border-brand hover:text-white">
          {{ $t("navigation.products") }}
        </NuxtLink>
        <NuxtLink to="/products/new" class="rounded-full border border-slate-800 px-3 py-1 hover:border-brand hover:text-white">
          {{ $t("navigation.createProduct") }}
        </NuxtLink>
        <NuxtLink to="/users" class="rounded-full border border-slate-800 px-3 py-1 hover:border-brand hover:text-white">
          {{ $t("navigation.users") }}
        </NuxtLink>
        <a
          href="https://github.com/happyloa/nuxt-fakestoreapi"
          target="_blank"
          rel="noopener"
          class="rounded-full border border-slate-800 px-3 py-1 hover:border-brand hover:text-white"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>
