import type { Product } from "#shared/types/fakestore";

/** 首頁商品列表的篩選、搜尋、排序，並與網址參數同步。 */
export const useProductFilters = (productsSource: () => Product[]) => {
  const route = useRoute();
  const router = useRouter();

  const qs = (
    val: string | null | Array<string | null> | undefined,
  ): string =>
    Array.isArray(val) ? (val[0] ?? "") : (val ?? "");

  const selectedCategory = ref(qs(route.query.category) || "all");
  const sortOrder = ref<"asc" | "desc">(
    qs(route.query.sort) === "desc" ? "desc" : "asc",
  );
  const searchQuery = ref(qs(route.query.q));

  const filteredProducts = computed(() => {
    let items = [...productsSource()];
    if (selectedCategory.value !== "all") {
      items = items.filter(
        (product) => product.category === selectedCategory.value,
      );
    }
    if (searchQuery.value) {
      const keyword = searchQuery.value.trim().toLowerCase();
      items = items.filter(
        (product) =>
          product.title.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword),
      );
    }
    return items.sort((a, b) =>
      sortOrder.value === "asc" ? a.price - b.price : b.price - a.price,
    );
  });

  const hasActiveFilters = computed(
    () => selectedCategory.value !== "all" || searchQuery.value.trim() !== "" || sortOrder.value !== "asc",
  );

  // URL 同步加防抖：搜尋逐字輸入時不會每個字元都觸發 router.replace
  let queryTimer: ReturnType<typeof setTimeout> | null = null;
  const cancelSync = () => {
    if (queryTimer) clearTimeout(queryTimer);
    queryTimer = null;
  };
  const updateQuery = () => {
    cancelSync();
    queryTimer = setTimeout(() => {
      // 下一頁載入期間舊頁面仍掛著；使用者已離開時不可再改網址，
      // 否則會取消他點的導覽，或把篩選參數加到下一頁上。
      if (router.currentRoute.value.path !== route.path) return;
      // 保留 hash：Nuxt 在同頁移除 hash 時會捲回頂端（例如從 #catalog 連結進來）。
      router.replace({
        hash: route.hash,
        query: {
          ...route.query,
          category:
            selectedCategory.value !== "all"
              ? selectedCategory.value
              : undefined,
          sort: sortOrder.value === "desc" ? "desc" : undefined,
          q: searchQuery.value ? searchQuery.value : undefined,
        },
      });
    }, 300);
  };

  watch([selectedCategory, sortOrder, searchQuery], updateQuery);

  watch(() => route.query, (query) => {
    cancelSync();
    selectedCategory.value = qs(query.category) || "all";
    sortOrder.value = qs(query.sort) === "desc" ? "desc" : "asc";
    searchQuery.value = qs(query.q);
  });

  onBeforeRouteLeave(cancelSync);
  onScopeDispose(cancelSync);

  const resetFilters = () => {
    selectedCategory.value = "all";
    sortOrder.value = "asc";
    searchQuery.value = "";
  };

  return {
    selectedCategory,
    sortOrder,
    searchQuery,
    filteredProducts,
    hasActiveFilters,
    resetFilters,
  };
};
