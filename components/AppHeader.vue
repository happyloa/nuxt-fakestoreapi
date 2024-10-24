<template>
  <header>
    <nav>
      <NuxtLink to="/">Fake Store API</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
/* 頁尾的樣式設置 */
header {
  background-color: #e0e5e9;
  color: #262626;
}

header nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 連結的樣式，繼承文字顏色 */
header a {
  color: inherit;
  font-size: 1.7rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.3s ease;
}

/* 當滑鼠懸停在連結上時，改變顏色 */
header a:hover {
  color: #0295db;
}
</style>
