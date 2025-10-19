<script setup lang="ts">
import { z } from 'zod'
import { useFakeStoreClient } from '~/composables/useFakeStoreClient'
import type { NewProductPayload, Product } from '~/types/fakestore'

const client = useFakeStoreClient()
const { t } = useI18n()
const router = useRouter()

const { data: categories } = await useAsyncData('categories-new', () => client.getCategories())
const categoryOptions = computed(() => categories.value ?? [])

const schema = z.object({
  title: z.string().min(3),
  price: z.number().min(1),
  description: z.string().min(10),
  image: z.string().url(),
  category: z.string().min(1),
})

const form = reactive<NewProductPayload>({
  title: '',
  price: 1,
  description: '',
  image: '',
  category: '',
})

const errors = reactive<Record<keyof NewProductPayload, string>>({
  title: '',
  price: '',
  description: '',
  image: '',
  category: '',
})

const submitting = ref(false)
const result = ref<Product | null>(null)
const apiError = ref('')

const validate = () => {
  const parsed = schema.safeParse({ ...form })
  Object.keys(errors).forEach((key) => {
    errors[key as keyof NewProductPayload] = ''
  })
  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof NewProductPayload
      errors[field] = issue.message
    })
    return false
  }
  return true
}

const onSubmit = async () => {
  apiError.value = ''
  result.value = null
  if (!validate()) return
  submitting.value = true
  try {
    const created = await client.createProduct({ ...form })
    result.value = created
    await router.push(`/products/${created.id}`)
  } catch (error: any) {
    apiError.value = error?.message || 'Unable to create product'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-4">
      <p class="text-sm font-semibold uppercase tracking-wide text-primary-600">{{ t('createProduct.badge') }}</p>
      <h1 class="text-3xl font-bold text-slate-900">{{ t('createProduct.title') }}</h1>
      <p class="text-slate-600">{{ t('createProduct.subtitle') }}</p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-2">
        <label class="space-y-2">
          <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.title') }}</span>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
            :placeholder="t('createProduct.placeholders.title')"
          />
          <span v-if="errors.title" class="text-xs text-red-500">{{ errors.title }}</span>
        </label>

        <label class="space-y-2">
          <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.price') }}</span>
          <input
            v-model.number="form.price"
            type="number"
            min="1"
            step="0.01"
            class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
            :placeholder="t('createProduct.placeholders.price')"
          />
          <span v-if="errors.price" class="text-xs text-red-500">{{ errors.price }}</span>
        </label>
      </div>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.image') }}</span>
        <input
          v-model="form.image"
          type="url"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          :placeholder="t('createProduct.placeholders.image')"
        />
        <span v-if="errors.image" class="text-xs text-red-500">{{ errors.image }}</span>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.category') }}</span>
        <select
          v-model="form.category"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="" disabled>{{ t('createProduct.placeholders.category') }}</option>
          <option v-for="option in categoryOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span v-if="errors.category" class="text-xs text-red-500">{{ errors.category }}</span>
      </label>

      <label class="space-y-2">
        <span class="text-sm font-semibold text-slate-700">{{ t('createProduct.fields.description') }}</span>
        <textarea
          v-model="form.description"
          rows="6"
          class="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
          :placeholder="t('createProduct.placeholders.description')"
        />
        <span v-if="errors.description" class="text-xs text-red-500">{{ errors.description }}</span>
      </label>

      <div v-if="apiError" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {{ apiError }}
      </div>

      <div class="flex items-center justify-between">
        <NuxtLink to="/products" class="text-sm font-semibold text-slate-500 hover:text-slate-700">
          {{ t('actions.cancel') }}
        </NuxtLink>
        <button
          type="submit"
          class="link-button px-6 text-base"
          :disabled="submitting"
        >
          <span v-if="submitting" class="flex items-center gap-2">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
            {{ t('createProduct.actions.creating') }}
          </span>
          <span v-else>
            {{ t('createProduct.actions.submit') }}
          </span>
        </button>
      </div>
    </form>

    <div v-if="result" class="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-sm text-emerald-700">
      {{ t('createProduct.success', { id: result.id }) }}
    </div>
  </section>
</template>
