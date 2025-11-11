<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductsStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'
import { useUsersStore } from '~/stores/users'
import { useNotificationsStore } from '~/stores/notifications'
import type {
  Product,
  Cart,
  User,
  UpdateProductPayload,
  UpdateCartPayload,
  CreateCartPayload,
  CreateUserPayload,
  UpdateUserPayload,
} from '~/types/fakestore'

/**
 * API Playground 頁面，集中展示 Fake Store API 的全部操作。
 * 讓訪客可以實際操作 CRUD，作為作品集的亮點之一。
 */
const { t } = useI18n()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const usersStore = useUsersStore()
const notifications = useNotificationsStore()

await productsStore.fetchCategories()

useSeoMeta({
  title: 'API Playground | Fake Store Dashboard',
  description:
    'Experiment with every Fake Store API endpoint directly from the dashboard.',
  ogTitle: 'API Playground | Fake Store Dashboard',
  ogDescription:
    'Experiment with every Fake Store API endpoint directly from the dashboard.',
})

const productQueryForm = reactive({
  category: 'all',
  limit: 6,
  sort: 'asc' as 'asc' | 'desc',
})
const productQueryState = reactive({
  loading: false,
  error: '',
  success: '',
  result: [] as Product[],
})
const handleProductQuery = async () => {
  productQueryState.loading = true
  productQueryState.error = ''
  productQueryState.success = ''
  try {
    const result = await productsStore.queryProducts({
      category: productQueryForm.category,
      limit: productQueryForm.limit,
      sort: productQueryForm.sort,
    })
    productQueryState.result = result
    productQueryState.success = t('api.products.querySuccess', {
      count: result.length,
    })
  } catch (error: any) {
    productQueryState.error = error?.message ?? t('api.errors.generic')
  } finally {
    productQueryState.loading = false
  }
}

const productByIdForm = reactive({ id: '' })
const productByIdState = reactive({
  loading: false,
  error: '',
  result: null as Product | null,
})
const handleProductById = async () => {
  if (!productByIdForm.id) {
    productByIdState.error = t('api.errors.idRequired')
    return
  }
  productByIdState.loading = true
  productByIdState.error = ''
  productByIdState.result = null
  try {
    const product = await productsStore.fetchProductById(Number(productByIdForm.id))
    productByIdState.result = product
  } catch (error: any) {
    productByIdState.error = error?.message ?? t('api.errors.generic')
  } finally {
    productByIdState.loading = false
  }
}

const productUpdateForm = reactive({
  id: '',
  payload: '{\n  "title": "Updated title"\n}',
})
const productUpdateState = reactive({
  loading: false,
  error: '',
  success: '',
  result: null as Product | null,
})
const handleProductUpdate = async () => {
  if (!productUpdateForm.id) {
    productUpdateState.error = t('api.errors.idRequired')
    return
  }
  let parsed: UpdateProductPayload
  try {
    parsed = JSON.parse(productUpdateForm.payload)
  } catch (error: any) {
    productUpdateState.error = t('api.errors.invalidJson')
    return
  }
  productUpdateState.loading = true
  productUpdateState.error = ''
  productUpdateState.success = ''
  try {
    const updated = await productsStore.updateProduct(Number(productUpdateForm.id), parsed)
    productUpdateState.result = updated
    productUpdateState.success = t('api.products.updateSuccess', {
      id: updated.id,
    })
    notifications.success(
      t('notifications.productUpdated', { title: updated.title }),
    )
  } catch (error: any) {
    productUpdateState.error = error?.message ?? t('api.errors.generic')
  } finally {
    productUpdateState.loading = false
  }
}

const productDeleteForm = reactive({ id: '' })
const productDeleteState = reactive({
  loading: false,
  error: '',
  success: '',
})
const handleProductDelete = async () => {
  if (!productDeleteForm.id) {
    productDeleteState.error = t('api.errors.idRequired')
    return
  }
  productDeleteState.loading = true
  productDeleteState.error = ''
  productDeleteState.success = ''
  try {
    await productsStore.deleteProduct(Number(productDeleteForm.id))
    productDeleteState.success = t('api.products.deleteSuccess', {
      id: productDeleteForm.id,
    })
    notifications.info(
      t('notifications.productDeleted', { id: productDeleteForm.id }),
    )
  } catch (error: any) {
    productDeleteState.error = error?.message ?? t('api.errors.generic')
  } finally {
    productDeleteState.loading = false
  }
}

