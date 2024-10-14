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
const selectCategory = (category) => {
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
    <hgroup class="heading-group">
      <h1>Fake Store API 商品資料串接練習</h1>
      <p>
        參考資料：<a href="https://fakestoreapi.com/" target="_blank"
          >Fake Store API</a
        >
      </p>
    </hgroup>

    <div class="product-list-wrapper">
      <ul class="product-list">
        <HomeProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product" />
      </ul>

      <aside class="category-filter">
        <h2>商品分類</h2>
        <ul>
          <li
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="{ active: category === selectedCategory }">
            {{ category }}
          </li>
        </ul>

        <h2>排序方式</h2>
        <div class="sort-order">
          <label>
            <input
              type="radio"
              name="sort"
              value="asc"
              v-model="sortOrder"
              @change="updateSortOrder('asc')" />
            ID：小到大
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="desc"
              v-model="sortOrder"
              @change="updateSortOrder('desc')" />
            ID：大到小
          </label>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.heading-group {
  text-align: center;
  margin: 48px 0;
}

.heading-group h1 {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
}

.heading-group p {
  font-size: 18px;
}

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
  gap: 16px;
}

.category-filter {
  flex: 1;
  border-radius: 16px;
  border: 1px solid #ccc;
  padding: 20px;
}

.category-filter h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

.category-filter ul {
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
}

.category-filter li {
  border: 1px solid #ccc;
  border-radius: 16px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 8px;
  text-align: center;
  transition: all 0.3s;
}

.category-filter li:hover {
  background-color: #f0f0f0;
}

.category-filter li.active {
  background-color: #f0f0f0;
  font-weight: bold;
}

.sort-order {
  display: flex;
  gap: 16px;
}

/* RWD 斷點設計 */
@media (max-width: 1024px) {
  .heading-group h1 {
    font-size: 36px;
  }

  .category-filter h2 {
    text-align: center;
  }

  .sort-order {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .heading-group h1 {
    font-size: 32px;
  }

  .product-list-wrapper {
    flex-direction: column-reverse;
  }

  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .heading-group h1 {
    font-size: 28px;
  }

  .product-list {
    grid-template-columns: 1fr;
  }
}
</style>
