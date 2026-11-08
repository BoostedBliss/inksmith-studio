## 2024-03-21 - Icon-Only Button Accessibility in Modals
**Learning:** Found multiple icon-only buttons (like Close, Next/Prev Panel, Navigation dots) in custom modals that completely lacked `aria-label` attributes. Screen readers would just read out "button" without context, making navigation practically impossible for visually impaired users.
**Action:** Always verify that interactive elements relying solely on icons (from lucide-react or similar libraries) have a descriptive `aria-label` or `title` (or both) to ensure screen readers can announce their purpose clearly.
## 2024-11-08 - Added confirm dialog for destructive actions
**Learning:** Guarding destructive UI actions (such as deletions) with `window.confirm` dialogs prevents accidental data loss and improves user confidence.
**Action:** Consistently apply `window.confirm` or similar confirmation patterns before executing irreversible actions like deleting comics, panels, speech bubbles, or SFX.