const cartQueryForm = reactive({
  limit: 5,
  sort: 'desc' as 'asc' | 'desc',
  startDate: '',
  endDate: '',
})
const cartQueryState = reactive({
  loading: false,
  error: '',
  success: '',
  result: [] as Cart[],
})
const handleCartsQuery = async () => {
  cartQueryState.loading = true
  cartQueryState.error = ''
  cartQueryState.success = ''
  try {
    const result = await cartStore.fetchAllCarts({
      limit: cartQueryForm.limit || undefined,
      sort: cartQueryForm.sort,
      startDate: cartQueryForm.startDate || undefined,
      endDate: cartQueryForm.endDate || undefined,
    })
    cartQueryState.result = result
    cartQueryState.success = t('api.carts.querySuccess', {
      count: result.length,
    })
  } catch (error: any) {
    cartQueryState.error = error?.message ?? t('api.errors.generic')
  } finally {
    cartQueryState.loading = false
  }
}

const cartByIdForm = reactive({ id: '' })
const cartByIdState = reactive({
  loading: false,
  error: '',
  result: null as Cart | null,
})
const handleCartById = async () => {
  if (!cartByIdForm.id) {
    cartByIdState.error = t('api.errors.idRequired')
    return
  }
  cartByIdState.loading = true
  cartByIdState.error = ''
  cartByIdState.result = null
  try {
    const cart = await cartStore.fetchCartById(Number(cartByIdForm.id))
    cartByIdState.result = cart
  } catch (error: any) {
    cartByIdState.error = error?.message ?? t('api.errors.generic')
  } finally {
    cartByIdState.loading = false
  }
}

const cartByUserForm = reactive({ userId: '' })
const cartByUserState = reactive({
  loading: false,
  error: '',
  result: [] as Cart[],
})
const handleCartByUser = async () => {
  if (!cartByUserForm.userId) {
    cartByUserState.error = t('api.errors.userIdRequired')
    return
  }
  cartByUserState.loading = true
  cartByUserState.error = ''
  cartByUserState.result = []
  try {
    const carts = await cartStore.fetchCartsByUser(Number(cartByUserForm.userId))
    cartByUserState.result = carts
  } catch (error: any) {
    cartByUserState.error = error?.message ?? t('api.errors.generic')
  } finally {
    cartByUserState.loading = false
  }
}

const cartCreateForm = ref(
  JSON.stringify(
    {
      userId: 1,
      date: new Date().toISOString(),
      products: [
        { productId: 1, quantity: 1 },
      ],
    } as CreateCartPayload,
    null,
    2,
  ),
)
const cartCreateState = reactive({
  loading: false,
  error: '',
  success: '',
  result: null as Cart | null,
})
const handleCartCreate = async () => {
  let payload: CreateCartPayload
  try {
    payload = JSON.parse(cartCreateForm.value)
  } catch (error: any) {
    cartCreateState.error = t('api.errors.invalidJson')
    return
  }
  cartCreateState.loading = true
  cartCreateState.error = ''
  cartCreateState.success = ''
  try {
    const created = await cartStore.createRemoteCart(payload)
    cartCreateState.result = created
    cartCreateState.success = t('api.carts.createSuccess', { id: created.id })
    notifications.success(
      t('notifications.cartCreated', { id: created.id }),
    )
  } catch (error: any) {
    cartCreateState.error = error?.message ?? t('api.errors.generic')
  } finally {
    cartCreateState.loading = false
  }
}

