---
name: pr-writing
description: Write pull request descriptions that show the change works with real evidence instead of only describing it. Load and follow this skill whenever you open a pull request, write or update its description, or prepare a change for review.
version: 1.0.0
---

# PR Writing

A reviewer spends most of their time picturing what the author already saw: the page they opened, the command they ran, the test that went green. Put that in the description. Prose that describes a change is a claim, not evidence.

Always load and follow this skill whenever opening or updating a pull request.

## 1. Zero AI attribution (mandatory)

Never include any AI/agent attribution line, footer, or commit trailer (`Co-Authored-By`, `Generated with...`, or `Written by an AI agent...`) anywhere in the PR title, PR body, comments, or commits.

## 2. Order the description for a skimmer

Most readers stop early, so put what matters first:

1. **The problem, in one paragraph.** What was wrong or missing, for whom, and how it showed up. Include real numbers when there are any.
2. **What changed.** Short, grouped by area, with repo-root-relative entry points in inline code. Not a list of commits.
3. **Evidence** (section 3).
4. **Details** a reviewer needs: migrations, trade-offs, what you tried that did not work, anything left to do.
5. **ELI5.** Two or three plain sentences someone outside the project would follow. If you cannot write it, the change probably is not clear yet.

## 3. Show it, with evidence that fits the change

| Change | Evidence |
|---|---|
| UI | Before and after screenshots of the same element, same viewport and crop. A short video for motion, hover, or a multi-step flow. A phone width when layout is involved. |
| CLI or build | The real output of the same command before and after, exit code included. Never retype or tidy it. |
| Bug fix | The input and the result before and after, and the regression test that failed first. |
| Performance | What you measured and how (machine, runs, inputs), the numbers on both sides, and how much they vary between runs. |
| AI or agent behaviour | The same set of real prompts on both sides, how answers were graded, time and cost per answer, and where the grading is unreliable. |
| New API, skill, or feature | The exact command, config, or code someone writes to use it, plus verification output proving it works. A pure addition has no "before": show it on its own. |
| Anything else | A small table, a diagram, or an HTML page comparing both versions. |

## 4. Keep it honest

- "After" is the current branch. "Before" is production, the base branch, or the last deploy. Never revert, stash, or switch branches to fake a "before".
- Look at every capture before using it, and check it shows what changed. Check that every image URL loads.
- Capture demo or sanitised data only: no real users, tokens, emails, or private messages.
- Report what went wrong too: a check that failed or could not run, a number that got worse, or a part of the test plan nobody has done yet.
- Never commit temporary screenshots or videos to the branch. Upload them to the pull request or reference hosted URLs.
- **Security fixes are the exception.** Do not publish a reproduction, a payload, or a step-by-step exploit in a public pull request. Describe the impact at a high level, follow the project's security policy, and keep the detailed evidence private until the fix is released.

## 5. Check before opening or updating the PR

- Zero AI attribution markers exist in the commits or PR body.
- Every claim in the description has real evidence next to it, or says why there is none.
- The ELI5 section is present and makes sense on its own.
- Nothing in the description was invented: no numbers, results, or test runs you did not actually execute and observe.
