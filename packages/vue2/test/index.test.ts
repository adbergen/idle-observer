import { mount, createLocalVue } from '@vue/test-utils'
import VueCompositionAPI from '@vue/composition-api'
import { defineComponent, h } from '@vue/composition-api'
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest'
import { useIdleObserver } from '../src/useIdleObserver'
import { IdleObserver } from 'idle-observer'

// Mock the IdleObserver class
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

describe('useIdleObserver (Vue 2)', () => {
  let idleInstance: any

  beforeEach(() => {
    // Reset mock between tests
    (IdleObserver as unknown as Mock).mockClear()
  })

  it('should toggle isIdle and call lifecycle callbacks', async () => {
    const onIdle = vi.fn()
    const onActive = vi.fn()

    const localVue = createLocalVue()
    localVue.use(VueCompositionAPI)

    const wrapper = mount(
      defineComponent({
        setup() {
          const { isIdle } = useIdleObserver({
            timeout: 100,
            onIdle,
            onActive
          })
          return () => h('div', isIdle.value.toString())
        }
      }),
      { localVue }
    )

    idleInstance = (IdleObserver as unknown as Mock).mock.results[0].value

    // Trigger idle
    idleInstance.triggerIdle()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('true')
    expect(onIdle).toHaveBeenCalled()

    // Trigger active
    idleInstance.triggerActive()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('false')
    expect(onActive).toHaveBeenCalled()
  })
})
