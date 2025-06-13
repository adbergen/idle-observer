import { describe, it, expect, vi } from 'vitest'
import { IdleObserver } from '../src/index'

describe('IdleObserver', () => {
  it('should call onIdle after timeout', async () => {
    const idleFn = vi.fn()
    new IdleObserver({ timeout: 100, onIdle: idleFn })

    await new Promise(r => setTimeout(r, 150))
    expect(idleFn).toHaveBeenCalled()
  })
})
