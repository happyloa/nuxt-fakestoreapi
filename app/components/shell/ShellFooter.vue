<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const localePath = useLocalePath();
const year = new Date().getFullYear();

const links = computed(() => [
  { label: t("navigation.shop"), to: localePath("/") },
  { label: t("navigation.cart"), to: localePath("/cart") },
]);
</script>

<template>
  <footer class="shell-footer">
    <div class="shell-container shell-footer__inner">
      <div>
        <p class="shell-footer__copy">
          © {{ year }} <strong>{{ t("site.name") }}</strong>
        </p>
        <p class="shell-footer__source">
          <a
            href="https://fakestoreapi.com/"
            target="_blank"
            rel="noreferrer">
            Fake Store API
          </a>
        </p>
      </div>
      <nav :aria-label="t('site.name')">
        <ul class="shell-footer__links">
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to" class="shell-footer__link">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>
