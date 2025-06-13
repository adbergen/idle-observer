# @idle-observer/vue3

Vue 3 Composition API wrapper for [`idle-observer`](https://www.npmjs.com/package/idle-observer).

Provides seamless integration for detecting user idle and active states in Vue 3 applications.

## Installation

Install the wrapper:
```bash
npm install @idle-observer/vue3
# or
pnpm add @idle-observer/vue3
```

## Usage

### 1. Import and use the hook

```ts
<script setup lang="ts">
import { useIdleObserver } from '@idle-observer/vue3'

const { isIdle } = useIdleObserver({
  timeout: 5 * 60 * 1000 // 5 minutes
})
</script>

<template>
  <div>
    <p v-if="isIdle">You’ve been idle.</p>
    <p v-else>You're active!</p>
  </div>
</template>
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

- [`@idle-observer/vue2`](https://www.npmjs.com/package/@idle-observer/vue2) – Vue 2 wrapper for idle-observer
- [`idle-observer`](https://www.npmjs.com/package/idle-observer) – Core library for tracking user idle and active states

