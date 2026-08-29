"use client";

// Local drafts outlive the component that made them. Leaving a skill to check
// something and coming back should not silently throw away what you typed, so
// drafts are kept per skill in sessionStorage: they survive route changes and
// reloads, and they end with the browser tab. That matches what the UI
// promises — a scratch buffer that never reaches the repository — while
// keeping the promise across navigation, which component state could not.
const KEY_PREFIX = "ai-devkit-skill-drafts:";

export type SkillDrafts = Record<string, string>;

export function readSkillDrafts(skillId: string): SkillDrafts {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + skillId);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: SkillDrafts = {};
    for (const [id, text] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof text === "string") out[id] = text;
    }
    return out;
  } catch {
    return {};
  }
}

export function writeSkillDrafts(skillId: string, drafts: SkillDrafts): void {
  try {
    if (Object.keys(drafts).length === 0) sessionStorage.removeItem(KEY_PREFIX + skillId);
    else sessionStorage.setItem(KEY_PREFIX + skillId, JSON.stringify(drafts));
  } catch {
    // storage unavailable or full — drafts simply stay in memory for this view
  }
}
