/** API 操作台的請求都經過本站受限的 /api/playground proxy。 */
export const fakestoreClient = $fetch.create({
  baseURL: '/api/playground',
  timeout: 10000,
  retry: 0,
})

export type UpdateMethod = 'PUT' | 'PATCH'

/** 建立查詢字串，略過 undefined 與 null 的參數 */
export const createQueryString = (
  params: Record<string, string | number | boolean | null | undefined>,
) => {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) searchParams.append(key, String(value))
  }
  return searchParams.toString()
}
