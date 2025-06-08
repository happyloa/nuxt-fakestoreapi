<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const submit = () => {
  auth.login(username.value, password.value)
}
</script>

<template>
  <main class="container">
    <h1>Login</h1>
    <form @submit.prevent="submit" class="form">
      <input v-model="username" placeholder="username" />
      <input type="password" v-model="password" placeholder="password" />
      <button type="submit" :disabled="auth.loading">Login</button>
    </form>
    <p v-if="auth.error" class="error">{{ auth.error }}</p>
  </main>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px;
  background: #0295db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
}
.error {
  color: red;
  margin-top: 12px;
}
</style>
