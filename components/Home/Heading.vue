<template>
  <!-- 標題組合，包含 h1 標題和一個段落 -->
  <hgroup class="heading-group">
    <!-- 使用 i18n 來動態顯示標題翻譯字串 -->
    <h1>{{ $t("title") }}</h1>
    <p>
      <!-- 使用 i18n 來動態顯示描述翻譯字串 -->
      {{ $t("description") }}
      <a href="https://fakestoreapi.com/" target="_blank">Fake Store API</a>
      <!-- 提供到 Fake Store API 的參考連結，使用 target="_blank" 在新標籤頁開啟 -->
    </p>
  </hgroup>
</template>

<style scoped>
/* 標題組的基本樣式設定，置中對齊，並設置上下的邊距 */
.heading-group {
  text-align: center;
  margin: 48px 0;
  color: var(--text);
}

/* 標題 h1 的樣式設置，包括字體大小、字體粗細以及行距 */
.heading-group h1 {
  font-size: 42px; /* 標題字體大小 */
  font-weight: 700; /* 標題字體粗細 */
  line-height: 1.2; /* 行距 */
  margin-bottom: 16px; /* 與下方段落的間距 */
  color: var(--primary);
}

/* 副標題段落的樣式設置，包括字體大小和顏色 */
.heading-group p {
  font-size: 18px;
  color: #666;
}

/* 連結的顏色設定，默認為藍色 */
a {
  color: var(--primary);
  transition: all 0.3s ease;
}

/* 連結 hover 狀態下的顏色改變，改為深灰色 */
a:hover {
  color: var(--accent);
}

/* 在寬度小於 1024px 的裝置上，調整標題的字體大小 */
@media (max-width: 1024px) {
  .heading-group h1 {
    font-size: 36px;
  }
}

/* 在寬度小於 576px 的裝置上，進一步縮小標題的字體大小 */
@media (max-width: 576px) {
  .heading-group h1 {
    font-size: 28px;
  }
}
</style>
