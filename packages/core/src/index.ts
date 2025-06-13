type IdleOptions = {
  timeout: number
  onIdle?: (event?: Event) => void
  onActive?: (event?: Event) => void
  onIdleWarning?: (event?: Event) => void
  activityEvents?: string[]
  idleWarningDuration?: number // ms before idle to fire onIdleWarning
}

export class IdleObserver {
  private timeout: number
  private timerId: ReturnType<typeof setTimeout> | null = null
  private warningTimerId: ReturnType<typeof setTimeout> | null = null
  private onIdle?: (event?: Event) => void
  private onActive?: (event?: Event) => void
  private onIdleWarning?: (event?: Event) => void
  private isIdle = false
  private paused = false
  private activityEvents: string[]
  private idleWarningDuration: number
  private lastActive: number = Date.now()

  constructor({ timeout, onIdle, onActive, onIdleWarning, activityEvents, idleWarningDuration }: IdleOptions) {
    this.timeout = timeout
    this.onIdle = onIdle
    this.onActive = onActive
    this.onIdleWarning = onIdleWarning
    this.activityEvents = activityEvents || ['mousemove', 'keydown', 'mousedown', 'touchstart']
    this.idleWarningDuration = idleWarningDuration || 10000 // default 10s before idle
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.init()
    }
  }

  private init() {
    this.resetTimer()
    for (const evt of this.activityEvents) {
      window.addEventListener(evt, this.handleUserActivity, { passive: true })
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  private handleUserActivity = (event?: Event) => {
    if (this.paused) return
    this.lastActive = Date.now()
    if (this.isIdle && this.onActive) this.onActive(event)
    this.isIdle = false
    this.resetTimer(event)
  }

  private handleVisibilityChange = (event?: Event) => {
    if (document.visibilityState === 'hidden') {
      this.clearTimer()
    } else {
      this.handleUserActivity(event)
    }
  }

  private resetTimer(event?: Event) {
    this.clearTimer()
    // Idle warning
    if (this.onIdleWarning) {
      const warningDelay = Math.max(0, this.timeout - this.idleWarningDuration)
      this.warningTimerId = setTimeout(() => {
        // Only fire warning if enough time has actually passed
        if (!this.isIdle && this.onIdleWarning && Date.now() - this.lastActive >= warningDelay) {
          this.onIdleWarning(event)
        }
      }, warningDelay)
    }
    this.timerId = setTimeout(() => {
      // Only fire idle if enough time has actually passed
      if (Date.now() - this.lastActive >= this.timeout) {
        this.isIdle = true
        if (this.onIdle) this.onIdle(event)
      } else {
        // If not enough time has passed (timer was throttled), restart timer for remaining time
        const remaining = this.timeout - (Date.now() - this.lastActive)
        this.timerId = setTimeout(() => {
          if (Date.now() - this.lastActive >= this.timeout) {
            this.isIdle = true
            if (this.onIdle) this.onIdle(event)
          }
        }, remaining)
      }
    }, this.timeout)
  }

  private clearTimer() {
    if (this.timerId) clearTimeout(this.timerId)
    if (this.warningTimerId) clearTimeout(this.warningTimerId)
  }

  public pause() {
    this.paused = true
    this.clearTimer()
  }

  public resume() {
    if (!this.paused) return
    this.paused = false
    this.resetTimer()
  }

  public get isUserIdle() {
    return this.isIdle
  }

  public reset(event?: Event) {
    this.handleUserActivity(event)
  }

  public destroy() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    for (const evt of this.activityEvents) {
      window.removeEventListener(evt, this.handleUserActivity)
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    this.clearTimer()
  }
}
