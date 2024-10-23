<template>
  <!-- 語言切換按鈕 -->
  <div class="language-switch">
    <button @click="$i18n.setLocale('en')">English</button>
    <button @click="$i18n.setLocale('zh')">中文</button>
  </div>
</template>

<style scoped>
.language-switch {
  margin-top: 20px;
}

.language-switch button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #0295db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.language-switch button:hover {
  background-color: #026fa1;
}
</style>
