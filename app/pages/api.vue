<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/stores/products";
// ProductsSection / CartsSection / UsersSection 由 Nuxt 自動匯入，無需顯式 import

/**
 * API Playground 頁面
 * 集中展示 Fake Store API 的全部操作 (CRUD)
 * 讓訪客可以實際操作並觀察 API 回應，作為作品集的互動展示亮點。
 */
const productsStore = useProductsStore();

const { t } = useI18n();
const activeResource = ref("products");
const resources = computed(() =>
  ["products", "carts", "users"].map((value) => ({
    value,
    label: t("api." + value + ".title"),
  })),
);
function moveTab(event: KeyboardEvent) {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const buttons = Array.from(
    (
      event.currentTarget as HTMLElement
    ).parentElement!.querySelectorAll<HTMLButtonElement>("button"),
  );
  const index = resources.value.findIndex(
    (item) => item.value === activeResource.value,
  );
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? buttons.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
          buttons.length;
  activeResource.value = resources.value[next]!.value;
  buttons[next]?.focus();
}

// 預先抓取商品分類，供 ProductsSection 的下拉選單使用
await productsStore.fetchCategories();

// 設定 SEO Meta 標籤
usePageSeo(() => ({
  title: t("seo.api.title"),
  description: t("seo.api.description"),
}));
</script>

<template>
  <div class="space-y-12">
    <BaseSectionHeading
      :level="1"
      :title="$t('api.title')"
      :description="$t('api.subtitle')"
    />

    <BaseAlert variant="info">{{ $t("api.demoNotice") }}</BaseAlert>
    <div
      role="tablist"
      :aria-label="$t('api.title')"
      class="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
    >
      <button
        v-for="resource in resources"
        :id="'tab-' + resource.value"
        :key="resource.value"
        type="button"
        role="tab"
        :aria-selected="activeResource === resource.value"
        :aria-controls="'panel-' + resource.value"
        :tabindex="activeResource === resource.value ? 0 : -1"
        class="min-h-11 rounded-full px-5 py-3 text-sm font-bold"
        :class="
          activeResource === resource.value
            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        "
        @click="activeResource = resource.value"
        @keydown="moveTab"
      >
        {{ resource.label }}
      </button>
    </div>
    <section
      id="panel-products"
      v-show="activeResource === 'products'"
      role="tabpanel"
      aria-labelledby="tab-products"
      tabindex="0"
    >
      <LazyProductsSection />
    </section>
    <section
      id="panel-carts"
      v-show="activeResource === 'carts'"
      role="tabpanel"
      aria-labelledby="tab-carts"
      tabindex="0"
    >
      <LazyCartsSection />
    </section>
    <section
      id="panel-users"
      v-show="activeResource === 'users'"
      role="tabpanel"
      aria-labelledby="tab-users"
      tabindex="0"
    >
      <LazyUsersSection />
    </section>
  </div>
</template>
