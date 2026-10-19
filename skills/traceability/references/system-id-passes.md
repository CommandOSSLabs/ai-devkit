# System-ID passes

Load when a canonical security or reliability doc exists. Produces **E6**–**E10**;
the finding table in `SKILL.md` defines them and stays their one home. Skip
entirely when the relevant canonical file is missing.

Skip entirely when the relevant canonical file is missing. Only extract
**definitions** from:

| Family | Definition file (canonical) |
|---|---|
| `TB-N`, `THR-N` | `docs/security/threat-model.md` |
| `CMP-N` | `docs/security/compliance.md` |
| `SLO-N` | `docs/ops/reliability.md` |

Definitions are bold `**TB-N**` / `**THR-N**` / `**CMP-N**` / `**SLO-N**` after
striking `~~…~~` spans (same retirement rule as requirements). Numbering is
repo-wide per family; never renumber or reuse.

**Citations** only from feature `design.md` lines:

```bash
# Security citations — only on Security: lines
grep -rnE '^Security:.*(TB|THR|CMP)-[0-9]+' docs/specs --include='*design.md' \
  | grep -oE '^[^:]+:|(TB|THR|CMP)-[0-9]+'

# Reliability citations — only on Reliability: lines
grep -rnE '^Reliability:.*SLO-[0-9]+' docs/specs --include='*design.md' \
  | grep -oE '^[^:]+:|SLO-[0-9]+'
```

Do **not** treat these IDs as task-footer citations. Do **not** emit a warning
solely because a live system ID is uncited by any design.
