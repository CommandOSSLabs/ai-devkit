# Host-runnable workflows

Mechanics for treating CI, deploy, and operator steps as scripts that
any host can run. The YAML (or other remote CI file) only composes them.

## Contents

- [Scripts are the workflow](#scripts-are-the-workflow)
- [Language](#language)
- [Composer-contract drift](#composer-contract-drift)
- [Mutate gate](#mutate-gate)
- [Host matrix](#host-matrix)
- [Debug on the host that ran the step](#debug-on-the-host-that-ran-the-step)
- [When a remote job fails](#when-a-remote-job-fails)

## Scripts are the workflow

Each step is independently invocable on a machine. A step that only
works inside GitHub Actions is unfinished.

Manual is the default: a human or agent can run the same entry point
the remote composer calls. Automation is that composition with a
trigger, not a second implementation.

This is not a local-only mindset. Local, a JIT self-hosted runner,
GitHub-hosted compute, and every cloud environment are **hosts** and
**profiles**. The path itself stays production-quality. If a host
cannot run the path, extend the script or the local materialization
(`cmk:local-stack`, `cmk:infra`) — do not invent a host-specific
dialect beside the real one.

## Language

Programmable workflow and operator steps are TypeScript run with bun
(or the repo's existing automation runtime) under `scripts/`. That is
the default, not a suggestion next to a second ops language.

Shell stays for host bootstrap: installing the runtime, runner hooks,
and thin wrappers that exec the script. A host that cannot run bun
yet is a reason for a `.sh` bootstrap, not for rewriting the step.

Do not add a third ops language (Python, Ruby, a one-off DSL) for the
same class of step. Convert by replace, not shim: one implementation
site, the old file gone, callers and contract tests pointed at the
new path in the same change.

## Composer-contract drift

Extracting a fat inline `run:` into a script is unfinished until three
things move together:

1. The YAML step is a one-line invocation of the script.
2. Every contract that grepped the old YAML body retargets to the
   script. YAML is pinned only as "it calls that script"; policy
   lives in the script.
3. Every path-filter list that named the old body (the workflow's
   `on.push.paths`, a derived union, a frozen snapshot test) adds
   the new script. One source of truth; the others are asserted
   from it.

Do not raise a line-count or runner-class baseline to accept leftover
YAML. The baseline exists to force the extract.

## Mutate gate

A mutating script the laptop and GitHub both invoke refuses unless
the caller passes an explicit confirm (`--confirm` locally) or a
documented environment variable on CI. Absence is refuse, not a
soft skip. A protected GitHub Environment is not a substitute: the
same entry point still has to refuse on a laptop or JIT host that
has no Environment in the picture.

## Host matrix

Scripts that humans or agents run on a development machine support at
least Linux and macOS, amd64 and arm64. Profile-specific pieces (a
cloud attestation device, a vendor SDK) fail closed on hosts that
cannot satisfy them; they do not hide a second implementation.

A laptop may register as a JIT runner. That is another composer
calling the same scripts, not a reason to rewrite the steps.

JIT registration includes **how many jobs the host will run at
once**. A slot is one concurrent job. Single-job JIT configs
deregister after one job, so the host keeps that many slots alive
for the run. Size the count to the workflow's parallel legs and the
machine; a one-slot laptop serializes a graph that would otherwise
run concurrently. The count is a host knob (for example
`--runners N` on a local JIT wrapper). It is not a second workflow
and not an excuse to hard-code `max-parallel` as a workaround for a
host that cannot say how many jobs it will take.

## Debug on the host that ran the step

Prefer local or JIT execution when diagnosing a workflow so logs,
state, and tools sit next to the agent. Remote CI remains the
automation composer and the merge gate; it is a slow debugger.

Build images stay a standing cost. Host execution does not excuse an
unoptimized image. Keep container and enclave builds cacheable and
incremental regardless of where they run. Attested packing is
`cmk:enclave`.

## When a remote job fails

1. Reproduce the failed job **exactly as CI runs it** — copy the
   job's command, not an approximation. `cmk:delivery-ship` owns the
   verbatim-copy and clean-base attribution details.
2. Run the **whole relevant set** locally (the last red job plus the
   sibling gates that have been taking turns) and stay on the host
   until that set is green. Pushing after the first local fix of the
   last red job is how two independent failures become two CI cycles.
3. While a remote run is in flight, act on the first failed required
   job. Do not wait for the rest of the matrix to finish before
   starting the reproduce. `cmk:delivery-pipeline`'s proactivity
   rules own the never-idle-wait half of this.

Recognize **one-fix-per-push**: a clippy failure, then a local-chain
failure, then another lint, each discovered only after the previous
push. The loop ends when the bouncing set is green on the host.
