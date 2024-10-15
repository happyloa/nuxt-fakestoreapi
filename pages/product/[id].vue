<script setup>
import { useRoute } from "vue-router"; // 引入 useRoute 用於獲取路由參數
import { useFetch } from "#app"; // 引入 useFetch 用於進行資料抓取

/* 獲取當前路由參數中的商品 ID，並使用 useFetch 從 API 獲取對應的商品資料 */
const route = useRoute();
const { data: product } = await useFetch(
  () => `https://fakestoreapi.com/products/${route.params.id}`
);

/* 設置 SEO 元數據 */
useSeoMeta({
  title: `${product?.value?.title ?? ""} | Fake Store API 商品資料串接練習`,
  ogTitle: `${product?.value?.title ?? ""} | Fake Store API 商品資料串接練習`,
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});
</script>

<template>
  <!-- 主內容區域 -->
  <main class="container">
    <!-- 當 product 有資料時顯示商品詳情 -->
    <section v-if="product" class="product-details">
      <!-- 顯示商品標題 -->
      <h1>{{ product.title }}</h1>
      <!-- 顯示商品圖片，使用 alt 描述圖片 -->
      <img
        :src="product.image"
        :alt="`${product.title} 圖片`"
        class="product-image" />
      <!-- 顯示商品描述 -->
      <p>{{ product.description }}</p>
      <!-- 顯示商品價格 -->
      <p><strong>價格：</strong> ${{ product.price }}</p>
    </section>
  </main>
</template>

<style scoped>
/* 主容器的設置，控制內容的最大寬度和邊距 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 商品詳情區域樣式，包括文字對齊和上下邊距 */
.product-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* 文字置中對齊 */
  margin: 48px 0;
}

/* 商品標題樣式，設置字體大小和下方間距 */
.product-details h1 {
  font-size: 36px; /* 大字體顯示標題 */
  font-weight: 700; /* 粗體字 */
  margin-bottom: 24px; /* 與下方內容的間距 */
}

/* 商品描述和價格的樣式設置 */
.product-details p {
  font-size: 20px; /* 中等字體大小 */
  line-height: 1.5;
  margin-bottom: 16px; /* 元素之間的間距 */
  max-width: 600px;
}

/* 商品圖片樣式，設置大小並保持比例 */
.product-image {
  width: 300px;
  height: 300px;
  object-fit: cover; /* 圖片自動縮放，保持比例不變 */
  margin-bottom: 24px; /* 圖片與下方文字的間距 */
}

/* 使用新配色設置文字和背景 */
.product-details h1 {
  color: #0295db;
}

.product-details p {
  color: #262626;
}

.product-image {
  border: 2px solid #9d9da1;
  border-radius: 8px; /* 圖片圓角設置 */
}
</style>
