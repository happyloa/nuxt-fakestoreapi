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
