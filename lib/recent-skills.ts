"use client";

// "Recently opened" is a per-browser convenience, not repository data — it
// lives in localStorage and is read after mount so the static HTML and the
// first client render agree. A browser that refuses storage just never has
// recents; nothing else changes.
const KEY = "ai-devkit-recent-skills";
const LIMIT = 8;

export function readRecentSkills(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string").slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

export function rememberSkill(id: string): void {
  try {
    const next = [id, ...readRecentSkills().filter((v) => v !== id)].slice(0, LIMIT);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — recents just don't accumulate
  }
}
