<script setup lang="ts">
const localePath = useLocalePath();
const year = useState("footerYear", () => new Date().getFullYear());
</script>
<template>
  <footer
    class="mt-16 border-t border-slate-200 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40"
  >
    <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div class="grid gap-8 sm:grid-cols-[1fr_auto_auto] sm:gap-14">
        <div>
          <NuxtLink
            :to="localePath('/')"
            class="text-xl font-extrabold tracking-tight"
            >Storefront<span class="ml-1 text-brand dark:text-brand-light"
              >lab</span
            ></NuxtLink
          >
          <p
            class="mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400"
          >
            {{ $t("footer.description") }}
          </p>
        </div>
        <div>
          <h2 class="mb-3 text-sm font-bold">
            {{ $t("footer.sections.shop") }}
          </h2>
          <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <NuxtLink
                :to="localePath('/')"
                class="hover:text-brand dark:hover:text-brand-light"
                >{{ $t("navigation.products") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="localePath('/cart')"
                class="hover:text-brand dark:hover:text-brand-light"
                >{{ $t("navigation.cart") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="localePath('/api')"
                class="hover:text-brand dark:hover:text-brand-light"
                >{{ $t("navigation.apiPlayground") }}</NuxtLink
              >
            </li>
          </ul>
        </div>
        <div>
          <h2 class="mb-3 text-sm font-bold">
            {{ $t("footer.sections.project") }}
          </h2>
          <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a
                href="https://github.com/happyloa/nuxt-fakestoreapi"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-brand dark:hover:text-brand-light"
                >{{ $t("footer.links.sourceCode") }}</a
              >
            </li>
            <li>
              <a
                href="https://fakestoreapi.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-brand dark:hover:text-brand-light"
                >Fake Store API</a
              >
            </li>
            <li>
              <a
                href="https://nuxt.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-brand dark:hover:text-brand-light"
                >Nuxt</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        class="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500 sm:flex-row sm:justify-between dark:border-slate-800 dark:text-slate-400"
      >
        <p>{{ $t("footer.copyright", { year }) }}</p>
        <p>{{ $t("footer.demoNotice") }}</p>
      </div>
    </div>
  </footer>
</template>
