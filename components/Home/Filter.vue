<script setup>
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
});

const emit = defineEmits(["updateCategory", "updateSortOrder"]);

const selectCategory = (category) => {
  emit("updateCategory", category);
};

const updateSortOrder = (order) => {
  emit("updateSortOrder", order);
};
</script>

<template>
  <aside class="category-filter">
    <h2>商品分類</h2>
    <ul>
      <li
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        :class="{ active: category === selectedCategory }">
        {{ category }}
      </li>
    </ul>

    <h2>排序方式</h2>
    <div class="sort-order">
      <label>
        <input
          type="radio"
          name="sort"
          value="asc"
          :checked="sortOrder === 'asc'"
          @change="updateSortOrder('asc')" />
        ID：小到大
      </label>
      <label>
        <input
          type="radio"
          name="sort"
          value="desc"
          :checked="sortOrder === 'desc'"
          @change="updateSortOrder('desc')" />
        ID：大到小
      </label>
    </div>
  </aside>
</template>

<style scoped>
.category-filter {
  flex: 1;
  border-radius: 16px;
  border: 1px solid #0295db; /* 使用藍色邊框 */
  padding: 20px;
  background-color: #e0e5e9; /* 使用淺灰色背景 */
}

.category-filter h2 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #262626; /* 使用深灰色作為標題顏色 */
}

.category-filter ul {
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
}

.category-filter li {
  border: 1px solid #9d9da1; /* 使用中灰色邊框 */
  border-radius: 16px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 8px;
  text-align: center;
  transition: all 0.3s;
  background-color: #e0e5e9; /* 使用淺灰色背景 */
}

.category-filter li:hover {
  background-color: #0295db; /* 使用藍色作為 hover 效果 */
}

.category-filter li.active {
  background-color: #262626; /* 使用深灰色作為選中效果 */
  color: white;
  font-weight: bold;
}

.sort-order {
  display: flex;
  gap: 16px;
  color: #9d9da1; /* 使用中灰色作為排序文字顏色 */
}

label {
  cursor: pointer;
}

/* RWD 斷點設計 */
@media (max-width: 1024px) {
  .category-filter h2 {
    text-align: center;
  }

  .sort-order {
    flex-direction: column;
    align-items: center;
  }
}
</style>
