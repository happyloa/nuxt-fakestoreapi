import { defineStore } from 'pinia'

type ToastVariant = 'success' | 'info' | 'error'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
  timeout: number
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    toasts: [] as ToastItem[],
    counter: 0,
  }),
  actions: {
    push(message: string, variant: ToastVariant = 'info', timeout = 4000) {
      const id = ++this.counter
      this.toasts.push({ id, message, variant, timeout })
      if (timeout > 0) {
        setTimeout(() => this.remove(id), timeout)
      }
      return id
    },
    success(message: string, timeout?: number) {
      return this.push(message, 'success', timeout)
    },
    info(message: string, timeout?: number) {
      return this.push(message, 'info', timeout)
    },
    error(message: string, timeout?: number) {
      return this.push(message, 'error', timeout)
    },
    remove(id: number) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    },
    clear() {
      this.toasts = []
    },
  },
})
