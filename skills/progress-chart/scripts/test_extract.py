"""Behavior tests for extract.py (unittest, stdlib only).

Each test builds a small git repo shaped like a consuming project: a roadmap with
After: and legacy implicit order, a catalog shard, spec folders, ADRs, an
architecture spine, a ledger, and dated commits that move feature statuses.
"""

from __future__ import annotations

import os
import subprocess
import tempfile
import unittest
from pathlib import Path

from extract import extract

ROADMAP = """# Roadmap: Demo

Status: Approved
Date: 2026-10-01

| ID | Milestone | Outcome | Depends-on | Commitment |
|---|---|---|---|---|
| MILE-1 | Accounts | A person signs in. | none | Closed |
| MILE-2 | Reading | A person reads posts. | MILE-1 | Committed |
| MILE-3 | Sharing | A person shares a post. | MILE-2 | Planned |

## MILE-1 — Accounts

**Outcome:** A person signs in.
**Goals:** None
**Members:**
- **ROAD-1** accounts — Surfaces: `api/accounts/`
**Depends-on:** none
**Commitment:** Closed
**Closed:** abc1234
**Deferred:** None
**Blockers:** None

## MILE-2 — Reading

**Outcome:** A person reads posts.
**Goals:** None
**Members:**
- **ROAD-2** subscribe — Surfaces: `api/feeds/`, `api/migrations/`
- **ROAD-3** poller — Surfaces: `worker/poller/`
- ~~**ROAD-4**~~ dropped 2026-09-01: merged into ROAD-3
- **ROAD-5** read-state — Surfaces: `api/read_state/`, `api/migrations/`
**Depends-on:** MILE-1
**Commitment:** Committed 2026-09-10
**Closed:** None
**Deferred:** **ROAD-11** offline-mode — deferred 2026-09-20: no demand yet
**Blockers:** None

## MILE-3 — Sharing

**Outcome:** A person shares a post.
**Goals:** None
**Members:**
- **ROAD-6** share-links — After: MILE-2 — Surfaces: `api/share/`, `api/migrations/`
- **ROAD-7** public-view — After: ROAD-6 — Surfaces: `web/public/`
- **ROAD-8** share-sheet — After: ROAD-6 — Surfaces: `web/share/`
- **ROAD-10** analytics — After: ROAD-3 — Surfaces: `api/analytics/`, `api/migrations/0042.sql`
**Depends-on:** MILE-2
**Commitment:** Planned
**Closed:** None
**Deferred:** None
**Blockers:** None
"""

ROADMAP_FINAL = ROADMAP.replace(
    "- **ROAD-10**", "- **ROAD-9** link-expiry — Surfaces: `api/share/`\n- **ROAD-10**"
)

INDEX = """# Spec Index

| Domain | Scope | Surface roots | Feature catalog |
|---|---|---|---|
| core | Core | `api/` | [catalog](./catalog/core.md) |
"""


def catalog(rows: list[tuple[str, str, str]]) -> str:
    lines = ["# Core catalog", "", "| Code | Feature | Spec | Status | Roadmap item |", "|---|---|---|---|---|"]
    for code, status, road in rows:
        lines.append(f"| {code} | {code.title()} feature | [spec](../2026-09-01-{code.lower()}/) | {status} | {road} |")
    return "\n".join(lines) + "\n"


class Repo:
    def __init__(self, root: Path):
        self.root = root
        self._git("init", "-q", "-b", "dev")
        self._git("config", "user.email", "t@example.com")
        self._git("config", "user.name", "T")

    def _git(self, *args: str, date: str | None = None) -> None:
        env = dict(os.environ)
        if date:
            env["GIT_AUTHOR_DATE"] = env["GIT_COMMITTER_DATE"] = f"{date}T12:00:00"
        subprocess.run(["git", *args], cwd=self.root, check=True, env=env, capture_output=True)

    def write(self, rel: str, text: str) -> None:
        p = self.root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)

    def commit(self, msg: str, date: str) -> None:
        self._git("add", "-A")
        self._git("commit", "-q", "-m", msg, date=date)


