# @idle-observer/vue2

Vue 2 Composition API wrapper for [`idle-observer`](https://www.npmjs.com/package/idle-observer).

Provides seamless integration for detecting user idle and active states in Vue 2 applications.

## Installation

First, make sure your Vue 2 project is using the Composition API plugin:

```bash
npm install @vue/composition-api
```

Then install the wrapper:
```bash
npm install @idle-observer/vue2
# or
pnpm add @idle-observer/vue2
```

## Usage

### With Composition API

#### 1. Register the Composition API (if not already)

In your main entry file (e.g., `main.js` or `main.ts`):

```ts
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)
```

#### 2. Import and use the hook

```ts
import { useIdleObserver } from '@idle-observer/vue2'

export default {
  setup() {
    const { isIdle } = useIdleObserver({
      timeout: 5 * 60 * 1000 // 5 minutes
    })

    return { isIdle }
  }
}
```

#### 3. Reactively respond to idle state

```html
<template>
  <div>
    <p v-if="isIdle">You’ve been idle.</p>
    <p v-else>You're active!</p>
  </div>
</template>
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

### `useIdleObserver(options)`

A Composition API hook that observes user activity and detects idleness.

#### Parameters

| Option    | Type     | Required | Description                                |
|-----------|----------|----------|--------------------------------------------|
| `timeout` | `number` | Yes      | Idle time in milliseconds before triggering. |

#### Returns

An object with the following reactive values:

| Property   | Type      | Description                         |
|------------|-----------|-------------------------------------|
| `isIdle`   | `boolean` | `true` when the user is idle.       |
| `lastActive` | `Date`  | The timestamp of the last activity. |

#### Example

```ts
const { isIdle, lastActive } = useIdleObserver({ timeout: 300000 })
```

## License

MIT © [Anthony Bergen](https://github.com/adbergen)


## Related Packages

- [`@idle-observer/vue3`](https://www.npmjs.com/package/@idle-observer/vue3) – Vue 3 Composition API wrapper
- [`idle-observer`](https://www.npmjs.com/package/idle-observer) – Core library for tracking user idle and active states

