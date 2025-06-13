# idle-observer

**Monorepo for idle-observer packages** — detect user idle and active states across core JavaScript, Vue 2, and Vue 3.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📦 Packages

| Package                            | Description                                      |
|------------------------------------|--------------------------------------------------|
| [`idle-observer`](https://www.npmjs.com/package/idle-observer)           | Core utility for detecting user idle/active states |
| [`@idle-observer/vue2`](https://www.npmjs.com/package/@idle-observer/vue2) | Vue 2 wrapper (supports Composition + Options API) |
| [`@idle-observer/vue3`](https://www.npmjs.com/package/@idle-observer/vue3) | Vue 3 Composition API wrapper                    |

---

## 🧠 Features

- ⚡ Lightweight, zero-dependency core
- 🔁 Reactivity support for Vue 2 & Vue 3
- 📦 TypeScript support across all packages
- 🧪 Unified test setup with Vitest
- 🧹 Built-in `.destroy()` cleanup

---

## 🛠 Development

### Install dependencies:

```bash
pnpm install
```

### Build all packages:

```bash
pnpm build
```

### Run tests across all packages:

```bash
pnpm test
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