def build(root: Path) -> None:
    r = Repo(root)
    r.write("docs/roadmap/INDEX.md", ROADMAP)
    r.write("docs/specs/INDEX.md", INDEX)
    r.write("docs/specs/catalog/core.md", catalog([("ACCT", "Implemented", "ROAD-1"), ("SUBS", "Draft", "ROAD-2")]))
    r.write("docs/design/system.md", "# Architecture\n\n## Invariants\n\n- **ARCH-1** Dependencies point inward.\n  More prose.\n\n- **ARCH-2** Tenant scope is **checked** in `server`\n  code, always.\n")
    r.write("docs/decisions/0001-first.md", "# ADR-0001: First decision\n\n**Status:** Accepted\n**Date:** 2026-08-01\n")
    r.commit("docs: seed", "2026-08-20")
    # SUBS goes Draft -> In-progress -> Implemented inside the month, outside the week
    r.write("docs/specs/catalog/core.md", catalog([("ACCT", "Implemented", "ROAD-1"), ("SUBS", "In-progress", "ROAD-2")]))
    r.commit("docs(SUBS): start", "2026-09-20")
    r.write("docs/specs/catalog/core.md", catalog([("ACCT", "Implemented", "ROAD-1"), ("SUBS", "Implemented", "ROAD-2"), ("POLL", "Approved", "ROAD-3")]))
    r.commit("docs(SUBS): implemented", "2026-09-25")
    # inside the week: POLL implemented, READ starts, roadmap gains ROAD-9
    r.write("docs/specs/catalog/core.md", catalog([("ACCT", "Implemented", "ROAD-1"), ("SUBS", "Implemented", "ROAD-2"), ("POLL", "Implemented", "ROAD-3"), ("READ", "In-progress", "ROAD-5")]))
    r.write("docs/roadmap/INDEX.md", ROADMAP_FINAL)
    r.write("docs/specs/2026-09-01-read/requirements.md", "# Requirements\n\nStatus: In-progress\n")
    r.write("docs/specs/2026-09-01-read/tasks.md", "# Tasks\n\n### Task 1: a\n\n### Task 2: b\n\n### Task 3: c\n")
    r.write("docs/specs/2026-09-01-read/design.md", "# Design\n\nRespects: ARCH-1, ARCH-2\n")
    r.write("docs/decisions/0002-second.md", "# ADR-0002: Second decision\n\n**Status:** Accepted\n**Date:** 2026-10-12\n")
    r.commit("feat(read): state", "2026-10-12")
    r.write(".skills/READ/progress.md", "# READ\n\n- Task 1: complete (commits a..b, review clean)\n- Task 2: complete (commits b..c, review clean)\n")
    r.write(".skills/_pending-road7/close.md", "framing\n")


