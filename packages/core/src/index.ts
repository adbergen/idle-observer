type IdleOptions = {
  timeout: number
  onIdle?: () => void
  onActive?: () => void
}

export class IdleObserver {
  private timeout: number
  private onIdle?: () => void
  private onActive?: () => void
  private lastActive: number
  private isIdle = false
  private checkIntervalId: ReturnType<typeof setInterval> | null = null

  constructor({ timeout, onIdle, onActive }: IdleOptions) {
    this.timeout = timeout
    this.onIdle = onIdle
    this.onActive = onActive
    this.lastActive = Date.now()
    this.init()
  }

  private init() {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    for (const evt of events) {
      window.addEventListener(evt, this.handleUserActivity)
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    this.checkIntervalId = setInterval(this.checkIdleState, 1000) // Check every second
  }

  private handleUserActivity = () => {
    const now = Date.now()

    if (this.isIdle && this.onActive) this.onActive()

    this.isIdle = false
    this.lastActive = now
  }

private handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') this.handleUserActivity() // Treat tab focus as "activity"
}

  private checkIdleState = () => {
    const now = Date.now()
    const elapsed = now - this.lastActive

    if (!this.isIdle && elapsed >= this.timeout) {
      this.isIdle = true
      if (this.onIdle) this.onIdle()
    }
  }

  public destroy() {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    for (const evt of events) {
      window.removeEventListener(evt, this.handleUserActivity)
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)

    if (this.checkIntervalId) clearInterval(this.checkIntervalId)
  }
}
