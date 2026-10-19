---
name: cmk:go
description: Builds the named tickets, or every ready one, through review to an open pull request each, and ends with one message. Run it with /cmk:go or /cmk:go #N.
version: 1.0.1
disable-model-invocation: true
---

# Go

The third of the five commands. It takes Ready tickets to In review. The states are the roles in
`docs/agents/triage-labels.md`.

REQUIRED SUB-SKILL: use `cmk:delivery-pipeline`. When the operator named tickets (`/cmk:go #23 #31`),
its frontier is those tickets only. Every other ticket keeps its state. With no IDs, the
frontier is every ready ticket.

End with `cmk:delivery-pipeline`' one message.
