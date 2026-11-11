## 2024-05-18 - Guarding Destructive Actions and Icon Button Accessibility
**Learning:** Found multiple instances where destructive actions like deleting comics or panels were not guarded by confirmation dialogs, and icon-only buttons lacked aria-labels for screen readers and visible focus states for keyboard navigation.
**Action:** Always guard destructive actions (deletions, clears) with `window.confirm`. Ensure all icon-only buttons have descriptive `aria-label` attributes and visible focus states (e.g. `focus-visible:ring-2`) for reliable accessibility.