const cartUpdateForm = reactive({
  id: '',
  payload: '{\n  "products": [{ "productId": 1, "quantity": 2 }]\n}',
})
const cartUpdateState = reactive({
  loading: false,
  error: '',
  success: '',
  result: null as Cart | null,
})
const handleCartUpdate = async () => {
  if (!cartUpdateForm.id) {
    cartUpdateState.error = t('api.errors.idRequired')
    return
  }
  let payload: UpdateCartPayload
  try {
    payload = JSON.parse(cartUpdateForm.payload)
  } catch (error: any) {
    cartUpdateState.error = t('api.errors.invalidJson')
    return
  }
  cartUpdateState.loading = true
  cartUpdateState.error = ''
  cartUpdateState.success = ''
  try {
    const updated = await cartStore.updateRemoteCart(Number(cartUpdateForm.id), payload)
    cartUpdateState.result = updated
    cartUpdateState.success = t('api.carts.updateSuccess', { id: updated.id })
    notifications.info(
      t('notifications.cartPatched', { id: updated.id }),
    )
  } catch (error: any) {
    cartUpdateState.error = error?.message ?? t('api.errors.generic')
  } finally {
    cartUpdateState.loading = false
  }
}

const cartDeleteForm = reactive({ id: '' })
const cartDeleteState = reactive({
  loading: false,
  error: '',
  success: '',
})
const handleCartDelete = async () => {
  if (!cartDeleteForm.id) {
    cartDeleteState.error = t('api.errors.idRequired')
    return
  }
  cartDeleteState.loading = true
  cartDeleteState.error = ''
  cartDeleteState.success = ''
  try {
    await cartStore.deleteRemoteCart(Number(cartDeleteForm.id))
    cartDeleteState.success = t('api.carts.deleteSuccess', { id: cartDeleteForm.id })
    notifications.info(
      t('notifications.cartRemoved', { id: cartDeleteForm.id }),
    )
  } catch (error: any) {
    cartDeleteState.error = error?.message ?? t('api.errors.generic')
  } finally {
    cartDeleteState.loading = false
  }
}

const userByIdForm = reactive({ id: '' })
const userByIdState = reactive({
  loading: false,
  error: '',
  result: null as User | null,
})
const handleUserById = async () => {
  if (!userByIdForm.id) {
    userByIdState.error = t('api.errors.idRequired')
    return
  }
  userByIdState.loading = true
  userByIdState.error = ''
  userByIdState.result = null
  try {
    const user = await usersStore.fetchUserById(Number(userByIdForm.id))
    userByIdState.result = user
  } catch (error: any) {
    userByIdState.error = error?.message ?? t('api.errors.generic')
  } finally {
    userByIdState.loading = false
  }
}

const userCreateForm = ref(
  JSON.stringify(
    {
      email: 'new.user@example.com',
      username: 'new_user',
      password: 'password123',
      name: { firstname: 'New', lastname: 'User' },
      address: {
        city: 'Taipei',
        street: 'Main Street',
        number: 1,
        zipcode: '100',
        geolocation: { lat: '0', long: '0' },
      },
      phone: '02-12345678',
    } as CreateUserPayload,
    null,
    2,
  ),
)
const userCreateState = reactive({
  loading: false,
  error: '',
  success: '',
  result: null as User | null,
})
const handleUserCreate = async () => {
  let payload: CreateUserPayload
  try {
    payload = JSON.parse(userCreateForm.value)
  } catch (error: any) {
    userCreateState.error = t('api.errors.invalidJson')
    return
  }
  userCreateState.loading = true
  userCreateState.error = ''
  userCreateState.success = ''
  try {
    const created = await usersStore.createUser(payload)
    userCreateState.result = created
    userCreateState.success = t('api.users.createSuccess', {
      username: created.username,
    })
    notifications.success(
      t('notifications.userCreated', { username: created.username }),
    )
  } catch (error: any) {
    userCreateState.error = error?.message ?? t('api.errors.generic')
  } finally {
    userCreateState.loading = false
  }
}

