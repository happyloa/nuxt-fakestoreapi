<script setup>
import { useCartStore } from "~/stores/cart";

const cart = useCartStore();
</script>

<template>
  <main class="container">
    <h1>Cart</h1>
    <div v-if="cart.items.length">
      <ul class="list">
        <li v-for="item in cart.items" :key="item.id" class="item">
          <img :src="item.image" :alt="item.title" />
          <span>{{ item.title }} x {{ item.quantity }}</span>
          <span>${{ item.price * item.quantity }}</span>
          <button @click="cart.removeItem(item.id)">Remove</button>
        </li>
      </ul>
      <p class="total">Total: ${{ cart.total }}</p>
      <button @click="cart.clear()" class="clear">Clear Cart</button>
    </div>
    <p v-else>No items.</p>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.list {
  list-style: none;
  padding: 0;
}
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}
.item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.item button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--accent);
}
.total {
  font-weight: 700;
  margin-top: 16px;
}
.clear {
  margin-top: 8px;
  padding: 8px 16px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s ease;
}
.clear:hover {
  background: #ff5722;
}
</style>
