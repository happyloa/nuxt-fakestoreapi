<script setup>
/* 定義傳入的 props，接收 categories (分類列表)、selectedCategory (當前選中的分類)、sortOrder (當前的排序方式) 和 searchQuery (搜尋關鍵字) */
defineProps({
  categories: {
    type: Array,
    required: true,
  },
  selectedCategory: {
    type: String,
    required: true,
  },
  sortOrder: {
    type: String,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
});

/* 定義事件 emit，允許父元件捕捉到分類、排序及搜尋框的變更 */
const emit = defineEmits([
  "updateCategory",
  "updateSortOrder",
  "updateSearchQuery",
]);

/* 選擇分類時，觸發事件通知父元件更新當前選中的分類 */
const selectCategory = (category) => {
  emit("updateCategory", category);
};

/* 選擇排序方式時，觸發事件通知父元件更新排序方式 */
const updateSortOrder = (order) => {
  emit("updateSortOrder", order);
};

/* 當搜尋框內容改變時，通知父元件更新搜尋關鍵字 */
const onSearch = (event) => {
  emit("updateSearchQuery", event.target.value);
};
</script>

<template>
  <!-- 側邊篩選區域 -->
  <aside class="category-filter">
    <div class="filters-wrapper">
      <!-- 顯示商品分類標題 -->
      <h2>{{ $t("category_content.title") }}</h2>
      <ul>
        <!-- 使用 v-for 循環渲染分類列表 -->
        <li
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)"
          :class="{ active: category === selectedCategory }">
          {{ category }}
        </li>
      </ul>

      <!-- 顯示排序方式標題 -->
      <h2>{{ $t("sort.title") }}</h2>
      <div class="sort-order">
        <label>
          <input
            type="radio"
            name="sort"
            value="asc"
            :checked="sortOrder === 'asc'"
            @change="updateSortOrder('asc')" />
          {{ $t("sort.asc") }}
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="desc"
            :checked="sortOrder === 'desc'"
            @change="updateSortOrder('desc')" />
          {{ $t("sort.desc") }}
        </label>
      </div>

      <!-- 搜尋列，設定 v-model 綁定 searchQuery prop 作為初始值 -->
      <h2>{{ $t("search.title") }}</h2>
      <div class="search-bar">
        <input
          type="text"
          :value="searchQuery"
          :placeholder="`${$t('search.placeholder')}`"
          @input="onSearch"
          class="search-input" />
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 整個篩選區塊的樣式，包括邊框、背景顏色和內邊距 */
.category-filter {
  flex: 1;
  border-radius: 16px;
  border: 1px solid #0295db;
  padding: 20px;
  background-color: #e0e5e9;
}

.category-filter .filters-wrapper {
  position: sticky;
  top: 20px;
}

/* 商品分類標題的樣式 */
.category-filter h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #262626;
}

/* 分類列表的樣式，移除默認列表樣式 */
.category-filter ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

/* 單個分類選項的樣式，包括邊框、背景顏色、圓角及文字對齊 */
.category-filter li {
  border: 1px solid #9d9da1;
  border-radius: 16px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 8px;
  text-align: center;
  transition: all 0.3s;
  background-color: #e0e5e9;
}

/* 當滑鼠懸停在分類上時，背景顏色變為藍色 */
.category-filter li:hover {
  background-color: #0295db;
}

/* 當分類為當前選中的分類時，應用深灰色背景並改變文字顏色 */
.category-filter li.active {
  background-color: #262626;
  color: white;
  font-weight: bold;
}

/* 排序方式區域的樣式設定 */
.sort-order {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #9d9da1;
  margin-bottom: 20px;
}

/* 排序選項的標籤樣式 */
label {
  color: #262626;
  cursor: pointer;
}

/* 搜尋列樣式 */
.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #0295db;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

/* RWD 斷點設計，當寬度小於 1024px 時，調整標題和排序選項的顯示方式 */
@media (max-width: 1024px) {
  .category-filter h2 {
    text-align: center;
  }

  .sort-order {
    align-items: center;
  }
}
</style>
