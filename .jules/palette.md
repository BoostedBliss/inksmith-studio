## 2024-11-05 - Accessible Destructive Actions
**Learning:** Guarding destructive UI actions (such as deletions) with `window.confirm` dialogs prevents accidental data loss. Furthermore, icon-only buttons require descriptive `aria-label` attributes and visible focus states (e.g., `focus-visible:ring-2`) for reliable keyboard navigation.
**Action:** Always add `window.confirm` to delete operations. Always verify that icon-only buttons have an `aria-label` and focus ring styles.
