## 2024-03-21 - Icon-Only Button Accessibility in Modals
**Learning:** Found multiple icon-only buttons (like Close, Next/Prev Panel, Navigation dots) in custom modals that completely lacked `aria-label` attributes. Screen readers would just read out "button" without context, making navigation practically impossible for visually impaired users.
**Action:** Always verify that interactive elements relying solely on icons (from lucide-react or similar libraries) have a descriptive `aria-label` or `title` (or both) to ensure screen readers can announce their purpose clearly.
## 2026-11-06 - Missing Confirmation Dialogs on Destructive Actions
**Learning:** Destructive actions like deleting a panel lack `window.confirm` dialogs, leading to accidental data loss. Furthermore, these icon-only buttons often lack keyboard focus styles and ARIA labels.
**Action:** Always guard destructive actions (e.g., delete, clear) with confirmation dialogs. Also, ensure icon-only buttons have an `aria-label` and a visible focus state (`focus-visible:ring-2`) for accessibility.
