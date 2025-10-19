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

const updateFormField = (field: keyof NewProductPayload, value: string | number) => {
  if (field === 'price') {
    const numeric = typeof value === 'number' ? value : Number(value)
    if (Number.isFinite(numeric)) {
      form.price = numeric
    }
    return
  }
  form[field] = value as any
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
    <ProductCreateHeader />
    <ProductCreateForm
      :form="form"
      :errors="errors"
      :categories="categoryOptions"
      :submitting="submitting"
      :api-error="apiError"
      @update="updateFormField"
      @submit="onSubmit"
    />
    <ProductCreateSuccess v-if="result" :id="result.id" />
  </section>
</template>
