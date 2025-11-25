import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import type { Product } from '~/types/fakestore'

/**
 * 統一管理商品列表的過濾邏輯與網址同步。
 * 在頁面與元件之間重複利用，維持資料流的一致性。
 */
export const useProductFilters = (productsSource: () => Product[]) => {
  const route = useRoute()
  const router = useRouter()

  const selectedCategory = ref((route.query.category as string) ?? 'all')
  const sortOrder = ref(((route.query.sort as string) ?? 'asc') === 'desc' ? 'desc' : 'asc')
  const searchQuery = ref((route.query.q as string) ?? '')

  const filteredProducts = computed(() => {
    let items = [...productsSource()]
    if (selectedCategory.value !== 'all') {
      items = items.filter((product) => product.category === selectedCategory.value)
    }
    if (searchQuery.value) {
      const keyword = searchQuery.value.toLowerCase()
      items = items.filter((product) =>
        product.title.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword),
      )
    }
    return items.sort((a, b) =>
      sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id,
    )
  })

  const updateQuery = () => {
    router.replace({
      query: {
        category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
        sort: sortOrder.value === 'desc' ? 'desc' : undefined,
        q: searchQuery.value ? searchQuery.value : undefined,
      },
    })
  }

  watch([selectedCategory, sortOrder, searchQuery], updateQuery)

  const resetFilters = () => {
    selectedCategory.value = 'all'
    sortOrder.value = 'asc'
    searchQuery.value = ''
  }

  return {
    selectedCategory,
    sortOrder,
    searchQuery,
    filteredProducts,
    resetFilters,
  }
}
