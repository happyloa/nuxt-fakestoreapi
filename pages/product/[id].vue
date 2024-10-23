<script setup>
import { useRoute } from "vue-router"; // 引入 useRoute 用於獲取路由參數
import { useFetch } from "#app"; // 引入 useFetch 用於進行資料抓取
import { useI18n } from "vue-i18n"; // 引入 i18n

/* 使用 i18n 來獲取翻譯 */
const { t } = useI18n();

/* 獲取當前路由參數中的商品 ID，並使用 useFetch 從 API 獲取對應的商品資料 */
const route = useRoute();
const { data: product } = await useFetch(
  () => `https://fakestoreapi.com/products/${route.params.id}`
);

/* 計算評價星數，四捨五入 */
const roundedRating = computed(() => Math.round(product.value.rating.rate));

/* 設置 SEO 元數據，動態使用產品標題 */
useSeoMeta({
  title: `${product?.value?.title ?? ""} | ${t("seo.title")}`,
  ogTitle: `${product?.value?.title ?? ""} | ${t("seo.title")}`,
  description: t("seo.description"),
  ogDescription: t("seo.description"),
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

      <!-- 顯示評價星數 -->
      <div class="rating">
        <span v-for="n in 5" :key="n" class="star">
          {{ n <= roundedRating ? "★" : "☆" }}
        </span>
      </div>

      <!-- 顯示商品價格 -->
      <p>
        <strong>{{ $t("product_details.price") }}</strong> ${{ product.price }}
      </p>
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

/* 商品圖片樣式，設置大小並保持比例 */
.product-image {
  border: 2px solid #9d9da1;
  border-radius: 8px; /* 圖片圓角設置 */
  width: 300px;
  height: 300px;
  object-fit: cover; /* 圖片自動縮放，保持比例不變 */
  margin-bottom: 24px; /* 圖片與下方文字的間距 */
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
  color: #0295db;
  font-size: 36px; /* 大字體顯示標題 */
  font-weight: 700; /* 粗體字 */
  margin-bottom: 24px; /* 與下方內容的間距 */
}

/* 商品描述和價格的樣式設置 */
.product-details p {
  color: #262626;
  font-size: 20px; /* 中等字體大小 */
  line-height: 1.5;
  margin-bottom: 16px; /* 元素之間的間距 */
  max-width: 600px;
}

/* 評價星星樣式 */
.rating {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.star {
  font-size: 24px;
  color: #ffd700; /* 橘色星星 */
}
</style>
