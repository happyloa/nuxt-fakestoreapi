<script setup lang="ts">
import type { NewProductPayload } from '~/types/fakestore'

const props = defineProps<{
  form: NewProductPayload
  errors: Record<keyof NewProductPayload, string>
  categories: string[]
  submitting: boolean
  apiError: string
}>()

const emit = defineEmits<{
  (e: 'update', field: keyof NewProductPayload, value: string | number): void
  (e: 'submit'): void
}>()

const { t } = useI18n()

const updateField = (field: keyof NewProductPayload, value: string | number) => {
  emit('update', field, value)
}
</script>

<template>
  <form class="mt-8 space-y-6" @submit.prevent="emit('submit')">
    <div class="grid gap-6 lg:grid-cols-2">
      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.title') }}</span>
        <input
          :value="props.form.title"
          type="text"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          :placeholder="t('createProduct.placeholders.title')"
          @input="updateField('title', ($event.target as HTMLInputElement).value)"
        />
        <span v-if="props.errors.title" class="text-xs text-red-500">{{ props.errors.title }}</span>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.price') }}</span>
        <input
          :value="props.form.price"
          type="number"
          min="1"
          step="0.01"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          :placeholder="t('createProduct.placeholders.price')"
          @input="updateField('price', Number(($event.target as HTMLInputElement).value))"
        />
        <span v-if="props.errors.price" class="text-xs text-red-500">{{ props.errors.price }}</span>
      </label>
    </div>

    <label class="space-y-2">
      <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.image') }}</span>
      <input
        :value="props.form.image"
        type="url"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        :placeholder="t('createProduct.placeholders.image')"
        @input="updateField('image', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="props.errors.image" class="text-xs text-red-500">{{ props.errors.image }}</span>
    </label>

    <label class="space-y-2">
      <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.category') }}</span>
      <select
        :value="props.form.category"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        @change="updateField('category', ($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled>{{ t('createProduct.placeholders.category') }}</option>
        <option v-for="option in props.categories" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <span v-if="props.errors.category" class="text-xs text-red-500">{{ props.errors.category }}</span>
    </label>

    <label class="space-y-2">
      <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.description') }}</span>
      <textarea
        :value="props.form.description"
        rows="6"
        class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        :placeholder="t('createProduct.placeholders.description')"
        @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
      />
      <span v-if="props.errors.description" class="text-xs text-red-500">{{ props.errors.description }}</span>
    </label>

    <div v-if="props.apiError" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {{ props.apiError }}
    </div>

    <div class="flex items-center justify-between">
      <NuxtLink to="/products" class="text-sm font-semibold text-slate-500 hover:text-slate-700">
        {{ t('actions.cancel') }}
      </NuxtLink>
      <button
        type="submit"
        class="link-button px-6 text-base"
        :disabled="props.submitting"
      >
        <span v-if="props.submitting" class="flex items-center gap-2">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
          {{ t('createProduct.actions.creating') }}
        </span>
        <span v-else>
          {{ t('createProduct.actions.submit') }}
        </span>
      </button>
    </div>
  </form>
</template>
