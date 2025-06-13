import { mount, createLocalVue } from '@vue/test-utils'
import VueCompositionAPI from '@vue/composition-api'
import { defineComponent, h } from '@vue/composition-api'
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest'
import { useIdleObserver } from '../src/useIdleObserver'
import { IdleObserver } from 'idle-observer'

// Mock the IdleObserver class
vi.mock('idle-observer', () => {
  return {
    IdleObserver: vi.fn().mockImplementation(({ onIdle, onActive, onIdleWarning, pause, resume, reset, destroy }) => {
      let isUserIdle = false
      return {
        triggerIdle: (...args: any[]) => {
          isUserIdle = true
          if (onIdle) onIdle(...args)
        },
        triggerActive: (...args: any[]) => {
          isUserIdle = false
          if (onActive) onActive(...args)
        },
        triggerIdleWarning: (...args: any[]) => {
          if (onIdleWarning) onIdleWarning(...args)
        },
        pause: pause || vi.fn(),
        resume: resume || vi.fn(),
        reset: reset || vi.fn(),
        destroy: destroy || vi.fn(),
        get isUserIdle() { return isUserIdle }
      }
    })
  }
})

describe('useIdleObserver (Vue 2)', () => {
  let idleInstance: any

  beforeEach(() => {
    // Reset mock between tests
    (IdleObserver as unknown as Mock).mockClear()
  })

  it('should toggle isIdle and call lifecycle callbacks', async () => {
    const onIdle = vi.fn()
    const onActive = vi.fn()
    const onIdleWarning = vi.fn()

    const localVue = createLocalVue()
    localVue.use(VueCompositionAPI)

    const wrapper = mount(
      defineComponent({
        setup() {
          const { isIdle, isUserIdle, pause, resume, reset, destroy } = useIdleObserver({
            timeout: 100,
            onIdle,
            onActive,
            onIdleWarning,
            activityEvents: ['mousemove'],
            idleWarningDuration: 50
          })
          // Expose all composable features for test
          return () => h('div', `${isIdle.value},${isUserIdle.value}`)
        }
      }),
      { localVue }
    )

    idleInstance = (IdleObserver as unknown as Mock).mock.results[0].value

    // Trigger idle
    idleInstance.triggerIdle()
    await wrapper.vm.$nextTick()
    expect(wrapper.text().startsWith('true')).toBe(true)
    expect(onIdle).toHaveBeenCalled()
    expect(idleInstance.isUserIdle).toBe(true)

    // Trigger active
    idleInstance.triggerActive()
    await wrapper.vm.$nextTick()
    expect(wrapper.text().startsWith('false')).toBe(true)
    expect(onActive).toHaveBeenCalled()
    expect(idleInstance.isUserIdle).toBe(false)

    // Trigger idle warning
    if (idleInstance.triggerIdleWarning) {
      idleInstance.triggerIdleWarning()
      expect(onIdleWarning).toHaveBeenCalled()
    }

    // Test pause/resume/reset/destroy methods exist
    expect(typeof idleInstance.pause).toBe('function')
    expect(typeof idleInstance.resume).toBe('function')
    expect(typeof idleInstance.reset).toBe('function')
    expect(typeof idleInstance.destroy).toBe('function')
    // Test isUserIdle getter exists
    expect('isUserIdle' in idleInstance).toBe(true)
  })
})
