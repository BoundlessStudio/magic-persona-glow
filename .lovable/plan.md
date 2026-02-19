

## Add a "Close/Clear" Tool for the Voice Agent

### Overview
Add a new tool called `close_overlay` (or similar) that the AI can invoke to dismiss whichever overlay is currently showing, returning the UI to the default persona view.

### Changes

#### 1. `src/hooks/use-realtime-voice.ts`
- Add one more entry to the `OVERLAY_TOOLS` array:
  ```
  { name: "close_overlay", description: "Close/dismiss the currently displayed UI overlay" }
  ```
- This automatically gets included in `TOOL_DEFINITIONS` and registered with the session.

#### 2. `src/pages/Index.tsx`
- In the `handleToolCall` callback, add a check: if the tool name is `"close_overlay"`, reset `currentState` back to the base state (mapping to the current voice state) instead of looking it up in `toolNameToOverlay`.
- This effectively dismisses whatever overlay is showing and returns to the persona view.

### Files to Modify
- `src/hooks/use-realtime-voice.ts` -- add one tool definition
- `src/pages/Index.tsx` -- handle the `close_overlay` tool name in the callback

