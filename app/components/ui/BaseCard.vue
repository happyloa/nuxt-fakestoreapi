<template>
  <!-- 以細線框出的區塊；傳入的 class 等屬性會自動套用到根元素。 -->
  <article
    class="border border-rule p-6 transition-colors duration-200 sm:p-7 dark:border-rule-dark"
  >
    <slot />
  </article>
</template>
