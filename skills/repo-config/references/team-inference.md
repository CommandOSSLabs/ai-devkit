# Team inference recipe

Load this file **only when Decision H (Team) runs**. Follow every step in order.
Local files and local `git` only — no code-host membership APIs.

Explainer: **team** composition — the **roster** of people/roles and optional CODEOWNERS ownership notes — is standing context for `cmk:scope`, `cmk:interview`, `cmk:delivery-spec-plan`, `cmk:delivery-build`'s `references/continuous.md`, `cmk:delivery-review`, `cmk:delivery-ship`, and `cmk:delivery-handoff`'s `references/handoff-document.md`. Those skills **package** collaboration by **band** (Solo / Small / Multi) using the rules written in `docs/agents/project.md` `## Team`. Wrong band → wrong packaging (invented reviewers on a solo repo, or silent ownership on a multi-person one). Same class of fact as Project posture; orthogonal to delivery intent / lifecycle stage.

Explainer for the user (short): you will see a draft roster from local metadata; edit names, roles, or switch to count form (`N × Role`); nothing is written until you confirm.

Recommend: accept the draft after re-roling placeholders to real titles when you know them; use count form when privacy matters; set a **Workflow band override** only when the roster does not match how this repo is actually run (e.g. monorepo with one agent user).

## TOC

1. [Repo age window](#1-repo-age-window)
2. [Active authors (git)](#2-active-authors-git)
3. [CODEOWNERS](#3-codeowners)
4. [Manifests](#4-manifests)
5. [Role defaults](#5-role-defaults)
6. [Present the draft](#6-present-the-draft)
7. [Confirm gate](#7-confirm-gate)
8. [Forbidden](#8-forbidden)

---

## 1. Repo age window

Compute the age of the oldest commit (`git log --reverse --format=%ct -1`) versus now.

- If the span is **&lt; 12 months** → use **all history**.
- Else → use commits **since `now − 365 days`**.

**Done when:** the since-cutoff (or “all history”) is known.

## 2. Active authors (git)

Run `git shortlog -sn --all` with the matching since (or without `--since` if all history).

- Take the **top 10** by commit count.
- Drop bots: `dependabot[bot]`, `github-actions`, `renovate`, any name matching `*\[bot\]`.
- Prefer the display name from shortlog; keep email only as a draft disambiguation note when names collide.

**Done when:** a ranked list of up to 10 human authors exists.

## 3. CODEOWNERS

Read the first file that exists among:

1. `CODEOWNERS`
2. `.github/CODEOWNERS`
3. `docs/CODEOWNERS`

Parse non-comment lines as `pattern owner1 owner2…`.

| Destination | Rule |
|---|---|
| **Ownership notes** | Every owner token, including `@org/team` — record `pattern → token`. Do **not** resolve org teams via API. |
| **Roster** | Only **human-like** tokens (no `@org/…` team slugs; no pure email unless the user later confirms that person). Humans not in the top-10 still appear on the **roster** when they look like people/handles. |

**Done when:** ownership notes list is complete; roster has human-like CODEOWNERS owners unioned with git authors.

## 4. Manifests

If present, read:

- `AUTHORS`
- `CONTRIBUTORS`
- `package.json` fields `author` / `contributors` (string or object `name` fields only)

Add human names missing from the roster.

**Done when:** manifests have been scanned.

## 5. Role defaults

Do **not** invent job titles from commit volume.

- Default each person to `Contributor — <Name>` (user re-roles on confirm).
- Single human author: still `Contributor — <Name>` unless the user already stated a title.
- Frontend/Backend suggestions from path clusters are **presentation recommendations only**, never silent final titles.

**Done when:** every roster entry has a provisional role string.

## 6. Present the draft

Show the user:

1. **Roster** (prefer `Role — Name`; allow `N × Role` when they prefer counts)
2. **Ownership notes**
3. **Derived band** using the rules in `references/templates/agents/project.md` `## Team` / the written section shape
4. Suggested role vocabulary: Tech Lead, Backend Engineer, Frontend Engineer, Full-stack Engineer, Designer, Product Manager, QA, DevOps/SRE, Docs (freeform allowed)

Invite add / remove / rename / re-role and named vs count form.

If metadata is empty → empty roster + explicit ask for people and/or roles. Never invent personal names or titles not grounded in metadata or the user's answer.

**Done when:** the user has seen the draft and edited it if they wished.

## 7. Confirm gate

No Team content is written to disk until the user **explicitly confirms** this decision in the same setup run. Inference never auto-writes.

**Done when:** the user has confirmed the Team decision (or declined to set Team — record that for fill-the-gaps later).

## 8. Forbidden

- `gh` / `glab` collaborator or org-member APIs
- Linear/GitHub team membership expansion
- Reading `env` / `*_API_KEY` to discover people
- Inventing names or roles not in metadata or user answers

**Done when:** none of the above were used.
