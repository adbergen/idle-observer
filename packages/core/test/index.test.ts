import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { IdleObserver } from '../src/index'

describe('IdleObserver', () => {
  let originalVisibilityState: PropertyDescriptor | undefined

  beforeEach(() => {
    vi.useFakeTimers()
    originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState')
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible'
    })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    if (originalVisibilityState) {
      Object.defineProperty(document, 'visibilityState', originalVisibilityState)
    }
  })

  it('should call onIdle after timeout', () => {
    const idleFn = vi.fn()
    new IdleObserver({ timeout: 1000, onIdle: idleFn })

    vi.advanceTimersByTime(1000)

    expect(idleFn).toHaveBeenCalledTimes(1)
  })

  it('should reset timer on user activity', () => {
    const idleFn = vi.fn()
    const observer = new IdleObserver({ timeout: 1000, onIdle: idleFn })

    window.dispatchEvent(new Event('mousemove'))
    vi.advanceTimersByTime(900)
    window.dispatchEvent(new Event('keydown'))
    vi.advanceTimersByTime(900)

    expect(idleFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(idleFn).toHaveBeenCalledTimes(1)

    observer.destroy()
  })

  it('should call onActive when coming out of idle', () => {
    const onIdle = vi.fn()
    const onActive = vi.fn()
    const observer = new IdleObserver({ timeout: 1000, onIdle, onActive })

    vi.advanceTimersByTime(1000)
    expect(onIdle).toHaveBeenCalled()

    window.dispatchEvent(new Event('mousemove'))
    expect(onActive).toHaveBeenCalled()

    observer.destroy()
  })

  it('should clear timer on visibility hidden and resume on visible', () => {
    const idleFn = vi.fn()
    const observer = new IdleObserver({ timeout: 1000, onIdle: idleFn })

    // simulate tab going hidden
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden'
    })
    document.dispatchEvent(new Event('visibilitychange'))
    vi.advanceTimersByTime(1000)
    expect(idleFn).not.toHaveBeenCalled()

    // simulate tab coming back
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible'
    })
    document.dispatchEvent(new Event('visibilitychange'))
    vi.advanceTimersByTime(1000)
    expect(idleFn).toHaveBeenCalled()

    observer.destroy()
  })
})
