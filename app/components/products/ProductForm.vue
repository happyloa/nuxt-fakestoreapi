<script setup lang="ts">
import type { CreateProductPayload } from "~/types/fakestore";

interface Props {
  categories?: string[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  loading: false,
});

const emit = defineEmits<{
  (e: "submit", payload: CreateProductPayload): void;
}>();

const form = reactive({
  title: "",
  price: "",
  description: "",
  image: "",
  category: "",
});

const handleSubmit = () => {
  // 欄位皆有原生 required，瀏覽器會在送出前攔截空欄位並聚焦，
  // 因此不需額外的 JS 防呆（原本的靜默 return 會讓使用者「按了沒反應」）
  emit("submit", {
    title: form.title,
    price: Number(form.price),
    description: form.description,
    image: form.image,
    category: form.category,
  });
};
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-6 sm:grid-cols-2">
      <BaseInput
        v-model="form.title"
        :label="$t('products.form.titleLabel')"
        :placeholder="$t('products.form.titlePlaceholder')"
        required />
      <BaseInput
        v-model="form.price"
        type="number"
        inputmode="decimal"
        min="0"
        step="0.01"
        :label="$t('products.form.priceLabel')"
        :placeholder="$t('products.form.pricePlaceholder')"
        required />
    </div>
    <BaseTextarea
      v-model="form.description"
      :label="$t('products.form.descriptionLabel')"
      :placeholder="$t('products.form.descriptionPlaceholder')"
      required />
    <div class="grid gap-6 sm:grid-cols-2">
      <BaseInput
        v-model="form.image"
        type="url"
        inputmode="url"
        autocomplete="off"
        :label="$t('products.form.imageLabel')"
        :placeholder="$t('products.form.imagePlaceholder')"
        required />
      <BaseSelect
        v-model="form.category"
        :label="$t('products.form.categoryLabel')"
        :placeholder="$t('products.form.categoryPlaceholder')"
        :options="
          categories.map((category) => ({ label: category, value: category }))
        "
        required />
    </div>
    <BaseButton type="submit" :loading="loading" block>
      {{ $t("products.form.submit") }}
    </BaseButton>
  </form>
</template>
