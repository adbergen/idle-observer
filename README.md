# idle-observer

**Lightweight, zero-dependency JavaScript utility for detecting user idle and active states via DOM events and visibility tracking.**

[![npm version](https://img.shields.io/npm/v/idle-observer.svg)](https://www.npmjs.com/package/idle-observer)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- ⚡ Lightweight — zero dependencies
- 🖱️ Detects inactivity via keyboard, mouse, touch, and visibility changes
- 🔁 Triggers `onIdle` and `onActive` callbacks
- 🧹 Includes cleanup via `.destroy()`
- 📦 TypeScript support out of the box

---

## 📦 Installation

```bash
npm install idle-observer
```

---

## 🧠 Usage

```ts
import { IdleObserver } from 'idle-observer'

const observer = new IdleObserver({
  timeout: 5 * 60 * 1000, // 5 minutes
  onIdle: () => {
    console.log('User is idle.')
  },
  onActive: () => {
    console.log('User is active again.')
  }
})
```

---

## 🔧 Options

| Option     | Type         | Required | Description                                            |
|------------|--------------|----------|--------------------------------------------------------|
| `timeout`  | `number`     | ✅ Yes   | Inactivity duration (ms) before `onIdle` is triggered |
| `onIdle`   | `() => void` | No       | Called when user becomes idle                          |
| `onActive` | `() => void` | No       | Called when user becomes active again after idle       |

---

## 🧼 Cleanup

To stop tracking and remove listeners:

```ts
observer.destroy()
```

---

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/). Run tests with:

```bash
npm run test
```

---

## 💡 Use Cases

- Auto-logout after inactivity  
- Inactivity modals or countdowns  
- Analytics triggers for user engagement  
- Save energy by disabling heavy UI when idle

---

## 📘 License

MIT © [Anthony Bergen](https://github.com/adbergen)
