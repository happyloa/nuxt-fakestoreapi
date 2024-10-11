<script setup>
import { ref, onMounted } from "vue";

const products = ref([]);

onMounted(async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  products.value = await res.json();
});
</script>

<template>
  <div>
    <h1>Fake Store API 商品資料串接練習</h1>
    <ul class="product-list">
      <li v-for="product in products" :key="product.id" class="product-item">
        <h3>{{ product.title }}</h3>
        <img :src="product.image" alt="product image" class="product-image" />
        <p>${{ product.price | currency }}</p>
        <nuxt-link :to="`/product/${product.id}`">詳細資訊</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.product-item {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px;
  width: 200px;
  text-align: center;
}
.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
