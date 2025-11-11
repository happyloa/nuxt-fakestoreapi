import { ofetch } from 'ofetch'

/**
 * 假資料商店 API 的統一請求工具。
 * 透過集中定義，可以確保錯誤處理與基礎設定一致，
 * 並且在日後需要掛載攔截器或 Token 時只需要修改這裡。
 */
export const fakestoreClient = async <T>(
  path: string,
  options: Parameters<typeof ofetch>[1] = {},
) => {
  return ofetch<T>(path, {
    baseURL: 'https://fakestoreapi.com',
    retry: 1,
    timeout: 10_000,
    ...options,
  })
}

/**
 * 方便在客製化查詢時產生查詢字串。
 * 使用 URLSearchParams 可以自動處理編碼與型別轉換。
 */
export const createQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) {
      return
    }
    searchParams.set(key, String(value))
  })
  return searchParams.toString()
}
