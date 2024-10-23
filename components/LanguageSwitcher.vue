<script setup>
import { useI18n } from "vue-i18n"; // 引入 i18n
import { useRouter, useRoute } from "vue-router"; // 引入 router 和 route

/* 使用 i18n 來處理語言切換 */
const { locale, setLocale } = useI18n();
const router = useRouter();
const route = useRoute();

/* 設置當前語言變數 */
const currentLanguage = computed(() => locale.value);

/* 切換語言的函數，更新語言並同步更新網址 */
const toggleLanguage = () => {
  const newLocale = currentLanguage.value === "en" ? "zh" : "en";

  /* 更新 locale */
  setLocale(newLocale).then(() => {
    /* 如果新語言是中文（預設語言），則不需要語言前綴，直接使用路徑 */
    if (newLocale === "zh") {
      router.push({ path: route.fullPath.replace(/^\/en/, "") });
    } else {
      /* 切換到英文時，加上 /en 前綴 */
      router.push({ path: `${route.fullPath}` });
    }
  });
};
</script>

<template>
  <!-- 單個語言切換按鈕，固定在畫面右下角 -->
  <button type="button" class="language-switcher" @click="toggleLanguage">
    <img src="../public/language-translation.svg" alt="切換語言 icon" />
  </button>
</template>

<style scoped>
/* 固定按鈕樣式，固定在畫面右下角 */
.language-switcher {
  position: fixed;
  bottom: 7%;
  right: 7%;
  padding: 20px;
  background-color: #262626;
  box-shadow: 0 0 12px 1px rgba(2, 149, 219, 0.7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000; /* 保證按鈕在其他元素之上 */
}

/* 當按鈕被 hover 時改變背景顏色 */
.language-switcher:hover {
  background-color: #0295db;
}

.language-switcher img {
  width: 25px;
  filter: invert(1);
}
</style>
