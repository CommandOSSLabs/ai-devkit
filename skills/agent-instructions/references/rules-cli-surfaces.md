# CLI surfaces

Load when: adding, changing, or reviewing a command-line command, especially
one that forwards flags to another command.

## Paired commands document each other

When one command forwards flags or arguments to another — a wrapper that
passes a `--` remainder through to an inner command, or a shorthand that
calls a more general one underneath — the forwarding command's `--help` must
enumerate the forwardable knob groups, not just point at the inner command
by name. An operator reading `outer --help` should learn what's actually
forwardable without having to separately discover and read `inner --help`
first.

## Keep both sides in sync in the same change

Adding, renaming, or removing a knob on the inner command updates the outer
command's help text — and any guide or reference document that describes the
pairing — in the same change that touches the inner command. Treat drift
between the two as a defect, not a follow-up.

## Pin the pairing with a test where practical

Where the tooling supports it, add a test that compares the outer command's
help text against the inner command's real argument parser definition, so a
knob added to one side without the other fails CI instead of surfacing as a
confusing runtime surprise for an operator.

## Worked example

A deployment CLI's `start` subcommand spins up a batch of workers by forwarding
most of its flags to a lower-level `run-worker` command via a `--` passthrough.
If `run-worker` gains a new `--max-retries` flag, `start --help` must grow a
line documenting `--max-retries` (or the forwardable group it belongs to) in
the same commit — not several commits later once an operator files a
confused bug report about a flag that "doesn't seem to do anything" on the
outer command. A small test that diffs `start --help`'s forwarded-flag
section against `run-worker`'s real parser definition catches this
automatically the next time either side drifts.
