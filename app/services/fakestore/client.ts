/**
 * 建立 Fake Store API 的基礎客戶端
 * 使用 Nuxt 的 request-aware fetch，SSR 也能呼叫本站 BFF。
 */
export const fakestoreClient = $fetch.create({
  baseURL: '/api/playground',
  timeout: 10000,
  retry: 0,
})

/**
 * 輔助函式：建立查詢字串
 * 過濾掉 undefined 或 null 的參數
 */
export const createQueryString = (
  params: Record<string, string | number | boolean | null | undefined>,
) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  const queryString = searchParams.toString()
  return queryString
}
