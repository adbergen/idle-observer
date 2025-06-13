# IdleObserver Vue 3

Vue 3 integration for the robust idle-observer core. Detects user idleness in your Vue 3 apps, even with browser timer throttling.

## Features
- Timestamp-based idle detection (robust against timer throttling)
- All core options: `onIdle`, `onActive`, `onIdleWarning`, `activityEvents`, `idleWarningDuration`
- Pause, resume, reset, destroy methods
- `isIdle` and `isUserIdle` state
- Works with the Vue 3 Composition API

## Installation
```sh
npm install idle-observer
```

## Usage (Composition API)
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

## API
See [core README](../core/README.md) for full option and method details.

