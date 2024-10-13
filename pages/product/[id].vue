<script setup>
import { useRoute } from "vue-router";
import { useFetch } from "#app";

const route = useRoute();
const { data: product } = useFetch(
  () => `https://fakestoreapi.com/products/${route.params.id}`
);

useSeoMeta({
  title: `${product?.value?.title ?? ""} | Fake Store API 商品資料串接練習`,
  ogTitle: `${product?.value?.title ?? ""} | Fake Store API 商品資料串接練習`,
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});
</script>

<template>
  <main class="container">
    <section v-if="product" class="product-details">
      <h1>{{ product.title }}</h1>
      <img
        :src="product.image"
        :alt="`${product.title} 圖片`"
        class="product-image" />
      <p>{{ product.description }}</p>
      <p><strong>價格：</strong> ${{ product.price }}</p>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.product-details {
  text-align: center;
  margin: 48px 0;
}

.product-details h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 24px;
}

.product-details p {
  font-size: 20px;
  margin-bottom: 16px;
}

.product-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  margin-bottom: 24px;
}
</style>
