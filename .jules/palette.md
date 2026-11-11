## 2024-11-04 - Guarding Destructive Actions
**Learning:** Destructive actions like deleting a comic, panel, speech bubble, or sound effect in this app were happening immediately on click without confirmation, which can lead to accidental data loss and a frustrating user experience.
**Action:** Always guard destructive actions (such as deletions) with `window.confirm` dialogs or similar confirmation mechanisms to prevent accidental data loss.
