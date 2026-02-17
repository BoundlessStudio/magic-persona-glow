

## Fix Persona Centering Over Ripple

**Problem**: `pt-20` on the wrapper pushes the Persona below the Ripple's visual center, which originates at 50%/50% of the viewport.

**Solution**: Separate the Persona and the control bar into independent positioned elements so the Persona is perfectly centered and the controls don't affect its position.

### Changes to `src/pages/Index.tsx`

- Remove the `flex-col` wrapper with `pt-20` and `gap-8`
- Place the `Persona` in an absolutely centered container (`absolute inset-0 flex items-center justify-center`) so it aligns exactly with the Ripple origin
- Place the control bar in a separate absolutely positioned container pinned to the bottom of the screen (e.g., `absolute bottom-8 left-1/2 -translate-x-1/2`)

### Result

```text
+---------------------------+
|                           |
|        Ripple BG          |
|      (origin: center)     |
|                           |
|       [ Persona ]  <-- perfectly centered
|                           |
|                           |
|     [ icon controls ]  <-- pinned near bottom
+---------------------------+
```

No other files need to change.
