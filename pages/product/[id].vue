<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const product = ref({});
const route = useRoute();

onMounted(async () => {
  const res = await fetch(
    `https://fakestoreapi.com/products/${route.params.id}`
  );
  product.value = await res.json();

  useSeoMeta({
    title: `${product.value.title} | Fake Store API 商品資料串接練習`,
    ogTitle: `${product.value.title} | Fake Store API 商品資料串接練習`,
    description: "Fake Store API 商品資料串接練習 by Aaron",
    ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
  });
});
</script>

<template>
  <div>
    <h1>{{ product.title }}</h1>
    <img :src="product.image" alt="product image" class="product-image" />
    <p>{{ product.description }}</p>
    <p><strong>價格：</strong> {{ product.price | currency }}</p>
  </div>
</template>

<style scoped>
.product-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
}
</style>
