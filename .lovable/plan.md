
## Add Syntax Highlighting to CodeBlock

The current `CodeBlock` component renders code as plain monospace text with no color differentiation. The demo site uses proper syntax highlighting (keywords in blue/purple, strings in green, functions in yellow, etc.).

### What will change

The `CodeBlock` component will be updated to use **Shiki** -- a fast, accurate syntax highlighter that supports many languages and themes. Code will render with proper color-coded tokens matching the dark theme aesthetic of the demo site.

### Technical details

1. **Install `shiki`** -- a popular syntax highlighting library that works well in the browser
2. **Update `code-block.tsx`** to:
   - Use `shiki`'s `codeToHtml()` to generate highlighted HTML
   - Load the highlighter asynchronously and cache it
   - Fall back to plain text while the highlighter loads
   - Use a dark theme (e.g., `github-dark` or `one-dark-pro`) to match the current dark UI
   - Render the highlighted HTML via `dangerouslySetInnerHTML` inside the `<pre>` block
   - Preserve the existing line numbers feature with highlighted tokens
3. **No changes needed** to how `CodeBlock` is used in Sandbox or elsewhere -- the `code` and `language` props already exist
