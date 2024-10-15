<script setup>
import { useRouter, useRoute } from "vue-router";

useSeoMeta({
  title: "首頁 | Fake Store API 商品資料串接練習",
  ogTitle: "首頁 | Fake Store API 商品資料串接練習",
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});

// 使用 useFetch 以確保 SSR 效果
const { data: products } = useFetch("https://fakestoreapi.com/products");

// 可用分類選單
const categories = ref([
  "所有商品",
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
]);

// 當前選中的分類
const selectedCategory = ref("所有商品");

// 排序方式，預設為升冪
const sortOrder = ref("asc");

// 路由
const router = useRouter();
const route = useRoute();

// 在頁面加載時根據查詢參數設置當前分類和排序
onMounted(() => {
  const categoryFromQuery = route.query.category || "所有商品";
  const sortFromQuery = route.query.sort || "asc";

  if (categories.value.includes(categoryFromQuery)) {
    selectedCategory.value = categoryFromQuery;
  }

  if (sortFromQuery === "desc") {
    sortOrder.value = "desc";
  } else {
    sortOrder.value = "asc";
  }
});

// 篩選商品資料，並根據選擇的排序方式進行排序（使用id）
const filteredProducts = computed(() => {
  let filtered =
    selectedCategory.value === "所有商品"
      ? products.value
      : products.value.filter(
          (product) => product.category === selectedCategory.value
        );

  // 根據 id 進行升冪或降冪排序
  return filtered.sort((a, b) => {
    return sortOrder.value === "asc" ? a.id - b.id : b.id - a.id;
  });
});

// 更新選中的分類並在 URL 上帶入參數
const updateCategory = (category) => {
  selectedCategory.value = category;
  updateQueryParams();
};

// 更新排序方式並在 URL 上帶入參數
const updateSortOrder = (order) => {
  sortOrder.value = order;
  updateQueryParams();
};

// 更新網址參數（包含分類和排序）
const updateQueryParams = () => {
  const query = {};

  if (selectedCategory.value !== "所有商品") {
    query.category = selectedCategory.value;
  }

  if (sortOrder.value === "desc") {
    query.sort = "desc";
  }

  router.push({ query });
};
</script>

<template>
  <section class="container">
    <HomeHeading />
    <div class="product-list-wrapper">
      <ul class="product-list">
        <HomeProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product" />
      </ul>

      <HomeFilter
        :categories="categories"
        :selectedCategory="selectedCategory"
        :sortOrder="sortOrder"
        @updateCategory="updateCategory"
        @updateSortOrder="updateSortOrder" />
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.product-list-wrapper {
  display: flex;
  gap: 20px;
}

.product-list {
  flex: 3;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 20px;
}

/* RWD 斷點設計 */
@media (max-width: 768px) {
  .product-list-wrapper {
    flex-direction: column-reverse;
  }

  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .product-list {
    grid-template-columns: 1fr;
  }
}
</style>
