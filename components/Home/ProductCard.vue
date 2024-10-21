<script setup>
/* 定義傳入的 prop，接收一個必須的 product 物件 */
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

/* 計算評價星數，四捨五入 */
const roundedRating = computed(() => Math.round(props.product.rating.rate));
</script>

<template>
  <!-- 使用 li 元素作為卡片容器 -->
  <li class="list-card">
    <!-- nuxt-link 用於連結到單獨的商品頁面，透過 product.id 動態生成連結 -->
    <nuxt-link :to="`/product/${product.id}`" class="product-link">
      <!-- 商品標題 -->
      <h3>{{ product.title }}</h3>
      <!-- 商品圖片，使用 alt 文字描述商品 -->
      <img
        :src="product.image"
        :alt="`${product.title} 圖片`"
        class="product-image" />
      <!-- 商品評價，顯示星星 -->
      <div class="rating">
        <span v-for="n in 5" :key="n" class="star">
          {{ n <= roundedRating ? "★" : "☆" }}
        </span>
      </div>
      <!-- 商品價格 -->
      <p>${{ product.price }}</p>
    </nuxt-link>
  </li>
</template>

<style scoped>
/* 卡片的樣式設定，包含邊框、圓角和背景顏色 */
.list-card {
  border: 1px solid #0295db;
  border-radius: 16px; /* 圓角設定 */
  text-align: center; /* 內容置中 */
  background-color: #e0e5e9;
  transition: transform 0.3s ease; /* 加入 hover 動畫效果 */
}

/* 當卡片被 hover 時，放大並改變背景顏色 */
.list-card:hover {
  transform: scale(1.05);
  background-color: #262626;
}

/* 卡片內的連結樣式，將內容以垂直方式排列，並置中 */
.product-link {
  color: inherit;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center;
  gap: 20px; /* 元素之間的間距 */
  text-decoration: none; /* 移除文字裝飾 */
  padding: 36px 20px; /* 內邊距 */
}

/* 商品標題的樣式設定 */
.product-link h3 {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: #0295db;
}

/* 商品圖片的樣式，設定大小、邊框及圓角 */
.product-image {
  width: 6.25rem;
  height: 6.25rem;
  object-fit: cover; /* 圖片按比例縮放以適應框 */
  border-radius: 8px;
  border: 2px solid #9d9da1;
}

/* 評價區域樣式 */
.rating {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 8px;
}

/* 星星樣式 */
.star {
  font-size: 20px;
  color: #ff8c00; /* 橘色星星 */
  transition: color 0.3s ease; /* 加入顏色變化的過渡效果 */
}

/* 商品價格的樣式設定 */
.product-link p {
  font-size: 16px;
  color: #262626;
}

/* 當卡片被 hover 時，星星變為金色 */
.list-card:hover .star {
  color: #ffd700; /* 金色星星 */
}

/* 當卡片 hover 時，價格文字的顏色改變 */
.list-card:hover p {
  color: #e0e5e9;
}

/* RWD 斷點設計，當螢幕寬度小於 768px 時縮小 gap 與 padding */
@media (max-width: 768px) {
  .product-link {
    gap: 12px;
    padding: 12px;
  }

  .product-image {
    width: 5rem;
    height: 5rem;
  }
}

/* RWD 斷點設計，當螢幕寬度小於 576px 時進一步縮小圖片大小 */
@media (max-width: 576px) {
  .product-image {
    width: 3.75rem;
    height: 3.75rem;
  }
}
</style>
