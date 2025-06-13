import type Vue from 'vue'
import { IdleObserver } from 'idle-observer'

export interface IdleObserverContext extends Vue {
  isIdle: boolean
  lastActive: Date
  _idleObserver?: IdleObserver
  pauseIdleObserver?: () => void
  resumeIdleObserver?: () => void
  resetIdleObserver?: (event?: Event) => void
  destroyIdleObserver?: () => void
  isUserIdle?: boolean
}

export interface IdleObserverOptions {
  timeout: number
  onIdle?: (event?: Event) => void
  onActive?: (event?: Event) => void
  onIdleWarning?: (event?: Event) => void
  activityEvents?: string[]
  idleWarningDuration?: number
}

export function createIdleObserver(context: IdleObserverContext, options: IdleObserverOptions) {
  const observer = new IdleObserver({
    ...options,
    onIdle: (event?: Event) => {
      context.isIdle = true
      context.lastActive = new Date()
      // Always update isUserIdle for reactivity
      context.isUserIdle = observer.isUserIdle
      if (options.onIdle) options.onIdle(event)
    },
    onActive: (event?: Event) => {
      context.isIdle = false
      context.lastActive = new Date()
      context.isUserIdle = observer.isUserIdle
      if (options.onActive) options.onActive(event)
    },
    onIdleWarning: options.onIdleWarning
      ? (event?: Event) => { options.onIdleWarning && options.onIdleWarning(event) }
      : undefined,
  })

  context._idleObserver = observer
  context.pauseIdleObserver = () => {
    observer.pause()
    context.isUserIdle = observer.isUserIdle
  }
  context.resumeIdleObserver = () => {
    observer.resume()
    context.isUserIdle = observer.isUserIdle
  }
  context.resetIdleObserver = (event?: Event) => {
    observer.reset(event)
    context.isUserIdle = observer.isUserIdle
  }
  context.destroyIdleObserver = () => {
    observer.destroy()
    context.isUserIdle = observer.isUserIdle
  }
  // Keep the property definition for compatibility, but always update the data property above
  Object.defineProperty(context, 'isUserIdle', {
    get: () => observer.isUserIdle,
    configurable: true,
    enumerable: true,
  })
}