class TestExtract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.root = Path(cls.tmp.name) / "demo"
        cls.root.mkdir()
        build(cls.root)
        cls.snap = extract(cls.root, today="2026-10-14")
        cls.items = {i["id"]: i for i in cls.snap["items"]}

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_after_field_is_read_and_legacy_items_fall_back_to_list_order(self):
        self.assertEqual(self.items["ROAD-7"]["after"], ["ROAD-6"])
        self.assertEqual(self.items["ROAD-7"]["after_source"], "field")
        self.assertEqual(self.items["ROAD-6"]["after"], ["MILE-2"])
        # ROAD-5 has no After: — waits on the live member above it (ROAD-4 is struck)
        self.assertEqual(self.items["ROAD-5"]["after"], ["ROAD-3"])
        self.assertEqual(self.items["ROAD-5"]["after_source"], "implicit")
        # first member waits on its milestone's Depends-on
        self.assertEqual(self.items["ROAD-2"]["after"], ["MILE-1"])
        # ROAD-9 sits between ROAD-8 and ROAD-10 without After:
        self.assertEqual(self.items["ROAD-9"]["after"], ["ROAD-8"])

    def test_a_struck_item_keeps_the_slug_it_had_before_it_was_struck(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t) / "demo"
            root.mkdir()
            r = Repo(root)
            r.write("docs/specs/INDEX.md", INDEX)
            r.write("docs/specs/catalog/core.md", catalog([]))
            r.write("docs/roadmap/INDEX.md", ROADMAP)
            r.commit("seed", "2026-09-01")
            r.write("docs/roadmap/INDEX.md", ROADMAP.replace("- **ROAD-7** public-view — After: ROAD-6 — Surfaces: `web/public/`",
                                                             "- ~~**ROAD-7**~~ delivered 2026-10-10 inside ROAD-6"))
            r.commit("strike", "2026-10-10")
            snap = extract(root, today="2026-10-14")
        week = snap["windows"]["week"]
        self.assertEqual(week["roadmap_dropped"], ["ROAD-7"])
        self.assertEqual(week["roadmap_slugs"]["ROAD-7"], "public-view")

    def test_struck_and_deferred_items_are_not_live(self):
        self.assertEqual(self.items["ROAD-4"]["state"], "retired")
        self.assertEqual(self.items["ROAD-11"]["state"], "deferred")

    def test_item_state_comes_from_the_bound_feature_status(self):
        self.assertEqual(self.items["ROAD-1"]["state"], "done")
        self.assertEqual(self.items["ROAD-3"]["state"], "done")
        self.assertEqual(self.items["ROAD-3"]["feature"], "POLL")
        self.assertEqual(self.items["ROAD-5"]["state"], "building")
        self.assertEqual(self.items["ROAD-7"]["state"], "framing")
        self.assertEqual(self.items["ROAD-8"]["state"], "unspecced")

    def test_ready_frontier_is_every_waiting_item_whose_predecessors_are_done(self):
        # ROAD-10 needs only ROAD-3 (done). ROAD-6 needs all of MILE-2, and ROAD-5 is still building.
        self.assertEqual(self.snap["graph"]["ready"], ["ROAD-10"])
        self.assertIn("ROAD-6", self.snap["graph"]["blocked"])
        self.assertEqual(self.snap["graph"]["blocked"]["ROAD-6"], ["ROAD-5"])

    def test_critical_path_is_the_longest_chain_of_unfinished_items(self):
        self.assertEqual(self.snap["graph"]["critical_path"], ["ROAD-5", "ROAD-6", "ROAD-8", "ROAD-9"])

    def test_surface_overlap_is_reported_for_items_that_could_run_together(self):
        pairs = {tuple(c["items"]) for c in self.snap["graph"]["conflicts"]}
        self.assertIn(("ROAD-5", "ROAD-10"), pairs)

    def test_a_shared_top_level_directory_alone_is_not_a_conflict(self):
        from extract import overlap
        self.assertEqual(overlap(["frontend/"], ["frontend/src/apps/finder/"]), [])
        self.assertEqual(overlap(["backend/crates/a/"], ["backend/crates/b/"]), [])
        self.assertEqual(overlap(["frontend/src/apps/"], ["frontend/src/apps/finder/"]), [])
        self.assertEqual(overlap([".skills/_pending-road1/close.md"], [".skills/_pending-road1/close.md"]), [])
        self.assertEqual(overlap(["api/migrations/"], ["api/migrations/0042.sql"]), ["api/migrations/"])

    def test_status_transitions_come_from_git_history_within_each_window(self):
        week = self.snap["windows"]["week"]
        month = self.snap["windows"]["month"]
        self.assertEqual(week["finished"], ["POLL"])
        self.assertEqual(week["started"], ["READ"])
        self.assertEqual(sorted(month["finished"]), ["POLL", "SUBS"])
        self.assertEqual(week["adrs"], ["ADR-0002"])
        self.assertEqual(week["roadmap_new"], ["ROAD-9"])
        self.assertEqual(self.snap["windows"]["month"]["roadmap_slugs"].get("ROAD-4"), None)
        self.assertEqual(week["roadmap_revived"], [])

    def test_a_feature_carries_its_catalog_name(self):
        f = {x["code"]: x for x in self.snap["features"]}
        self.assertEqual(f["POLL"]["name"], "Poll feature")

    def test_in_progress_features_carry_ledger_progress(self):
        f = {x["code"]: x for x in self.snap["features"]}
        self.assertEqual(f["READ"]["tasks_total"], 3)
        self.assertEqual(f["READ"]["tasks_done"], 2)

    def test_architecture_invariants_count_design_citations(self):
        arch = {a["id"]: a for a in self.snap["architecture"]}
        self.assertEqual(arch["ARCH-1"]["title"], "Dependencies point inward.")
        self.assertEqual(arch["ARCH-1"]["respected_by"], ["READ"])
        self.assertEqual(arch["ARCH-2"]["title"], "Tenant scope is checked in server code, always.")

    def test_s8_flags_dangling_targets_and_cycles(self):
        broken = ROADMAP.replace("After: ROAD-6 — Surfaces: `web/public/`", "After: ROAD-99 — Surfaces: `web/public/`")
        broken = broken.replace("- **ROAD-6** share-links — After: MILE-2", "- **ROAD-6** share-links — After: ROAD-8")
        with tempfile.TemporaryDirectory() as t:
            root = Path(t) / "demo"
            root.mkdir()
            r = Repo(root)
            r.write("docs/roadmap/INDEX.md", broken)
            r.write("docs/specs/INDEX.md", INDEX)
            r.write("docs/specs/catalog/core.md", catalog([]))
            r.commit("seed", "2026-10-01")
            snap = extract(root, today="2026-10-14")
        codes = {(f["rule"], f["item"]) for f in snap["findings"]}
        self.assertIn(("S8", "ROAD-7"), codes)  # dangling ROAD-99
        self.assertTrue(any(rule == "S8" and "cycle" in f["detail"] for f in snap["findings"] for rule in [f["rule"]]))

    def test_week_is_seven_calendar_days_including_today(self):
        self.assertEqual(self.snap["windows"]["week"]["since"], "2026-10-08")
        self.assertEqual(self.snap["windows"]["month"]["since"], "2026-09-15")

    def test_a_status_change_counts_when_it_lands_on_the_branch_not_when_it_was_authored(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t) / "demo"
            root.mkdir()
            r = Repo(root)
            r.write("docs/specs/INDEX.md", INDEX)
            r.write("docs/specs/catalog/core.md", catalog([("SUBS", "In-progress", "—")]))
            r.commit("seed", "2026-09-01")
            r._git("checkout", "-q", "-b", "feat")
            r.write("docs/specs/catalog/core.md", catalog([("SUBS", "Implemented", "—")]))
            r.commit("done on branch", "2026-10-01")
            r._git("checkout", "-q", "dev")
            r._git("merge", "-q", "--no-ff", "-m", "merge feat", "feat", date="2026-10-12")
            snap = extract(root, today="2026-10-14")
        self.assertEqual(snap["windows"]["week"]["finished"], ["SUBS"])

    def test_one_commit_moving_many_features_to_done_is_flagged_as_a_batch(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t) / "demo"
            root.mkdir()
            r = Repo(root)
            r.write("docs/specs/INDEX.md", INDEX)
            r.write("docs/specs/catalog/core.md", catalog([(c, "In-progress", "—") for c in ("AAA", "BBB", "CCC", "DDD")]))
            r.commit("seed", "2026-09-01")
            r.write("docs/specs/catalog/core.md", catalog([(c, "Implemented", "—") for c in ("AAA", "BBB", "CCC")] + [("DDD", "Implemented", "—")]))
            r.commit("catch up statuses", "2026-10-10")
            snap = extract(root, today="2026-10-14")
        week = snap["windows"]["week"]
        self.assertEqual(week["finished"], ["AAA", "BBB", "CCC", "DDD"])
        self.assertEqual(week["batches"], [{"sha": week["events"][0]["sha"], "date": "2026-10-10", "codes": ["AAA", "BBB", "CCC", "DDD"]}])

    def test_milestones_whose_live_members_are_all_done_but_not_closed_are_listed(self):
        r = ROADMAP.replace("| MILE-1 | Accounts | A person signs in. | none | Closed |", "| MILE-1 | Accounts | A person signs in. | none | Committed |")
        r = r.replace("**Commitment:** Closed", "**Commitment:** Committed 2026-08-01")
        with tempfile.TemporaryDirectory() as t:
            root = Path(t) / "demo"
            root.mkdir()
            rp = Repo(root)
            rp.write("docs/roadmap/INDEX.md", r)
            rp.write("docs/specs/INDEX.md", INDEX)
            rp.write("docs/specs/catalog/core.md", catalog([("ACCT", "Implemented", "ROAD-1")]))
            rp.commit("seed", "2026-10-01")
            snap = extract(root, today="2026-10-14")
        self.assertEqual(snap["graph"]["closable"], ["MILE-1"])

    def test_table_and_block_commitment_disagreeing_is_a_finding(self):
        r = ROADMAP.replace("| MILE-3 | Sharing | A person shares a post. | MILE-2 | Planned |", "| MILE-3 | Sharing | A person shares a post. | MILE-2 | Committed |")
        with tempfile.TemporaryDirectory() as t:
            root = Path(t) / "demo"
            root.mkdir()
            rp = Repo(root)
            rp.write("docs/roadmap/INDEX.md", r)
            rp.write("docs/specs/INDEX.md", INDEX)
            rp.write("docs/specs/catalog/core.md", catalog([]))
            rp.write("docs/decisions/0003-a.md", "# ADR-0003: A\n")
            rp.write("docs/decisions/0003-b.md", "# 0003 — B\n")
            rp.commit("seed", "2026-10-01")
            snap = extract(root, today="2026-10-14")
        details = [(f["rule"], f["item"]) for f in snap["findings"]]
        self.assertIn(("S7", "MILE-3"), details)
        self.assertIn(("ADR", "ADR-0003"), details)

    def test_adr_number_comes_from_the_filename_and_title_from_either_heading_style(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t) / "demo"
            (root / "docs/decisions").mkdir(parents=True)
            (root / "docs/decisions/0007-x.md").write_text("# 0007 — Serve the API same-origin\n\n**Date:** 2026-10-13\n")
            from extract import parse_adrs
            adrs = parse_adrs(root)
        self.assertEqual([(a["id"], a["title"]) for a in adrs], [("ADR-0007", "Serve the API same-origin")])

    def test_same_repo_gives_the_same_bytes_in_separate_processes(self):
        import sys
        outs = []
        for n in range(3):
            out = Path(self.tmp.name) / f"snap{n}.json"
            subprocess.run([sys.executable, str(Path(__file__).with_name("extract.py")), str(self.root),
                            "--today", "2026-10-14", "--out", str(out)],
                           check=True, env=dict(os.environ, PYTHONHASHSEED=str(n + 1)))
            outs.append(out.read_bytes())
        self.assertEqual(outs[0], outs[1])
        self.assertEqual(outs[1], outs[2])

    def test_weekly_finished_counts_cover_the_last_eight_weeks(self):
        weekly = self.snap["weekly"]
        self.assertEqual(len(weekly), 8)
        self.assertEqual(weekly[-1], {"start": "2026-10-08", "end": "2026-10-14", "finished": 1})
        self.assertEqual(weekly[-3], {"start": "2026-09-24", "end": "2026-09-30", "finished": 1})

    def test_a_feature_in_build_carries_the_day_it_started(self):
        f = {x["code"]: x for x in self.snap["features"]}
        self.assertEqual(f["READ"]["started"], "2026-10-12")

    def test_after_coverage_is_reported(self):
        cov = self.snap["coverage"]
        self.assertEqual(cov["live_items"], 9)
        self.assertEqual(cov["with_after"], 4)


if __name__ == "__main__":
    unittest.main()
