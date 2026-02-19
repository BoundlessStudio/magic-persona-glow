

## Hide Command Bar by Default and Add Voice Toggle Tool

### Overview
The bottom command bar (pill-shaped icon row) will be hidden by default. A new tool called `toggle_command_bar` will be added so the AI voice agent can show or hide it during conversation.

### Changes

#### 1. `src/pages/Index.tsx`
- Add a new state: `const [barVisible, setBarVisible] = useState(false)`
- Wrap the bottom bar `<div>` (line 978) with a conditional or visibility class based on `barVisible`
- Update `handleToolCall` to handle `"toggle_command_bar"` by toggling `barVisible`
- Add a smooth transition (e.g., translate-y + opacity) so the bar slides in/out

#### 2. `src/hooks/use-realtime-voice.ts`
- Add a new entry to `OVERLAY_TOOLS`:
  ```
  { name: "toggle_command_bar", description: "Toggle the visibility of the component command bar at the bottom of the screen" }
  ```
- This automatically gets included in `TOOL_DEFINITIONS` and registered with the session.

### Files to Modify
- `src/hooks/use-realtime-voice.ts` -- add one tool definition
- `src/pages/Index.tsx` -- add `barVisible` state, hide bar by default, handle the new tool in the callback
