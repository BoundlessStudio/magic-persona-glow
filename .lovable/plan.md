

## Add "Upload" State to Persona with Dropzone UI

**Goal**: Add a new `upload` state to the Persona component, with an Upload icon button in the controls. When active, a styled dropzone (matching the better-upload/shadcn design) appears overlaying the center area.

Since this is a **design prototype with no server**, we will not install `@better-upload/client` or `@better-upload/server`. Instead, we will create a standalone `UploadDropzone` component that replicates the better-upload visual design using `react-dropzone` for drag-and-drop behavior -- no actual upload logic.

### Changes

**1. Install `react-dropzone`**
- Required for drag-and-drop file interaction in the dropzone UI.

**2. Create `src/components/ui/upload-dropzone.tsx`**
- A self-contained dropzone component styled to match the better-upload shadcn component (dashed border, Upload icon, description text, drag-active state).
- Props: `accept`, `description` (object with `maxFiles`, `maxFileSize`, `fileTypes`), `onDrop` callback.
- No dependency on `@better-upload/client` -- purely visual with `react-dropzone`.

**3. Update `src/components/ai-elements/persona.tsx`**
- Add `"upload"` to the `PersonaState` type union.
- No Rive state machine input needed for upload (the Persona can remain in idle animation while the upload UI is shown as an overlay).

**4. Update `src/pages/Index.tsx`**
- Add `Upload` icon from `lucide-react` to the `stateIcons` array for the new `upload` state.
- When `currentState === "upload"`, render the `UploadDropzone` component in a centered overlay above the Persona (with a semi-transparent backdrop and fade-in animation).
- The dropzone will show: "Drag and drop files here" with a description like "You can upload 4 files. Each up to 2MB. Accepted JPEG, PNG, GIF."
- The `onDrop` callback will be a no-op (or show a toast) since there is no server.

### Visual Layout in Upload State

```text
+---------------------------+
|        Ripple BG          |
|                           |
|   +-------------------+   |
|   | [Upload icon]     |   |
|   | Drag & drop here  |   |  <-- dropzone overlay
|   | 4 files, 2MB max  |   |
|   +-------------------+   |
|                           |
|     [ icon controls ]     |
+---------------------------+
```

### Technical Details

- The Persona animation will continue playing behind the dropzone (with reduced opacity or hidden) when in upload state.
- The dropzone will have `z-30` to sit above the Persona layer.
- Clicking any other state button dismisses the dropzone and returns to normal Persona view.

