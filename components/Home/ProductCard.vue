<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <li class="list-card">
    <nuxt-link :to="`/product/${product.id}`" class="product-link">
      <h3>{{ product.title }}</h3>
      <img
        :src="product.image"
        :alt="`${product.title} 圖片`"
        class="product-image" />
      <p>${{ product.price }}</p>
    </nuxt-link>
  </li>
</template>

<style scoped>
.list-card {
  border: 1px solid #0295db; /* 使用藍色作為邊框 */
  border-radius: 16px;
  text-align: center;
  background-color: #e0e5e9; /* 使用淺灰色背景 */
  transition: transform 0.3s ease;
}

.list-card:hover {
  transform: scale(1.05);
  background-color: #262626; /* 使用深灰色作為 hover 效果 */
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

.product-link h3 {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: #0295db; /* 使用藍色作為標題文字顏色 */
}

.product-image {
  width: 6.25rem;
  height: 6.25rem;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #9d9da1; /* 使用中灰色邊框 */
}

.product-link p {
  font-size: 16px;
  color: #262626; /* 使用深灰色作為價格文字顏色 */
}

.list-card:hover p {
  color: #e0e5e9; /* 使用淺灰色作為 hover 效果 */
}

/* RWD 斷點設計 */
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

@media (max-width: 576px) {
  .product-image {
    width: 3.75rem;
    height: 3.75rem;
  }
}
</style>
