<script setup>
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

// 篩選商品資料
const filteredProducts = computed(() => {
  if (selectedCategory.value === "所有商品") {
    return products.value;
  }
  return products.value.filter(
    (product) => product.category === selectedCategory.value
  );
});

// 更新選中的分類
const selectCategory = (category) => {
  selectedCategory.value = category;
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
        <li
          v-for="product in filteredProducts"
          :key="product.id"
          class="list-card">
          <nuxt-link :to="`/product/${product.id}`" class="product-link">
            <h3>{{ product.title }}</h3>
            <img
              :src="product.image"
              :alt="`${product.title} 圖片`"
              class="product-image" />
            <p>${{ product.price }}</p>
          </nuxt-link>
        </li>
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

.list-card {
  border: 1px solid #ccc;
  border-radius: 16px;
  max-width: 100%;
  text-align: center;
}

.product-link {
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  padding: 36px 20px;
}

.product-image {
  width: 6.25rem;
  height: 6.25rem;
  object-fit: cover;
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
  position: sticky;
  top: 48px;
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

/* RWD 斷點設計 */
@media (max-width: 1024px) {
  .heading-group h1 {
    font-size: 36px;
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

  .product-link {
    gap: 12px;
    padding: 12px;
  }

  .product-image {
    width: 5rem;
    height: 5rem;
  }
}

@media (max-width: 576px) {
  .heading-group h1 {
    font-size: 28px;
  }

  .product-list {
    grid-template-columns: 1fr;
  }

  .product-image {
    width: 3.75rem;
    height: 3.75rem;
  }
}
</style>
