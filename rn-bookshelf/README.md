# Bookshelf — React Native CLI

A production-ready book search app built with React Native CLI, TypeScript, and Redux Toolkit.

---

## App Functionality

**3 screens:**

| Screen | Route | Purpose |
|--------|-------|---------|
| Search | `HomeStack > BookList` | Search books via Open Library API with infinite scroll |
| Detail | `HomeStack > BookDetail` | Full metadata for a selected book; save/unsave |
| Saved  | `Saved` tab | Persisted list of bookmarked books |

**Features:**
- Full-text book search powered by the [Open Library Search API](https://openlibrary.org/search.json) (no API key required)
- Infinite scroll — loads 20 books per page, appends on scroll-to-end
- Save/unsave any book; persisted to `AsyncStorage` and restored on next launch
- Last search query is persisted and re-executed on app open
- App lifecycle handling — silently refreshes results when returning from background
- Cover images fetched from Open Library Covers CDN
- No third-party UI libraries — all UI built with core React Native components

---

## How to Run

### Prerequisites

- Node.js ≥ 18
- React Native CLI environment set up: https://reactnative.dev/docs/environment-setup
  - Android: Android Studio + SDK, Java 17
  - iOS: Xcode + CocoaPods (macOS only)

### Install

```bash
git clone <repo-url>
cd rn-bookshelf
npm install

# iOS only
cd ios && pod install && cd ..
```

### Run

```bash
# Start Metro bundler
npm start

# In a separate terminal:
npm run android   # Android emulator or device
npm run ios       # iOS simulator (macOS only)
```

### Lint / Typecheck

```bash
npm run lint
npm run typecheck
```

---

## Key Technical Decisions

### Redux Toolkit over plain Redux
RTK eliminates the boilerplate of action creators, reducers, and thunk wiring. `createAsyncThunk` handles the `pending / fulfilled / rejected` lifecycle cleanly and colocates the API call with its state transitions in `booksSlice.ts`.

### Open Library API
Chosen because it's free, requires no API key, supports pagination via `limit`/`offset` query params, and returns rich metadata (cover IDs, subjects, publishers, ISBNs, edition counts) suitable for both list and detail views.

### AsyncStorage for persistence (not SQLite / MMKV)
The data model is simple (a flat array of book objects + a query string). `AsyncStorage` is the standard solution for this scale — no schema migrations, no native module complexity. Writes are fire-and-forget; read failures fall back to empty state so the app never blocks on cold start.

### App lifecycle (AppState API)
`useAppState` is a custom hook wrapping `AppState.addEventListener`. It fires `onForeground` when the app transitions from `background/inactive → active`. The Home screen uses this to silently re-fetch page 1, ensuring stale data is refreshed when users return from the OS task switcher.

### Deduplication on infinite scroll
Before appending a new page to `state.items`, existing keys are checked against a `Set` to prevent duplicate entries that can occur if the API shifts results between pages (e.g. a new book is added and offsets shift).

### `useCallback` + `memo` on list items
`BookCard` is wrapped in `React.memo`. Its callbacks (`onPress`, `onSaveToggle`) are memoised with `useCallback` in the parent. This prevents every card from re-rendering when only the `savedKeys` set changes on a different item's save action.

### FlatList performance props
`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, and `removeClippedSubviews` are tuned to keep the render thread ahead of a fast scroll without over-rendering off-screen items.

### No navigation params mutation
The `Book` object is passed as a navigation param to `DetailScreen` rather than looking it up from the store by key. This avoids a store lookup and keeps the detail screen stateless with respect to the list.

---

## Improvements with More Time

1. **Optimistic UI for saves** — the save toggle already feels instant (synchronous Redux update), but adding a subtle haptic via `react-native-haptic-feedback` would improve tactile feedback.

2. **Full-text detail from Open Library Works API** — the search endpoint doesn't return a description. A follow-up fetch to `https://openlibrary.org${book.key}.json` would provide the synopsis. A short debounced fetch on `DetailScreen` mount would work well.

3. **Offline-first search cache** — cache the last N search result pages to AsyncStorage so search results are viewable offline immediately, with a stale indicator. A simple LRU cache keyed on `"${query}:${page}"` would suffice.

4. **MMKV for storage** — for apps with larger saved lists or heavy read frequency, swapping AsyncStorage for MMKV (synchronous, no await needed) would eliminate async hydration delays.

5. **Error retry with exponential backoff** — the current error state shows a message but requires the user to re-search. An automatic retry with jittered backoff (max 3 attempts) would improve resilience on flaky connections.

6. **Testing** — unit tests for reducers (`booksSlice`, `savedSlice`) with Jest, integration tests for `useAppState` and `usePersistence` with `@testing-library/react-native`.

7. **Accessibility** — add `accessibilityLabel`, `accessibilityRole`, and `accessibilityState` to interactive elements; verify with TalkBack (Android) and VoiceOver (iOS).