const userUpdateForm = reactive({
  id: '',
  payload: '{\n  "phone": "02-8888888"\n}',
})
const userUpdateState = reactive({
  loading: false,
  error: '',
  success: '',
  result: null as User | null,
})
const handleUserUpdate = async () => {
  if (!userUpdateForm.id) {
    userUpdateState.error = t('api.errors.idRequired')
    return
  }
  let payload: UpdateUserPayload
  try {
    payload = JSON.parse(userUpdateForm.payload)
  } catch (error: any) {
    userUpdateState.error = t('api.errors.invalidJson')
    return
  }
  userUpdateState.loading = true
  userUpdateState.error = ''
  userUpdateState.success = ''
  try {
    const updated = await usersStore.updateUser(Number(userUpdateForm.id), payload)
    userUpdateState.result = updated
    userUpdateState.success = t('api.users.updateSuccess', { id: updated.id })
    notifications.info(
      t('notifications.userUpdated', { username: updated.username }),
    )
  } catch (error: any) {
    userUpdateState.error = error?.message ?? t('api.errors.generic')
  } finally {
    userUpdateState.loading = false
  }
}

const userDeleteForm = reactive({ id: '' })
const userDeleteState = reactive({
  loading: false,
  error: '',
  success: '',
})
const handleUserDelete = async () => {
  if (!userDeleteForm.id) {
    userDeleteState.error = t('api.errors.idRequired')
    return
  }
  userDeleteState.loading = true
  userDeleteState.error = ''
  userDeleteState.success = ''
  try {
    await usersStore.deleteUser(Number(userDeleteForm.id))
    userDeleteState.success = t('api.users.deleteSuccess', { id: userDeleteForm.id })
    notifications.info(
      t('notifications.userDeleted', { id: userDeleteForm.id }),
    )
  } catch (error: any) {
    userDeleteState.error = error?.message ?? t('api.errors.generic')
  } finally {
    userDeleteState.loading = false
  }
}
</script>

