import { ref, onMounted, onUnmounted } from 'vue'
import { IdleObserver } from 'idle-observer'

interface UseIdleObserverOptions {
  timeout: number
  onIdle?: (event?: Event) => void
  onActive?: (event?: Event) => void
  onIdleWarning?: (event?: Event) => void
  activityEvents?: string[]
  idleWarningDuration?: number
}

export function useIdleObserver(options: UseIdleObserverOptions) {
  const isIdle = ref(false)
  const isUserIdle = ref(false)
  let observer: IdleObserver | null = null

  const pause = () => observer?.pause()
  const resume = () => observer?.resume()
  const reset = (event?: Event) => observer?.reset(event)
  const destroy = () => observer?.destroy()

  onMounted(() => {
    observer = new IdleObserver({
      ...options,
      onIdle: (event?: Event) => {
        isIdle.value = true
        isUserIdle.value = observer?.isUserIdle ?? false
        options.onIdle?.(event)
      },
      onActive: (event?: Event) => {
        isIdle.value = false
        isUserIdle.value = observer?.isUserIdle ?? false
        options.onActive?.(event)
      },
      onIdleWarning: options.onIdleWarning
        ? (event?: Event) => { options.onIdleWarning && options.onIdleWarning(event) }
        : undefined,
    })
    isUserIdle.value = observer.isUserIdle
  })

  onUnmounted(() => {
    observer?.destroy()
    observer = null
  })

  return {
    isIdle,
    isUserIdle,
    pause,
    resume,
    reset,
    destroy,
  }
}
