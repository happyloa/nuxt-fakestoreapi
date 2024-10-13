<script setup>
useSeoMeta({
  title: "首頁 | Fake Store API 商品資料串接練習",
  ogTitle: "首頁 | Fake Store API 商品資料串接練習",
  description: "Fake Store API 商品資料串接練習 by Aaron",
  ogDescription: "Fake Store API 商品資料串接練習 by Aaron",
});

// 使用 useFetch 以確保 SSR 效果
const { data: products } = useFetch("https://fakestoreapi.com/products");
</script>

<template>
  <main class="container">
    <hgroup class="heading-group">
      <h1>Fake Store API 商品資料串接練習</h1>
      <p>
        參考資料：<a href="https://fakestoreapi.com/" target="_blank"
          >Fake Store API</a
        >
      </p>
    </hgroup>

    <ul class="product-list">
      <li v-for="product in products" :key="product.id" class="list-card">
        <nuxt-link :to="`/product/${product.id}`" class="product-link">
          <h3>{{ product.title }}</h3>
          <img
            :src="product.image"
            :alt="`${product.title} 圖片`"
            class="product-image" />
          <p>${{ product.price }}</p>
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.heading-group {
  text-align: center;
  margin: 48px 0;
}

.heading-group h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
}

.heading-group p {
  font-size: 20px;
}

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

/* RWD 斷點設計 */
@media (max-width: 1024px) {
  .heading-group h1 {
    font-size: 36px;
  }

  .heading-group p {
    font-size: 18px;
  }

  .container {
    padding: 0 16px;
  }

  .product-list {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .heading-group h1 {
    font-size: 32px;
  }

  .heading-group p {
    font-size: 16px;
  }

  .container {
    padding: 0 12px;
  }

  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .list-card {
    max-width: 150px;
  }

  .product-link {
    gap: 12px;
    padding: 12px;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 576px) {
  .heading-group h1 {
    font-size: 28px;
  }

  .heading-group p {
    font-size: 14px;
  }

  .container {
    padding: 0 8px;
  }

  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }

  .list-card {
    max-width: 120px;
  }

  .product-link {
    gap: 8px;
    padding: 8px;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }
}
</style>
