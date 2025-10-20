<script setup lang="ts">
import { useFakeStoreApi } from "~/composables/useFakeStoreApi";
import type { Product } from "~/types/fakestore";

useSeoMeta({
  title: "Products | Nuxt Fake Store",
  ogTitle: "Products | Nuxt Fake Store",
  description: "Browse products coming from the Fake Store API.",
  ogDescription: "Browse products coming from the Fake Store API.",
});

const api = useFakeStoreApi();
const route = useRoute();
const router = useRouter();

const {
  data: products,
  pending,
  error,
  refresh,
} = await useAsyncData<Product[]>("products:list", () => api.listProducts(), {
  default: () => [],
});

const {
  data: categories,
  refresh: refreshCategories,
} = await useAsyncData<string[]>("products:categories", () => api.listCategories(), {
  default: () => [],
});

const search = ref<string>((route.query.q as string) || "");
const sort = ref<string>((route.query.sort as string) || "asc");
const category = ref<string>((route.query.category as string) || "all");

const filteredProducts = computed(() => {
  const list = products.value ?? [];
  const filtered = list.filter((product) => {
    const matchesCategory =
      category.value === "all" || product.category === category.value;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const sorted = [...filtered].sort((a, b) =>
    sort.value === "desc" ? b.price - a.price : a.price - b.price,
  );
  return sorted;
});

const hasAnyProducts = computed(() => (products.value?.length ?? 0) > 0);

const handleRetry = async () => {
  try {
    await Promise.all([refresh(), refreshCategories()]);
  } catch (err) {
    console.warn("Failed to refresh products", err);
  }
};

watch([search, sort, category], () => {
  const query: Record<string, string> = {};
  if (search.value) query.q = search.value;
  if (sort.value !== "asc") query.sort = sort.value;
  if (category.value !== "all") query.category = category.value;
  router.replace({ query });
});
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[1fr_300px]">
    <div class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="section-title">
            {{ $t("products.pageTitle") }}
          </h1>
          <p class="mt-2 text-sm text-slate-400">
            {{ $t("products.pageSubtitle") }}
          </p>
        </div>
        <NuxtLink
          to="/products/new"
          class="inline-flex items-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
        >
          {{ $t("products.actions.create") }}
        </NuxtLink>
      </div>

      <ProductGrid :products="filteredProducts" :loading="pending">
        <template #empty>
          <ProductFallback
            :title="
              $t(
                error
                  ? 'products.errorTitle'
                  : hasAnyProducts
                    ? 'products.noMatchesTitle'
                    : 'products.emptyTitle',
              )
            "
            :description="
              $t(
                error
                  ? 'products.errorDescription'
                  : hasAnyProducts
                    ? 'products.noMatchesDescription'
                    : 'products.emptyDescription',
              )
            "
            :show-retry="Boolean(error)"
            @retry="handleRetry"
          />
        </template>
      </ProductGrid>
    </div>

    <ProductFilters
      :categories="categories ?? []"
      :selected-category="category"
      :search="search"
      :sort="sort"
      @update:category="category = $event"
      @update:search="search = $event"
      @update:sort="sort = $event"
    />
  </div>
</template>
