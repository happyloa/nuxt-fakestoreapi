import { defineStore } from 'pinia'

export interface Toast {
  id: number
  message: string
  variant: 'success' | 'error' | 'info'
}

// Long enough to read: at least 5 s, more for longer messages.
const MIN_DURATION_MS = 5_000
const PER_CHARACTER_MS = 60

/**
 * 全域 Toast 通知。錯誤通知會留到使用者關閉；其他通知依長度自動消失，
 * 滑鼠停留或鍵盤焦點在通知上時暫停計時（WCAG 2.2.1）。
 */
export const useNotificationsStore = defineStore('notifications', () => {
  const toasts = ref<Toast[]>([])
  const timers = new Map<number, { remaining: number; startedAt: number; handle?: ReturnType<typeof setTimeout> }>()
  let nextId = 0
  let paused = false

  const remove = (id: number) => {
    clearTimeout(timers.get(id)?.handle)
    timers.delete(id)
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const start = (id: number) => {
    const timer = timers.get(id)
    if (!timer) return
    timer.startedAt = Date.now()
    timer.handle = setTimeout(() => remove(id), timer.remaining)
  }

  const add = (message: string, variant: Toast['variant']) => {
    // A counter instead of crypto.randomUUID(), which needs a secure context.
    const id = ++nextId
    toasts.value.push({ id, message, variant })
    if (variant === 'error') return
    timers.set(id, {
      remaining: Math.max(MIN_DURATION_MS, message.length * PER_CHARACTER_MS),
      startedAt: 0,
    })
    if (!paused) start(id)
  }

  const pause = () => {
    if (paused) return
    paused = true
    for (const timer of timers.values()) {
      clearTimeout(timer.handle)
      timer.remaining = Math.max(1_000, timer.remaining - (Date.now() - timer.startedAt))
    }
  }

  const resume = () => {
    if (!paused) return
    paused = false
    for (const id of timers.keys()) start(id)
  }

  return {
    toasts,
    remove,
    pause,
    resume,
    success: (message: string) => add(message, 'success'),
    error: (message: string) => add(message, 'error'),
    info: (message: string) => add(message, 'info'),
  }
})
