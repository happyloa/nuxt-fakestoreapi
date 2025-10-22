<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CreateProductPayload } from '~/types/fakestore'
import { useProductsStore } from '~/stores/products'

const productsStore = useProductsStore()
const { t } = useI18n()
const successMessage = ref('')
const formKey = ref(0)

await productsStore.fetchCategories()

const handleSubmit = async (payload: CreateProductPayload) => {
  successMessage.value = ''
  try {
    const created = await productsStore.createProduct(payload)
    successMessage.value = `${created.title} ${t('products.form.successSuffix')}`
    formKey.value += 1
  } catch (error) {
    // error handled by store
  }
}

useSeoMeta({
  title: 'Create Product | Fake Store Dashboard',
  description: 'Create a new Fake Store API product with full metadata.',
  ogTitle: 'Create Product | Fake Store Dashboard',
  ogDescription: 'Create a new Fake Store API product with full metadata.',
})
</script>

<template>
  <div class="space-y-8">
    <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-brand">
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
      </svg>
      {{ $t('products.form.back') }}
    </NuxtLink>

    <BaseSectionHeading
      :title="$t('products.form.heading')"
      :description="$t('products.form.subheading')"
    />

    <ProductForm
      :key="formKey"
      :categories="productsStore.categories"
      :loading="productsStore.loading"
      @submit="handleSubmit"
    />

    <BaseAlert v-if="productsStore.error" variant="error">
      {{ productsStore.error }}
    </BaseAlert>

    <BaseAlert v-else-if="successMessage" variant="success">
      {{ successMessage }}
    </BaseAlert>
  </div>
</template>
