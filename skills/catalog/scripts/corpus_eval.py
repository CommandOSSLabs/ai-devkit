"""Evaluate gold-label judgment rules against classify_paths."""

from __future__ import annotations

from typing import Any

from reconcile import classify_paths, obs_id


def evaluate_gold(
    owns: dict[str, set[str]],
    paths: list[str],
    gold: dict[str, Any],
) -> dict[str, Any]:
    """Return a report with failures[] empty on pass.

    Critical-miss rules classify the single path (uncapped) so FINDINGS_MAX
    truncation cannot hide a required OBS judgment.
    """
    failures: list[str] = []
    rows = classify_paths(paths, owns)

    for rule in gold.get("critical_miss", []):
        path = rule["path"]
        single = classify_paths([path], owns)
        if not single:
            failures.append(f"critical_miss: no finding for {path}")
            continue
        row = single[0]
        want = rule["change_class"]
        if row["change_class"] != want:
            failures.append(
                f"critical_miss: {path} got {row['change_class']} want {want}"
            )
        forbidden = set(rule.get("forbidden_codes") or [])
        hit = forbidden.intersection(row.get("codes") or [])
        if hit:
            failures.append(
                f"critical_miss: {path} assigned forbidden codes {sorted(hit)}"
            )
        if want == "new-capability-candidate":
            oid = row.get("observation_id") or ""
            if not str(oid).startswith("OBS-"):
                failures.append(f"critical_miss: {path} missing OBS id")

    must_codes = set(gold.get("must_known_impact_codes") or [])
    if must_codes:
        seen = {
            c
            for r in rows
            if r["change_class"] == "known-impact"
            for c in (r.get("codes") or [])
        }
        missing = must_codes - seen
        if missing:
            failures.append(f"must_known_impact_codes missing {sorted(missing)}")

    for path in gold.get("must_appear_in_capped") or []:
        blob = "\n".join(
            item.get("locator", "")
            for r in rows
            for item in (r.get("evidence") or {}).get("items") or []
        )
        if path not in blob:
            failures.append(f"must_appear_in_capped missing {path}")

    banned = gold.get("forbidden_observation_id_substrings") or []
    for r in rows:
        oid = r.get("observation_id") or ""
        for bad in banned:
            if bad and bad in oid:
                failures.append(f"forbidden OBS substring {bad!r} in {oid}")

    min_new = gold.get("expect_min_new_capability")
    new_count = sum(1 for r in rows if r["change_class"] == "new-capability-candidate")
    if min_new is not None and new_count < min_new:
        failures.append(f"expect_min_new_capability {min_new} got {new_count}")

    expect_owns = gold.get("expect_owns_with")
    if expect_owns is not None:
        with_owns = sum(1 for ps in owns.values() if ps)
        if with_owns != expect_owns:
            failures.append(f"expect_owns_with {expect_owns} got {with_owns}")

    stability_path = (gold.get("stability") or {}).get("path")
    stability_obs = None
    if stability_path:
        stability_obs = obs_id([stability_path])

    return {
        "failures": failures,
        "new_capability_count": new_count,
        "stability_obs_id": stability_obs,
        "finding_count": len(rows),
    }
