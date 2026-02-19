

## Decouple Voice State from Overlay Display

### Problem
`currentState` is a single variable serving two purposes: controlling the Persona animation state AND tracking which overlay component is visible. When the voice state changes (e.g., "listening" to "thinking" to "speaking"), a `useEffect` resets `currentState` to the persona state, which can cause the currently displayed overlay to disappear due to timing/race conditions.

### Solution
Separate the overlay tracking into its own independent state variable, removing it from `currentState` entirely. `currentState` will only control the Persona animation, and a new `activeOverlay` state will independently control which component overlay is visible.

### Changes to `src/pages/Index.tsx`

1. **Replace the dual-purpose `currentState`** with two independent pieces of state:
   - `personaState` (derived from `voiceState`) -- controls the Persona animation only
   - `activeOverlay` (set by tool calls and bar clicks) -- controls which component overlay is visible, independent of voice state changes

2. **Simplify the voice state sync**: Instead of a `useEffect` that conditionally updates `currentState`, directly derive the persona state from `voiceState` using the existing `voiceStateToPersona` map. The Persona component receives this directly.

3. **Update tool call handler**: `handleToolCall` sets `activeOverlay` instead of `currentState`. The `close_overlay` tool simply sets `activeOverlay` to `null`.

4. **Update bar icon click handlers**: clicking a bar icon sets `activeOverlay` instead of `currentState`.

5. **Update overlay visibility logic**: the overlay enter/exit effect reads from `activeOverlay` instead of checking if `currentState` is in the overlay list.

6. **Persona state when overlay is active**: when `activeOverlay` is set, pass `"idle"` to Persona (as it does now); otherwise pass the voice-derived persona state.

### Resulting Data Flow

```text
voiceState changes --> personaState updates (direct derivation)
                       (no effect on activeOverlay)

tool call / bar click --> activeOverlay updates
                          (no effect on personaState)

close_overlay / bar click --> activeOverlay = null
                              (persona resumes showing voiceState)
```

### Files to Modify
- `src/pages/Index.tsx` -- refactor state management as described above
