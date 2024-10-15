<script setup>
import { useRouter, useRoute } from "vue-router"; // 引入路由功能

/* 設置 SEO 元數據 */
useSeoMeta({
  title: "首頁 | Fake Store API 商品資料串接練習",
  ogTitle: "首頁 | Fake Store API 商品資料串接練習",
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});

/* 使用 useFetch 進行 SSR 數據抓取，從 Fake Store API 獲取產品數據 */
const { data: products } = await useFetch("https://fakestoreapi.com/products");

/* 定義可用的商品分類 */
const categories = ref([
  "所有商品",
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
]);

/* 當前選中的分類，默認為 "所有商品" */
const selectedCategory = ref("所有商品");

/* 排序方式，默認為升冪（asc） */
const sortOrder = ref("asc");

/* 路由 */
const router = useRouter(); // 用於更新 URL
const route = useRoute(); // 用於獲取當前 URL 查詢參數

/* 在頁面加載時，根據 URL 查詢參數設置當前分類和排序 */
onMounted(() => {
  const categoryFromQuery = route.query.category || "所有商品";
  const sortFromQuery = route.query.sort || "asc";

  /* 如果 URL 上有分類參數，並且該分類有效，設置為當前選中的分類 */
  if (categories.value.includes(categoryFromQuery)) {
    selectedCategory.value = categoryFromQuery;
  }

  /* 根據 URL 上的排序參數設置當前的排序方式 */
  if (sortFromQuery === "desc") {
    sortOrder.value = "desc";
  } else {
    sortOrder.value = "asc";
  }
});

/* 根據選中的分類和排序方式篩選商品 */
const filteredProducts = computed(() => {
  /* 如果選中的分類為 "所有商品"，顯示所有商品；否則只顯示對應分類的商品 */
  let filtered =
    selectedCategory.value === "所有商品"
      ? products.value
      : products.value.filter(
          (product) => product.category === selectedCategory.value
        );

  /* 根據商品 ID 進行排序，升冪或降冪 */
  return filtered.sort((a, b) => {
    return sortOrder.value === "asc" ? a.id - b.id : b.id - a.id;
  });
});

/* 更新選中的分類，並將分類參數寫入 URL */
const updateCategory = (category) => {
  selectedCategory.value = category;
  updateQueryParams(); // 更新 URL
};

/* 更新排序方式，並將排序參數寫入 URL */
const updateSortOrder = (order) => {
  sortOrder.value = order;
  updateQueryParams(); // 更新 URL
};

/* 更新 URL 的查詢參數（包含分類和排序） */
const updateQueryParams = () => {
  const query = {};

  /* 如果選中的分類不是 "所有商品"，則將分類寫入 URL 查詢參數 */
  if (selectedCategory.value !== "所有商品") {
    query.category = selectedCategory.value;
  }

  /* 如果排序方式為降冪，則將排序參數寫入 URL */
  if (sortOrder.value === "desc") {
    query.sort = "desc";
  }

  /* 更新路由 URL */
  router.push({ query });
};
</script>

<template>
  <!-- 主頁內容 -->
  <section class="container">
    <!-- 引入 HomeHeading 元件，顯示頁面的標題和簡介 -->
    <HomeHeading />
    <div class="product-list-wrapper">
      <!-- 商品列表，通過 HomeProductCard 元件渲染每個商品 -->
      <ul class="product-list">
        <HomeProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product" />
      </ul>

      <!-- 引入 HomeFilter 元件，用於篩選商品和調整排序 -->
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
/* 設置主容器的最大寬度和邊距 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 商品列表區域和篩選器之間的佈局設定 */
.product-list-wrapper {
  display: flex;
  gap: 20px;
}

/* 商品列表的佈局，使用 grid 進行排列 */
.product-list {
  flex: 3;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 20px;
}

/* RWD 斷點設計，當寬度小於 768px 時，調整為上下佈局 */
@media (max-width: 768px) {
  .product-list-wrapper {
    flex-direction: column-reverse;
  }

  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 當寬度小於 576px 時，顯示單列商品 */
@media (max-width: 576px) {
  .product-list {
    grid-template-columns: 1fr;
  }
}
</style>
