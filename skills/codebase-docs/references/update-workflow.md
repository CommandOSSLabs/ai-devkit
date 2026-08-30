# Update workflow

1. **Locate affected nodes.** Given the change (new feature, renamed module, deleted subsystem), find every doc that mentions it. `grep -r` on the old name is usually enough.

2. **Edit in place.** Preserve the existing structure; don't rewrite docs that still describe reality. Update file-path hints, symbol names, and one-line summaries as needed.

3. **Add new nodes if genuinely new.** A new area gets a new folder + `README.md`; a new topic inside an existing area gets a new leaf and a line in the parent's menu.

4. **Remove stale nodes.** If a subsystem is deleted, delete its doc and remove it from the parent's menu. Don't leave tombstones.

5. **Re-verify links and symbols** for every edited file.
