<template>
  <hgroup class="heading-group">
    <h1>Fake Store API 商品資料串接練習</h1>
    <p>
      參考資料：
      <a href="https://fakestoreapi.com/" target="_blank">Fake Store API</a>
    </p>
  </hgroup>
</template>

<style scoped>
.heading-group {
  text-align: center;
  margin: 48px 0;
  color: #262626; /* 使用深灰色作為主色調 */
}

.heading-group h1 {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  color: #0295db; /* 使用藍色作為標題文字顏色 */
}

.heading-group p {
  font-size: 18px;
  color: #9d9da1; /* 使用中灰色作為副標題文字顏色 */
}

a {
  color: #0295db; /* 使用藍色作為連結顏色 */
}

a:hover {
  color: #262626; /* 使用深灰色作為連結 hover 效果 */
}

@media (max-width: 1024px) {
  .heading-group h1 {
    font-size: 36px;
  }
}

@media (max-width: 576px) {
  .heading-group h1 {
    font-size: 28px;
  }
}
</style>
