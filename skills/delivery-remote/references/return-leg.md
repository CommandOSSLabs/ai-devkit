# The return leg

How finished work gets off the host. Loaded from `SKILL.md` Phase 5 when the run
has stopped. The outbound leg never touches GitHub; only this file does.

**Contents:** [Bringing the branch back](#bringing-the-branch-back) ·
[`pr` mode](#pr-mode) · [Credential on the host](#credential-on-the-host)

## Bringing the branch back

The agent commits in the host's **working clone**. The bare repo that the local
`hostbuild` remote points at has never seen those commits, so a fetch straight
after the run returns the commit you pushed *out*, exits 0, and looks like
success. Run these in order, every time:

1. `ssh <alias> 'git -C <RUNDIR> push origin <branch>'` — working clone to bare
   repo. `origin` inside the run root is the bare repo, not GitHub, so this one
   step needs no credential and plain SSH is fine.
2. `git fetch hostbuild <branch>` on this machine.
3. **Compare the fetched tip with `BASE`.** Equal means nothing came back:
   step 1 was skipped or failed. Do not report a return.

Then `return: fetch` is finished. `return: pr` continues below.

## `pr` mode

The host opens the pull request with its own credential, because the SSH agent
that reached GitHub during dispatch is gone once the run detaches.

Every command in this section runs inside the tmux server, not over plain SSH:
host credentials live behind the login keychain. Measured on 2026-09-09 with a
valid login — over plain SSH `gh auth status` answered `The token in default is
invalid`; the same command in a console tmux pane answered `Logged in (keyring)`.

1. **Push to GitHub** from the run root:
   `git -C <RUNDIR> push github <branch>`, where `github` is the run clone's
   second remote (`origin` stays the bare repo). Add it once during per-repo
   setup: `git -C <RUNDIR> remote add github <the URL matching the push protocol below>`.
2. **Check for an existing pull request** before creating one:
   `gh pr list --head <branch> --state open --json number,url`. A row means this
   head already has a PR — the push in step 1 has updated it. Stop there. Never
   open a second pull request for the same head.
3. **Create it** when that list is empty:

   ```
   gh pr create --repo <owner>/<repo> --base <default-branch> --head <branch> \
     --title "<the plan's Goal line>" --body-file <body>
   ```

4. **The body carries what a reviewer cannot reconstruct** from the diff: the
   plan path, the base SHA the host built at, the agent id and model, the route
   that ran, and the driver's own turn/token/cost fields. Anything the run
   skipped goes in the body too, not only in the local report.
5. Record the PR URL in the run record, and report it.

`gh pr create` with no `--title`/`--body` prompts interactively and will hang a
non-interactive session. Always pass both.

## Credential on the host

`return: pr` needs a credential the host owns. Two paths, and they differ in
**scope**, not in difficulty. Under full autonomy the agent can reach whatever
this credential can reach, so the choice is a real one.

### Option A — `gh auth login` on the host  ·  `verified 2026-09-09`

One command, run by the user on the host: `gh auth login`. Nothing else is
installed; no token file, no `GH_TOKEN` export.

Two consequences the login does not announce, both measured:

- **The token is account-wide.** Scopes come out `repo`, `read:org`, `gist`,
  `admin:public_key` — push and pull-request rights on *every* repository in the
  account, not the one dispatched for.
- **It sets `Git operations protocol: ssh` and configures no git credential
  helper.** The push therefore travels over SSH, using a key of the host's own
  that GitHub already knows — not the `gh` token, and not a forwarded agent.
  Confirm before relying on it, inside tmux and with forwarding disabled:
  `ssh -o BatchMode=yes -o IdentitiesOnly=yes -i ~/.ssh/<key> -T git@github.com`
  must greet the account. If it does not, add the host's key to GitHub or switch
  the remote to HTTPS and use Option B.

### Option B — a fine-grained PAT via `GH_TOKEN`

Narrower, and unaffected by the keychain. `gh auth login --with-token` is
documented for **classic** tokens and wants `repo`, `read:org` and `gist`; for a
fine-grained token the GitHub CLI manual directs you to the `GH_TOKEN`
environment variable instead.

**Minimum repository permissions**, per GitHub's own mapping of permissions to
operations:

| Permission | Level | Why |
|---|---|---|
| Contents | Read and write | push commits |
| Pull requests | Read and write | open the pull request |
| Metadata | Read-only | mandatory, granted automatically |
| Workflows | Read and write | **only** when the branch edits `.github/workflows/` |

Select the individual repositories the host is allowed to build. That selection
is the boundary that keeps a full-autonomy run from reaching the rest of the
account.

Install it on the host, never in the repo and never in the manifest:

1. Write the token to `~/.config/host-build/gh-token`, mode `600`.
2. The dispatch wrapper exports it: `export GH_TOKEN=$(cat ~/.config/host-build/gh-token)`.
3. Let `gh` answer git's credential prompt so the token never lands in
   `.git/config`:
   `git -C <RUNDIR> config credential.https://github.com.helper '!gh auth git-credential'`.
4. Verify before trusting it: `GH_TOKEN=… gh auth status` names the token's
   account, and `git -C <RUNDIR> push --dry-run github <branch>` proves the push
   path without writing anything.

Under either option the credential appears in no log, no run record, no report,
and no PR body. When a run needs one and it is absent, that is a stop with a
named remedy, not a silent downgrade to `fetch`.
