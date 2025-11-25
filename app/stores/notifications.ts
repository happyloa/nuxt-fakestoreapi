import { defineStore } from 'pinia'

export interface Toast {
  id: string
  message: string
  variant: 'success' | 'error' | 'info'
  duration?: number
}

/**
 * 通知系統 Store
 * 管理全域的 Toast 通知訊息
 */
export const useNotificationsStore = defineStore('notifications', () => {
  const toasts = ref<Toast[]>([])

  /**
   * 新增一則通知
   * @param toast 通知內容物件
   */
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    const newToast = { ...toast, id }
    toasts.value.push(newToast)

    // 如果有設定持續時間，則自動移除
    if (toast.duration !== 0) {
      setTimeout(() => {
        remove(id)
      }, toast.duration || 3000)
    }
  }

  /**
   * 移除指定 ID 的通知
   * @param id 通知 ID
   */
  const remove = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  /**
   * 顯示成功通知
   * @param message 訊息內容
   * @param duration 持續時間 (毫秒)
   */
  const success = (message: string, duration?: number) => {
    add({ message, variant: 'success', duration })
  }

  /**
   * 顯示錯誤通知
   * @param message 訊息內容
   * @param duration 持續時間 (毫秒)
   */
  const error = (message: string, duration?: number) => {
    add({ message, variant: 'error', duration })
  }

  /**
   * 顯示一般資訊通知
   * @param message 訊息內容
   * @param duration 持續時間 (毫秒)
   */
  const info = (message: string, duration?: number) => {
    add({ message, variant: 'info', duration })
  }

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info,
  }
})
