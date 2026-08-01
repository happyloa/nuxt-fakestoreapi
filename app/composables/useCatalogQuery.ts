import type { Product } from "~/types/storefront"

type SortOrder = "featured" | "price-asc" | "price-desc"

const asSingleValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === "string") ?? ""
  }

  return typeof value === "string" ? value : ""
}

const isSortOrder = (value: string): value is SortOrder =>
  ["featured", "price-asc", "price-desc"].includes(value)

export const useCatalogQuery = (products: MaybeRef<Product[]>) => {
  const route = useRoute()
  const router = useRouter()
  const search = ref("")
  const category = ref("all")
  const sort = ref<SortOrder>("featured")
  let updateTimer: ReturnType<typeof setTimeout> | undefined
  let isSyncingFromRoute = false

  const syncFromRoute = () => {
    isSyncingFromRoute = true
    const requestedSort = asSingleValue(route.query.sort)
    search.value = asSingleValue(route.query.q)
    category.value = asSingleValue(route.query.category) || "all"
    sort.value = isSortOrder(requestedSort) ? requestedSort : "featured"
    nextTick(() => {
      isSyncingFromRoute = false
    })
  }

  syncFromRoute()

  const updateRoute = () => {
    router.replace({
      query: {
        q: search.value.trim() || undefined,
        category: category.value !== "all" ? category.value : undefined,
        sort: sort.value !== "featured" ? sort.value : undefined,
      },
    })
  }

  const queueRouteUpdate = () => {
    if (isSyncingFromRoute) return
    if (updateTimer) clearTimeout(updateTimer)
    updateTimer = setTimeout(updateRoute, 220)
  }

  watch(() => route.fullPath, syncFromRoute)
  watch([search, category, sort], queueRouteUpdate)
  onScopeDispose(() => {
    if (updateTimer) clearTimeout(updateTimer)
  })

  const results = computed(() => {
    const keyword = search.value.trim().toLocaleLowerCase()
    const filtered = unref(products).filter((product) => {
      const matchesCategory =
        category.value === "all" || product.category === category.value
      const searchable = `${product.title} ${product.description}`.toLocaleLowerCase()
      return matchesCategory && (!keyword || searchable.includes(keyword))
    })

    return filtered.toSorted((left, right) => {
      if (sort.value === "price-asc") return left.price - right.price
      if (sort.value === "price-desc") return right.price - left.price
      return left.id - right.id
    })
  })

  const hasActiveFilters = computed(
    () => !!search.value.trim() || category.value !== "all" || sort.value !== "featured",
  )

  const clearFilters = () => {
    search.value = ""
    category.value = "all"
    sort.value = "featured"
  }

  return {
    search,
    category,
    sort,
    results,
    hasActiveFilters,
    clearFilters,
  }
}