<template>
  <div class="space-y-12">
    <BaseSectionHeading
      :title="$t('api.title')"
      :description="$t('api.subtitle')"
    />

    <section class="space-y-6">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
        {{ $t('api.products.title') }}
      </h2>
      <div class="grid gap-6 lg:grid-cols-2">
        <ApiOperationCard
          :title="$t('api.products.queryTitle')"
          :description="$t('api.products.queryDescription')"
          :loading="productQueryState.loading"
          :error="productQueryState.error"
          :success-message="productQueryState.success"
        >
          <form class="space-y-4" @submit.prevent="handleProductQuery">
            <div class="grid gap-4 sm:grid-cols-2">
              <BaseSelect
                v-model="productQueryForm.category"
                :label="$t('api.products.fields.category')"
                :options="[
                  { label: $t('products.filters.allCategories'), value: 'all' },
                  ...productsStore.categories.map((category) => ({
                    label: category,
                    value: category,
                  })),
                ]"
              />
              <BaseInput
                v-model.number="productQueryForm.limit"
                type="number"
                min="1"
                max="20"
                :label="$t('api.products.fields.limit')"
                required
              />
            </div>
            <BaseSelect
              v-model="productQueryForm.sort"
              :label="$t('api.products.fields.sort')"
              :options="[
                { label: $t('products.filters.sortAsc'), value: 'asc' },
                { label: $t('products.filters.sortDesc'), value: 'desc' },
              ]"
            />
            <BaseButton type="submit" :loading="productQueryState.loading">
              {{ $t('api.actions.runQuery') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="productQueryState.result.length"
              :label="$t('api.results.preview')"
              :value="productQueryState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.products.singleTitle')"
          :description="$t('api.products.singleDescription')"
          :loading="productByIdState.loading"
          :error="productByIdState.error"
        >
          <form class="space-y-4" @submit.prevent="handleProductById">
            <BaseInput
              v-model="productByIdForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.productId')"
              required
            />
            <BaseButton type="submit" :loading="productByIdState.loading">
              {{ $t('api.actions.fetch') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="productByIdState.result"
              :label="$t('api.results.response')"
              :value="productByIdState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.products.updateTitle')"
          :description="$t('api.products.updateDescription')"
          :loading="productUpdateState.loading"
          :error="productUpdateState.error"
          :success-message="productUpdateState.success"
        >
          <form class="space-y-4" @submit.prevent="handleProductUpdate">
            <BaseInput
              v-model="productUpdateForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.productId')"
              required
            />
            <BaseTextarea
              v-model="productUpdateForm.payload"
              :label="$t('api.fields.payload')"
              rows="6"
            />
            <BaseButton type="submit" :loading="productUpdateState.loading">
              {{ $t('api.actions.update') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="productUpdateState.result"
              :label="$t('api.results.response')"
              :value="productUpdateState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.products.deleteTitle')"
          :description="$t('api.products.deleteDescription')"
          :loading="productDeleteState.loading"
          :error="productDeleteState.error"
          :success-message="productDeleteState.success"
        >
          <form class="space-y-4" @submit.prevent="handleProductDelete">
            <BaseInput
              v-model="productDeleteForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.productId')"
              required
            />
            <BaseButton type="submit" :loading="productDeleteState.loading" variant="outline">
              {{ $t('api.actions.delete') }}
            </BaseButton>
          </form>
        </ApiOperationCard>
      </div>
    </section>

    <section class="space-y-6">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
        {{ $t('api.carts.title') }}
      </h2>
      <div class="grid gap-6 lg:grid-cols-2">
        <ApiOperationCard
          :title="$t('api.carts.queryTitle')"
          :description="$t('api.carts.queryDescription')"
          :loading="cartQueryState.loading"
          :error="cartQueryState.error"
          :success-message="cartQueryState.success"
        >
          <form class="space-y-4" @submit.prevent="handleCartsQuery">
            <div class="grid gap-4 sm:grid-cols-2">
              <BaseInput
                v-model.number="cartQueryForm.limit"
                type="number"
                min="1"
                max="20"
                :label="$t('api.carts.fields.limit')"
              />
              <BaseSelect
                v-model="cartQueryForm.sort"
                :label="$t('api.carts.fields.sort')"
                :options="[
                  { label: $t('products.filters.sortAsc'), value: 'asc' },
                  { label: $t('products.filters.sortDesc'), value: 'desc' },
                ]"
              />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <BaseInput
                v-model="cartQueryForm.startDate"
                type="date"
                :label="$t('api.carts.fields.startDate')"
              />
              <BaseInput
                v-model="cartQueryForm.endDate"
                type="date"
                :label="$t('api.carts.fields.endDate')"
              />
            </div>
            <BaseButton type="submit" :loading="cartQueryState.loading">
              {{ $t('api.actions.runQuery') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="cartQueryState.result.length"
              :label="$t('api.results.preview')"
              :value="cartQueryState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.carts.singleTitle')"
          :description="$t('api.carts.singleDescription')"
          :loading="cartByIdState.loading"
          :error="cartByIdState.error"
        >
          <form class="space-y-4" @submit.prevent="handleCartById">
            <BaseInput
              v-model="cartByIdForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.cartId')"
              required
            />
            <BaseButton type="submit" :loading="cartByIdState.loading">
              {{ $t('api.actions.fetch') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="cartByIdState.result"
              :label="$t('api.results.response')"
              :value="cartByIdState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.carts.userTitle')"
          :description="$t('api.carts.userDescription')"
          :loading="cartByUserState.loading"
          :error="cartByUserState.error"
        >
          <form class="space-y-4" @submit.prevent="handleCartByUser">
            <BaseInput
              v-model="cartByUserForm.userId"
              type="number"
              min="1"
              :label="$t('api.fields.userId')"
              required
            />
            <BaseButton type="submit" :loading="cartByUserState.loading">
              {{ $t('api.actions.fetch') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="cartByUserState.result.length"
              :label="$t('api.results.response')"
              :value="cartByUserState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.carts.createTitle')"
          :description="$t('api.carts.createDescription')"
          :loading="cartCreateState.loading"
          :error="cartCreateState.error"
          :success-message="cartCreateState.success"
        >
          <form class="space-y-4" @submit.prevent="handleCartCreate">
            <BaseTextarea
              v-model="cartCreateForm"
              :label="$t('api.fields.payload')"
              rows="6"
            />
            <BaseButton type="submit" :loading="cartCreateState.loading">
              {{ $t('api.actions.create') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="cartCreateState.result"
              :label="$t('api.results.response')"
              :value="cartCreateState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.carts.updateTitle')"
          :description="$t('api.carts.updateDescription')"
          :loading="cartUpdateState.loading"
          :error="cartUpdateState.error"
          :success-message="cartUpdateState.success"
        >
          <form class="space-y-4" @submit.prevent="handleCartUpdate">
            <BaseInput
              v-model="cartUpdateForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.cartId')"
              required
            />
            <BaseTextarea
              v-model="cartUpdateForm.payload"
              :label="$t('api.fields.payload')"
              rows="6"
            />
            <BaseButton type="submit" :loading="cartUpdateState.loading">
              {{ $t('api.actions.update') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="cartUpdateState.result"
              :label="$t('api.results.response')"
              :value="cartUpdateState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.carts.deleteTitle')"
          :description="$t('api.carts.deleteDescription')"
          :loading="cartDeleteState.loading"
          :error="cartDeleteState.error"
          :success-message="cartDeleteState.success"
        >
          <form class="space-y-4" @submit.prevent="handleCartDelete">
            <BaseInput
              v-model="cartDeleteForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.cartId')"
              required
            />
            <BaseButton type="submit" :loading="cartDeleteState.loading" variant="outline">
              {{ $t('api.actions.delete') }}
            </BaseButton>
          </form>
        </ApiOperationCard>
      </div>
    </section>

    <section class="space-y-6">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
        {{ $t('api.users.title') }}
      </h2>
      <div class="grid gap-6 lg:grid-cols-2">
        <ApiOperationCard
          :title="$t('api.users.singleTitle')"
          :description="$t('api.users.singleDescription')"
          :loading="userByIdState.loading"
          :error="userByIdState.error"
        >
          <form class="space-y-4" @submit.prevent="handleUserById">
            <BaseInput
              v-model="userByIdForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.userId')"
              required
            />
            <BaseButton type="submit" :loading="userByIdState.loading">
              {{ $t('api.actions.fetch') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="userByIdState.result"
              :label="$t('api.results.response')"
              :value="userByIdState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.users.createTitle')"
          :description="$t('api.users.createDescription')"
          :loading="userCreateState.loading"
          :error="userCreateState.error"
          :success-message="userCreateState.success"
        >
          <form class="space-y-4" @submit.prevent="handleUserCreate">
            <BaseTextarea
              v-model="userCreateForm"
              :label="$t('api.fields.payload')"
              rows="8"
            />
            <BaseButton type="submit" :loading="userCreateState.loading">
              {{ $t('api.actions.create') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="userCreateState.result"
              :label="$t('api.results.response')"
              :value="userCreateState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.users.updateTitle')"
          :description="$t('api.users.updateDescription')"
          :loading="userUpdateState.loading"
          :error="userUpdateState.error"
          :success-message="userUpdateState.success"
        >
          <form class="space-y-4" @submit.prevent="handleUserUpdate">
            <BaseInput
              v-model="userUpdateForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.userId')"
              required
            />
            <BaseTextarea
              v-model="userUpdateForm.payload"
              :label="$t('api.fields.payload')"
              rows="6"
            />
            <BaseButton type="submit" :loading="userUpdateState.loading">
              {{ $t('api.actions.update') }}
            </BaseButton>
          </form>
          <template #footer>
            <ApiResultViewer
              v-if="userUpdateState.result"
              :label="$t('api.results.response')"
              :value="userUpdateState.result"
            />
          </template>
        </ApiOperationCard>

        <ApiOperationCard
          :title="$t('api.users.deleteTitle')"
          :description="$t('api.users.deleteDescription')"
          :loading="userDeleteState.loading"
          :error="userDeleteState.error"
          :success-message="userDeleteState.success"
        >
          <form class="space-y-4" @submit.prevent="handleUserDelete">
            <BaseInput
              v-model="userDeleteForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.userId')"
              required
            />
            <BaseButton type="submit" :loading="userDeleteState.loading" variant="outline">
              {{ $t('api.actions.delete') }}
            </BaseButton>
          </form>
        </ApiOperationCard>
      </div>
    </section>
  </div>
</template>
