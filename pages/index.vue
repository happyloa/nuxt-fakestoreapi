<script setup>
useSeoMeta({
  title: "首頁 | Fake Store API 商品資料串接練習",
  ogTitle: "首頁 | Fake Store API 商品資料串接練習",
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});

import { ref, onMounted } from "vue";

const products = ref([]);

onMounted(async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  products.value = await res.json();
});
</script>

<template>
  <main class="container">
    <h1>Fake Store API 商品資料串接練習</h1>
    <ul class="product-list">
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
