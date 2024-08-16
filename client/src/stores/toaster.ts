import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
export type ToastStatus = 'success' | 'warning' | 'danger' | 'info'

interface Toast {
  text: string
  status: ToastStatus
  id: string
}
type ToastPayload = { timeout?: number; text: string }

const defaultTimeout = 3000

const createToast = (text: string, status: ToastStatus): Toast => ({
  text,
  status,
  id: uuidv4(),
})

export const useToasterStore = defineStore('toaster', () => {
  const toasts: Ref<Toast[]> = ref([])

  function updateState(payload: ToastPayload, status: ToastStatus) {
    const { text, timeout } = payload

    const toast = createToast(text, status)

    toasts.value.push(toast)

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== toast.id)
    }, timeout ?? defaultTimeout)
  }

  function success(payload: ToastPayload) {
    updateState(payload, 'success')
  }

  function warning(payload: ToastPayload) {
    updateState(payload, 'warning')
  }

  function danger(payload: ToastPayload) {
    updateState(payload, 'danger')
  }
  function info(payload: ToastPayload) {
    updateState(payload, 'info')
  }

  return {
    toasts,
    success,
    warning,
    danger,
    info,
  }
})
