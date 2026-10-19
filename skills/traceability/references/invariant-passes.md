# Invariant passes

Load when `docs/design/` exists. Produces **E4**, **E5**, **W3**; the
finding table in `SKILL.md` defines them and stays their one home.

The whole-tree and textual-only rules from `SKILL.md`'s NON-NEGOTIABLE section
bind these passes: E4/E5/W3 check only that a `Respects: ARCH-N` citation names a
*live* invariant. Never judge whether the design actually respects it.

**4. Invariant definitions** — bold `**ARCH-N**` in the spine, split into a *retired*
set (struck) and a *live* set (survivors), exactly as pass 1 handles requirements.

```bash
# retired invariants — the E5 set (struck-through, captured BEFORE deletion)
grep -rhoE '~~\*\*ARCH-[0-9]+\*\*~~' docs/design | grep -oE 'ARCH-[0-9]+' | sort -u
# live invariants — strike spans deleted first, then match (as in pass 1)
grep -rh '' docs/design --include='*.md' \
  | sed -E 's/~~[^~]*~~//g' \
  | grep -oE '\*\*ARCH-[0-9]+\*\*' | grep -oE 'ARCH-[0-9]+' | sort -u
```

The first grep is the **retired** set; the second (struck spans removed) is the
**live** set. An `ARCH-N` in neither is undefined.

**5. Respects citations** — each `ARCH-N` on a `Respects:` line in any `design.md`.

```bash
grep -rnE 'Respects:.*ARCH-[0-9]+' docs/specs --include='*design.md' \
  | grep -oE '^[^:]+:|ARCH-[0-9]+'
```

Each cited `ARCH-N` belongs to the `design.md` it sits in.
