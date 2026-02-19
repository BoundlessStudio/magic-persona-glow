

## Add AI Tools to Show Component Overlays

### Overview
Register a tool for each component in the control bar with the OpenAI Realtime API session. When the AI decides to invoke a tool, the data channel event handler will trigger the corresponding overlay to appear.

### Components to Register as Tools
All 23 overlay states from `upload` through `chatbot`:
upload, preview, attachments, chain-of-thought, confirmation, plan, queue, env-vars, file-tree, sandbox, stack-trace, terminal, test-results, workflow, tweet-card, progress-bar, hx-calendar, hx-video, hx-table, kb-color-picker, kb-qr-code, kb-chart, chatbot

### Technical Plan

#### 1. Define tool definitions array
Create a constant mapping each overlay to an OpenAI Realtime tool definition with a descriptive name and description (no parameters needed). Example:

```text
{ type: "function", name: "show_upload", description: "Show the file upload dropzone" }
{ type: "function", name: "show_preview", description: "Show the web preview browser" }
{ type: "function", name: "show_chatbot", description: "Show the chatbot interface" }
... etc for all 23 components
```

#### 2. Update `use-realtime-voice.ts`
- Accept an `onToolCall` callback in the hook options
- After the data channel opens, send a `session.update` event to register all tools with the session
- Handle `response.function_call_arguments.done` events from the server -- extract the tool name and call `onToolCall(toolName)`
- Send `conversation.item.create` (with tool result) and `response.create` back to acknowledge the tool call so the AI continues

#### 3. Update `Index.tsx`
- Pass an `onToolCall` handler to `useRealtimeVoice` that maps tool names (e.g., `"show_upload"`) to setting the corresponding overlay state via `setCurrentState`
- This reuses the existing overlay system -- clicking a bar icon and an AI tool call both funnel through `setCurrentState`

#### 4. Tool name mapping
A simple record maps tool function names to overlay states:

```text
"show_upload"        -> "upload"
"show_preview"       -> "preview"
"show_attachments"   -> "attachments"
"show_chain_of_thought" -> "chain-of-thought"
... etc
```

### Files to Modify
- `src/hooks/use-realtime-voice.ts` -- add tool definitions, session.update on connect, handle function_call events, accept onToolCall callback
- `src/pages/Index.tsx` -- pass onToolCall to the hook, map tool names to overlay states

### No New Dependencies Required

