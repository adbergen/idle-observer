# idle-observer

A robust, framework-agnostic idle detection library for browsers, with official Vue 2 and Vue 3 integrations. Reliably detects user idleness even with browser timer throttling (e.g., background tabs).

## Features

- Timestamp-based idle detection (robust against timer throttling)
- Customizable activity events
- Idle warning callback (`onIdleWarning`)
- Pause, resume, reset, destroy methods
- `isUserIdle` getter
- Vue 2 and Vue 3 composables and wrappers
- Fully tested and documented

## Packages

### Core

- Location: `packages/core`
- See [core/README.md](./packages/core/README.md) for full API and usage.

### Vue 2

- Location: `packages/vue2`
- Options API and Composition API support
- See [vue2/README.md](./packages/vue2/README.md) for full API and usage.

### Vue 3

- Location: `packages/vue3`
- Composition API support
- See [vue3/README.md](./packages/vue3/README.md) for full API and usage.

## Quick Example (Core)

```ts
import { IdleObserver } from 'idle-observer'

const observer = new IdleObserver({
  timeout: 60000, // 1 minute
  onIdle: () => console.log('User is idle!'),
  onActive: () => console.log('User is active!'),
  onIdleWarning: () => console.log('User will be idle soon!'),
  activityEvents: ['mousemove', 'keydown', 'mousedown', 'touchstart'],
  idleWarningDuration: 10000 // Warn 10s before idle
})

observer.pause()
observer.resume()
observer.reset()
observer.destroy()
console.log(observer.isUserIdle)
```

## Quick Example (Vue 3)

```js
import { useIdleObserver } from 'idle-observer/vue3'

export default {
  setup() {
    const { isIdle, isUserIdle, pause, resume, reset, destroy } = useIdleObserver({
      timeout: 60000,
      onIdle: () => { /* ... */ },
      onActive: () => { /* ... */ },
      onIdleWarning: () => { /* ... */ },
      activityEvents: ['mousemove', 'keydown'],
      idleWarningDuration: 10000
    })
    return { isIdle, isUserIdle, pause, resume, reset, destroy }
  }
}
```

## Quick Example (Vue 2)

```js
import { useIdleObserver } from 'idle-observer/vue2'

export default {
  setup() {
    const { isIdle, isUserIdle, pause, resume, reset, destroy } = useIdleObserver({
      timeout: 60000,
      onIdle: () => { /* ... */ },
      onActive: () => { /* ... */ },
      onIdleWarning: () => { /* ... */ },
      activityEvents: ['mousemove', 'keydown'],
      idleWarningDuration: 10000
    })
    return { isIdle, isUserIdle, pause, resume, reset, destroy }
  }
}
```

## Documentation

- See each package's README for full API and advanced usage.
- All packages are fully aligned and tested as of June 2025.
