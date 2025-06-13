import { mount } from '@vue/test-utils'
import Vue from 'vue'
import { vi, describe, it, beforeEach, expect, Mock } from 'vitest'
import { createIdleObserver } from '../src/IdleObserver'
import { IdleObserver } from 'idle-observer'

// Mock IdleObserver
vi.mock('idle-observer', () => {
  return {
    IdleObserver: vi.fn().mockImplementation(({ onIdle, onActive }) => {
      return {
        triggerIdle: onIdle,
        triggerActive: onActive,
        destroy: vi.fn()
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
          _idleObserver: undefined
        }
      },
      mounted() {
        createIdleObserver(this, 123456)
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

    // Simulate active
    idleInstance.triggerActive()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('false')
  })
})
