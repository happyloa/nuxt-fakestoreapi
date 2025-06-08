<script setup>
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";

const cart = useCartStore();
const auth = useAuthStore();
</script>

<template>
  <header>
    <nav>
      <NuxtLink to="/">Fake Store</NuxtLink>
      <div class="links">
        <NuxtLink to="/cart">Cart({{ cart.count }})</NuxtLink>
        <NuxtLink v-if="!auth.user" to="/login">Login</NuxtLink>
        <button v-else @click="auth.logout" class="logout">Logout</button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* 頁尾的樣式設置 */
header {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 連結的樣式，繼承文字顏色 */
header a {
  color: inherit;
  font-size: 1.7rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;
  margin-right: 16px;
}

/* 當滑鼠懸停在連結上時，改變顏色 */
header a:hover {
  color: var(--accent);
}

.links {
  display: flex;
  gap: 16px;
}

.logout {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  font-weight: 700;
  transition: color 0.3s ease;
}

.logout:hover {
  color: var(--accent);
}
</style>
