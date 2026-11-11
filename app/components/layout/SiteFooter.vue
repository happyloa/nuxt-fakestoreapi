<script setup lang="ts">
const localePath = useLocalePath();
const year = useState("footerYear", () => new Date().getFullYear());
const linkClass =
  "text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 dark:text-slate-400 dark:hover:text-paper";
</script>
<template>
  <footer class="mt-24 border-t border-rule dark:border-rule-dark">
    <div class="@container mx-auto max-w-7xl overflow-hidden px-5 pt-12 sm:px-8 lg:px-10">
      <div class="grid gap-10 sm:grid-cols-[1fr_auto_auto] sm:gap-16">
        <p
          class="max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400"
        >
          {{ $t("footer.description") }}
        </p>
        <div>
          <h2 class="meta mb-4 text-slate-500 dark:text-slate-400">
            {{ $t("footer.sections.shop") }}
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li>
              <NuxtLink :to="localePath('/')" :class="linkClass">{{
                $t("navigation.products")
              }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/cart')" :class="linkClass">{{
                $t("navigation.cart")
              }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/api')" :class="linkClass">{{
                $t("navigation.apiPlayground")
              }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="meta mb-4 text-slate-500 dark:text-slate-400">
            {{ $t("footer.sections.project") }}
          </h2>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a
                href="https://github.com/happyloa/nuxt-fakestoreapi"
                target="_blank"
                rel="noopener noreferrer"
                :class="linkClass"
                >{{ $t("footer.links.sourceCode") }}</a
              >
            </li>
            <li>
              <a
                href="https://fakestoreapi.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                :class="linkClass"
                >Fake Store API</a
              >
            </li>
            <li>
              <a
                href="https://nuxt.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                :class="linkClass"
                >Nuxt</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- 字標寬度約為字級的 6.3 倍，以容器寬度換算字級讓它剛好撐滿版心。 -->
      <p
        class="mt-16 select-none whitespace-nowrap text-[calc(100cqw/6.4)] font-extrabold leading-[0.8] tracking-[-0.06em] text-slate-900 dark:text-paper"
        aria-hidden="true"
      >
        Storefront Lab
      </p>
      <div
        class="meta mt-6 flex flex-col gap-1 border-t border-rule py-5 text-slate-500 sm:flex-row sm:justify-between dark:border-rule-dark dark:text-slate-400"
      >
        <p>{{ $t("footer.copyright", { year }) }}</p>
        <p>{{ $t("footer.demoNotice") }}</p>
      </div>
    </div>
  </footer>
</template>
