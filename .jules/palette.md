## 2024-03-21 - Icon-Only Button Accessibility in Modals
**Learning:** Found multiple icon-only buttons (like Close, Next/Prev Panel, Navigation dots) in custom modals that completely lacked `aria-label` attributes. Screen readers would just read out "button" without context, making navigation practically impossible for visually impaired users.
**Action:** Always verify that interactive elements relying solely on icons (from lucide-react or similar libraries) have a descriptive `aria-label` or `title` (or both) to ensure screen readers can announce their purpose clearly.

## 2024-03-21 - Destructive Actions Lack Confirmation
**Learning:** Destructive actions like deleting a comic, panel, speech bubble, or SFX were executed immediately upon clicking the delete button, leading to potential accidental data loss without a chance to recover.
**Action:** Always wrap the logic for destructive UI actions in a `window.confirm` dialog (e.g., "Are you sure you want to delete this?") to provide a necessary safety net against accidental clicks.
