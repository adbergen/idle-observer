# IdleObserver Vue 2

Vue 2 integration for the robust idle-observer core. Detects user idleness in your Vue 2 apps, even with browser timer throttling.

## Features
- Timestamp-based idle detection (robust against timer throttling)
- All core options: `onIdle`, `onActive`, `onIdleWarning`, `activityEvents`, `idleWarningDuration`
- Pause, resume, reset, destroy methods
- `isIdle` and `isUserIdle` state
- Works with both Options API and Composition API

## Installation
```sh
npm install idle-observer
```

## Options API Usage
```js
import { createIdleObserver } from 'idle-observer/vue2'

export default {
  data() {
    return {
      isIdle: false,
      lastActive: new Date(),
      isUserIdle: false
    }
  },
  mounted() {
    createIdleObserver(this, {
      timeout: 60000,
      onIdle: () => { this.isIdle = true },
      onActive: () => { this.isIdle = false },
      onIdleWarning: () => { /* ... */ },
      activityEvents: ['mousemove', 'keydown'],
      idleWarningDuration: 10000
    })
  },
  beforeDestroy() {
    this._idleObserver?.destroy()
  }
}
```

## Composition API Usage
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

## API
See [core README](../core/README.md) for full option and method details.

