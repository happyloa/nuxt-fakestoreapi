<script setup>
useSeoMeta({
  title: "首頁 | Fake Store API 商品資料串接練習",
  ogTitle: "首頁 | Fake Store API 商品資料串接練習",
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});

import { ref, onMounted } from "vue";

const products = ref([]);
const loading = ref(true); // 加入 Loading 狀態

onMounted(async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  products.value = await res.json();
  loading.value = false; // 資料載入完成後關閉 Loading 狀態
});
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

    <!-- 顯示 Loading 指示器或產品列表 -->
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>從 API 讀取資料中...</p>
    </div>

    <ul v-else class="product-list">
      <li v-for="product in products" :key="product.id" class="list-card">
        <nuxt-link :to="`/product/${product.id}`" class="product-link">
          <h3>{{ product.title }}</h3>
          <img :src="product.image" alt="product image" class="product-image" />
          <p>${{ product.price | currency }}</p>
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
  margin-bottom: 16px;
}

.heading-group p {
  font-size: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Loading 指示器樣式 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 100px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.list-card {
  border: 1px solid #ccc;
  max-width: 200px;
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
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
