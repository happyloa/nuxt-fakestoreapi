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

const cart = useCartStore();

const addToCart = () => {
  cart.addItem({
    id: props.product.id,
    title: props.product.title,
    price: props.product.price,
    image: props.product.image,
  });
};
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
    <button class="add" @click="addToCart">Add to Cart</button>
  </li>
</template>

<style scoped>
/* 卡片的樣式設定，包含邊框、圓角和陰影 */
.list-card {
  border: 1px solid #d1d9e6;
  border-radius: 8px; /* 圓角設定 */
  text-align: center; /* 內容置中 */
  background-color: #ffffff;
  box-shadow: 4px 4px 12px #b8b9be, -4px -4px 12px #fff !important;
  transition: all 0.3s ease; /* 加入 hover 動畫效果 */
}

/* 當卡片被 hover 時，改變陰影 */
.list-card:hover {
  transform: scale(0.975);
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #fff !important;
}

/* 卡片內的連結樣式，將內容以垂直方式排列，並置中 */
.product-link {
  color: inherit;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center;
  gap: 16px; /* 元素之間的間距 */
  text-decoration: none; /* 移除文字裝飾 */
  padding: 36px 16px; /* 內邊距 */
}

/* 商品標題的樣式設定 */
.product-link h3 {
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
}

/* 星星樣式 */
.star {
  font-size: 20px;
  color: #ff8c00; /* 橘色星星 */
}

/* 商品價格的樣式設定 */
.product-link p {
  font-size: 16px;
  color: #262626;
}

.add {
  margin: 8px auto 16px;
  padding: 8px 16px;
  border: none;
  background: #0295db;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
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
