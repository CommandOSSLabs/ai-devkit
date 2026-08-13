# Host-runnable workflows

Mechanics for treating CI, deploy, and operator steps as scripts that
any host can run. The YAML (or other remote CI file) only composes them.

## Scripts are the workflow

Prefer TypeScript run with bun (or the repo's existing automation
runtime) under `scripts/`. Each step is independently invocable on a
machine. A step that only works inside GitHub Actions is unfinished.

Manual is the default: a human or agent can run the same entry point
the remote composer calls. Automation is that composition with a
trigger, not a second implementation.

This is not a local-only mindset. Local, a JIT self-hosted runner,
GitHub-hosted compute, and every cloud environment are **hosts** and
**profiles**. The path itself stays production-quality. If a host
cannot run the path, extend the script or the local materialization
(`cmk:local-stack`, `cmk:infra`) — do not invent a host-specific
dialect beside the real one.

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
