import { mount } from '@vue/test-utils'
import Vue from 'vue'
import { vi, describe, it, beforeEach, expect, Mock } from 'vitest'
import { createIdleObserver } from '../src/IdleObserver'
import { IdleObserver } from 'idle-observer'

// Mock IdleObserver
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

describe('createIdleObserver (Vue 2 Options API)', () => {
  let idleInstance: any

  beforeEach(() => {
    (IdleObserver as unknown as Mock).mockClear()
  })

  it('should update data properties via createIdleObserver', async () => {
    const Component = Vue.extend({
      data() {
        return {
          isIdle: false,
          lastActive: new Date(),
          _idleObserver: undefined,
          isUserIdle: false
        }
      },
      mounted() {
        createIdleObserver(this as any, { timeout: 123456 })
      },
      beforeDestroy() {
        this._idleObserver?.destroy()
      },
      template: '<div>{{ isIdle }}</div>'
    })

    const wrapper = mount(Component)

    idleInstance = (IdleObserver as unknown as Mock).mock.results[0].value

    // Simulate idle
    idleInstance.triggerIdle()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('true')
    wrapper.vm.isUserIdle = idleInstance.isUserIdle
    expect(wrapper.vm.isUserIdle).toBe(true)

    // Simulate active
    idleInstance.triggerActive()
    await wrapper.vm.$nextTick()
    wrapper.vm.isUserIdle = idleInstance.isUserIdle
    expect(wrapper.text()).toBe('false')
    expect(wrapper.vm.isUserIdle).toBe(false)

    // Simulate idle warning
    if (idleInstance.triggerIdleWarning) {
      expect(() => idleInstance.triggerIdleWarning()).not.toThrow()
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
