## 2024-05-24 - Add Window Confirm for Destructive Actions
**Learning:** Destructive actions without a confirmation dialogue can lead to accidental data loss and double-prompting bugs if placed in multiple levels.
**Action:** Guard destructive actions such as deleting comics, panels, bubbles, or sound effects with `window.confirm` dialogues. Place the logic carefully in parent state-updating handlers or child specific handlers, but not both.
