// Plain constants, no node imports: client components link to GitHub too, and
// pulling them off repo-snapshot.ts would drag node:child_process into the
// browser bundle.
export const REPO_URL = "https://github.com/CommandOSSLabs/ai-devkit";
export const REPO_SKILLS_TREE = `${REPO_URL}/tree/main/skills`;
export const REPO_SKILLS_BLOB = `${REPO_URL}/blob/main/skills`;
export const commitUrl = (sha: string) => `${REPO_URL}/commit/${sha}`;
