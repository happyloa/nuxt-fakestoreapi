import type { Product } from "#shared/types/fakestore";

/**
 * 統一管理商品列表的過濾邏輯與網址同步。
 * 在頁面與元件之間重複利用，維持資料流的一致性。
 */
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
  const updateQuery = () => {
    if (queryTimer) clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      router.replace({
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
    if (queryTimer) clearTimeout(queryTimer);
    selectedCategory.value = qs(query.category) || "all";
    sortOrder.value = qs(query.sort) === "desc" ? "desc" : "asc";
    searchQuery.value = qs(query.q);
  });

  onScopeDispose(() => {
    if (queryTimer) clearTimeout(queryTimer);
  });

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
