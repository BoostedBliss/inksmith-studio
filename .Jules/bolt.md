## 2024-05-20 - Missing React.memo on Complex Child Components
**Learning:** Found that ComicPanelItem, SpeechBubbleItem, and SFXStickerItem are not using React.memo(). This means they re-render every time the parent (App.tsx or ComicCanvas.tsx) state changes, which is inefficient since the props likely don't change for unaffected panels/items.
**Action:** Use React.memo to wrap these complex components, combined with useCallback for their callback props to prevent unnecessary re-renders and improve performance.
