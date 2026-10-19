# Triage label mapping (agent-facing)

Written by `cmk:repo-config`. Maps canonical triage roles to this repo's actual labels.

| Canonical role | Label in this repo |
|---|---|
| needs-triage | <label> |
| needs-info | <label> |
| ready-for-agent | <label> |
| ready-for-human | <label> |
| shaping | <label> |
| building | <label> |
| in-review | <label> |
| shipped | <label> |
| wontfix | <label> |
| bug | <label> |
| enhancement | <label> |

Rule: every triaged issue carries exactly one category role (bug/enhancement)
and one state role. A skill that moves an issue to a new state removes the old state
role in the same edit. `shipped` marks a closed issue whose change is in a release.
