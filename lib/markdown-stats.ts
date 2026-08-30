/** Word and character counts for the workspace status bar. */
export function markdownEditorStats(value: string) {
  return { words: value.trim() ? value.trim().split(/\s+/).length : 0, chars: value.length };
}
