type IdleOptions = {
  timeout: number
  onIdle?: () => void
  onActive?: () => void
}

export class IdleObserver {
  private timeout: number
  private timerId: ReturnType<typeof setTimeout> | null = null
  private onIdle?: () => void
  private onActive?: () => void
  private isIdle = false

  constructor({ timeout, onIdle, onActive }: IdleOptions) {
    this.timeout = timeout
    this.onIdle = onIdle
    this.onActive = onActive
    this.init()
  }

  private init() {
    this.resetTimer()
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    for (const evt of events) {
      window.addEventListener(evt, this.handleUserActivity)
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private handleUserActivity = () => {
    if (this.isIdle && this.onActive) this.onActive()
    this.isIdle = false
    this.resetTimer()
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.clearTimer()
    } else {
      this.resetTimer()
    }
  }

  private resetTimer() {
    this.clearTimer()
    this.timerId = setTimeout(() => {
      this.isIdle = true
      if (this.onIdle) this.onIdle()
    }, this.timeout)
  }

  private clearTimer() {
    if (this.timerId) clearTimeout(this.timerId)
  }

  public destroy() {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    for (const evt of events) {
      window.removeEventListener(evt, this.handleUserActivity)
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    this.clearTimer()
  }
}
