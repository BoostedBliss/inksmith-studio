## 2025-03-01 - Parent Dependency Updates Defeating Child Memoization
**Learning:** In complex panel-based applications, wrapping child components in `React.memo` is ineffective if parent callbacks (like `onUpdatePanel`) are recreated on every render because they close over the current state.
**Action:** Always combine `React.memo` on heavy child items with `useCallback` and functional state updates (e.g., `setState(prev => ...)`) in the parent to ensure stable function references across re-renders.
