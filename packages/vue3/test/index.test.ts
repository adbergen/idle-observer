import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useIdleObserver } from '../src/useIdleObserver'

vi.mock('idle-observer', () => {
  return {
    IdleObserver: vi.fn().mockImplementation(({ onIdle, onActive }) => {
      return {
        triggerIdle: () => onIdle?.(),
        triggerActive: () => onActive?.(),
        destroy: vi.fn()
      }
    })
  }
})

describe('useIdleObserver (Vue 3)', () => {
  it('should toggle isIdle and call lifecycle callbacks', async () => {
    const onIdle = vi.fn()
    const onActive = vi.fn()

    let isIdleRef: ReturnType<typeof ref<boolean>>

    const TestComponent = defineComponent({
      setup() {
        const { isIdle } = useIdleObserver({
          timeout: 3000,
          onIdle,
          onActive
        })
        isIdleRef = isIdle
        return () => h('div')
      }
    })

    const wrapper = mount(TestComponent)

    const { IdleObserver } = await import('idle-observer')
    const instance = (IdleObserver as any).mock.results[0].value

    // Simulate idle
    instance.triggerIdle()
    await wrapper.vm.$nextTick()
    expect(isIdleRef!.value).toBe(true)
    expect(onIdle).toHaveBeenCalled()

    // Simulate active
    instance.triggerActive()
    await wrapper.vm.$nextTick()
    expect(isIdleRef!.value).toBe(false)
    expect(onActive).toHaveBeenCalled()

    // Simulate unmount
    wrapper.unmount()
    expect(instance.destroy).toHaveBeenCalled()
  })
})
