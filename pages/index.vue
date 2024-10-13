<script setup>
useSeoMeta({
  title: "首頁 | Fake Store API 商品資料串接練習",
  ogTitle: "首頁 | Fake Store API 商品資料串接練習",
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});

// 使用 useFetch 以確保 SSR 效果
const { data: products } = useFetch("https://fakestoreapi.com/products");
</script>

<template>
  <main class="container">
    <hgroup class="heading-group">
      <h1>Fake Store API 商品資料串接練習</h1>
      <p>
        參考資料：<a href="https://fakestoreapi.com/" target="_blank"
          >Fake Store API</a
        >
      </p>
    </hgroup>

    <ul class="product-list">
      <li v-for="product in products" :key="product.id" class="list-card">
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
  </main>
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

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 16px;
}

.list-card {
  border: 1px solid #ccc;
  max-width: 100%;
  text-align: center;
}

.product-link {
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  padding: 16px;
}

.product-image {
  width: 6.25rem;
  height: 6.25rem;
  object-fit: cover;
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
