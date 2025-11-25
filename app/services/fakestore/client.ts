import { ofetch } from 'ofetch'

/**
 * 建立 Fake Store API 的基礎客戶端
 * 設定了 baseURL 與預設的攔截器
 */
export const fakestoreClient = ofetch.create({
  baseURL: 'https://fakestoreapi.com',
  async onResponseError({ response }) {
    // 統一處理 API 錯誤
    console.error('API Error:', response.status, response._data)
    // 可以在這裡加入錯誤回報邏輯
  },
})

/**
 * 輔助函式：建立查詢字串
 * 過濾掉 undefined 或 null 的參數
 */
export const createQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  const queryString = searchParams.toString()
  return queryString ? `${queryString}` : ''
}
