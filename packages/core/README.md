# @idle-observer/core

**Lightweight, zero-dependency JavaScript utility for detecting user idle and active states via DOM events and visibility tracking.**

[![npm version](https://img.shields.io/npm/v/@idle-observer/core.svg)](https://www.npmjs.com/package/@idle-observer/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Installation

Install the wrapper:
```bash
npm install @idle-observer/core
# or
pnpm add @idle-observer/core
```

## Usage

### With plain javascript:

```ts
import { IdleObserver } from 'idle-observer'

const observer = new IdleObserver({
  timeout: 5 * 60 * 1000, // 5 minutes
  onIdle: () => {
    console.log('User is idle')
  },
  onActive: () => {
    console.log('User is active')
  },
  onIdleWarning: () => {
    console.log('User will be idle soon!')
  },
  activityEvents: ['mousemove', 'keydown', 'mousedown', 'touchstart'],
  idleWarningDuration: 10 * 1000 // Warn 10s before idle
})

// Pause/resume/reset/destroy
observer.pause()
observer.resume()
observer.reset()
observer.destroy()

// Check idle state
console.log(observer.isUserIdle)

```

To stop observing:

```ts
observer.destroy()
```

### With Options API (No Composition API required)
```ts
import { createIdleObserver } from '@idle-observer/vue2'

export default {
  data() {
    return {
      isIdle: false,
      lastActive: null
    }
  },
  mounted() {
    createIdleObserver(this, 5 * 60 * 1000)
  },
  beforeDestroy() {
    this._idleObserver?.destroy()
  }
}
```

## API

### new `IdleObserver(options)`
A class that observes user activity and detects idleness.

#### Parameters

| Option     | Type        | Required | Description                                      |
|------------|-------------|----------|--------------------------------------------------|
| `timeout`  | `number`    | ✅ Yes   | Idle time in milliseconds before triggering.     |
| `onIdle`   | `() => void`| ❌ No    | Callback when user becomes idle.                 |
| `onActive` | `() => void`| ❌ No    | Callback when user becomes active again.         |
| `onIdleWarning` | `() => void`| ❌ No | Callback when user is about to become idle.     |
| `activityEvents` | `string[]`| ❌ No | Array of DOM events to track as activity.       |
| `idleWarningDuration` | `number`| ❌ No | Milliseconds before idleness to trigger warning.|

#### Returns

An instance with the following method:

| Method      | Description                                  |
|-------------|----------------------------------------------|
| `destroy()` | Cleans up all event listeners and timers.    |


#### Example

```ts
const observer = new IdleObserver({
  timeout: 300000,
  onIdle: () => console.log('Idle'),
  onActive: () => console.log('Active'),
  onIdleWarning: () => console.log('About to be idle'),
  activityEvents: ['mousemove', 'keydown'],
  idleWarningDuration: 10000
})

// Later, to clean up
observer.destroy()

```

## License

MIT © [Anthony Bergen](https://github.com/adbergen)


## Related Packages

- [`@idle-observer/vue2`](https://www.npmjs.com/package/@idle-observer/vue2) – Vue 2 Composition/Options API wrapper
- [`@idle-observer/vue3`](https://www.npmjs.com/package/@idle-observer/vue3) – Vue 3 Composition API wrapper

