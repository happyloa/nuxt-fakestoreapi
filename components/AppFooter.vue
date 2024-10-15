<template>
  <!-- 頁尾區域 -->
  <footer>
    <!-- 顯示作者與 Fake Store API 練習的描述 -->
    <p>Fake Store API 資料串接練習 by 謝宗佑</p>
    <!-- GitHub Repository 連結，點擊後於新標籤頁打開 -->
    <a href="https://github.com/happyloa/nuxt-fakestoreapi" target="_blank">
      GitHub Repo 連結
    </a>
  </footer>
</template>

<style scoped>
/* 頁尾的樣式設置 */
footer {
  background-color: #262626;
  color: #e0e5e9;
  text-align: center; /* 文字置中 */
  padding: 20px 0; /* 上下內邊距設置 */
  margin-top: 48px; /* 與上方內容間距 */
}

/* 段落的樣式，設置底部邊距 */
footer p {
  margin-bottom: 8px;
}

/* 連結的樣式，繼承文字顏色 */
footer a {
  color: inherit; /* 繼承頁尾文字顏色 */
  text-decoration: none;
  transition: color 0.3s ease;
}

/* 當滑鼠懸停在連結上時，改變顏色 */
footer a:hover {
  color: #0295db;
}
</style>
