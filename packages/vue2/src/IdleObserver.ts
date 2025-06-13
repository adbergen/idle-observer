import type Vue from 'vue'
import { IdleObserver } from 'idle-observer'

export interface IdleObserverContext extends Vue {
  isIdle: boolean
  lastActive: Date
  _idleObserver?: IdleObserver
}

export function createIdleObserver(context: IdleObserverContext, timeout = 300000) {
  const observer = new IdleObserver({
    timeout,
    onIdle: () => {
      context.isIdle = true
      context.lastActive = new Date()
    },
    onActive: () => {
      context.isIdle = false
      context.lastActive = new Date()
    }
  })

  context._idleObserver = observer
}
