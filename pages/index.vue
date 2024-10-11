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
    <h1>Online Shop</h1>
    <div class="product-list">
      <div v-for="product in products" :key="product.id" class="product-item">
        <h3>{{ product.title }}</h3>
        <img :src="product.image" alt="product image" class="product-image" />
        <p>{{ product.price | currency }}</p>
        <nuxt-link :to="`/product/${product.id}`">View Details</nuxt-link>
      </div>
    </div>
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
