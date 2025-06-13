import { ref, onMounted, onUnmounted } from '@vue/composition-api'
import { IdleObserver } from 'idle-observer'

interface UseIdleObserverOptions {
  timeout: number
  onIdle?: () => void
  onActive?: () => void
}

export function useIdleObserver(options: UseIdleObserverOptions) {
  const isIdle = ref(false)
  let observer: IdleObserver | null = null

  onMounted(() => {
    observer = new IdleObserver({
      timeout: options.timeout,
      onIdle: () => {
        isIdle.value = true
        options.onIdle?.()
      },
      onActive: () => {
        isIdle.value = false
        options.onActive?.()
      }
    })
  })

  onUnmounted(() => {
    observer?.destroy()
    observer = null
  })

  return {
    isIdle
  }
}
