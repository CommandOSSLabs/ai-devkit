"""Behavior tests for render.py (unittest, stdlib only)."""

from __future__ import annotations

import re
import tempfile
import unittest
from pathlib import Path

from extract import extract
from render import render
from test_extract import build


def json_copy(o):
    import json
    return json.loads(json.dumps(o))


class TestRender(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        root = Path(cls.tmp.name) / "demo"
        root.mkdir()
        build(root)
        cls.snap = extract(root, today="2026-10-14")
        cls.notes = {
            "summary": "POLL landed; READ is two tasks from done.",
            "recommendations": ["Start ROAD-10 <now>", "Finish READ"],
        }
        cls.html = render(cls.snap, cls.notes)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def test_page_is_self_contained(self):
        self.assertNotRegex(self.html, r'(src|href)="https?://')
        self.assertNotIn("@import", self.html)
        self.assertNotIn("mermaid", self.html.lower())

    def test_every_view_has_its_section(self):
        for sid in ("plan", "happened", "roadmap", "catalog", "architecture", "health"):
            self.assertIn(f'id="{sid}"', self.html)

    def test_ready_frontier_and_critical_path_are_listed(self):
        plan = self.html.split('id="plan"', 1)[1].split("</section>", 1)[0]
        self.assertIn("ROAD-10", plan)
        self.assertIn("ROAD-5", plan)  # critical path head / conflict partner

    def test_week_and_month_show_finished_features(self):
        happened = self.html.split('id="happened"', 1)[1].split("</section>", 1)[0]
        self.assertIn("POLL", happened)
        self.assertIn("SUBS", happened)

    def test_batches_and_closable_milestones_are_shown(self):
        snap = json_copy(self.snap)
        snap["windows"]["week"]["batches"] = [{"sha": "b324ee232", "date": "2026-10-10", "codes": ["AAA", "BBB", "CCC"]}]
        snap["graph"]["closable"] = ["MILE-2"]
        page = render(snap, None)
        happened = page.split('id="happened"', 1)[1].split("</section>", 1)[0]
        self.assertIn("b324ee232", happened)
        plan = page.split('id="plan"', 1)[1].split("</section>", 1)[0]
        self.assertIn("MILE-2", plan)
        self.assertIn("/assess-milestone", plan)

    def test_a_feature_without_a_ledger_does_not_read_as_zero_done(self):
        from render import progress
        snap = {"features": [{"code": "AWID", "tasks_total": 31, "tasks_done": None}]}
        cell = progress(snap, "AWID")
        self.assertNotIn("0 of 31", cell)
        self.assertIn("31 tasks planned, none logged yet", cell)

    def visible(self, page: str) -> str:
        page = re.sub(r"<(style|script|title|desc)[^>]*>.*?</\1>", " ", page, flags=re.S)
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", page))

    def section(self, sid: str) -> str:
        return self.visible(self.html.split(f'id="{sid}"', 1)[1].split("</section>", 1)[0])

    def test_the_page_speaks_plain_words_not_internal_field_names(self):
        text = self.visible(self.html).lower()
        for word in ("unspecced", "specced", "closable", "critical path", "snapshot", "coverage", "slug", "ledger"):
            self.assertNotIn(word, text, word)

    def test_the_title_names_the_week(self):
        self.assertIn("Week of 8–14 Oct 2026", self.visible(self.html))

    def test_finished_work_is_listed_by_name_and_human_date(self):
        happened = self.section("happened")
        self.assertIn("Poll feature", happened)
        self.assertIn("Mon 12 Oct", happened)

    def test_items_to_start_read_as_names_under_their_milestone(self):
        plan = self.section("plan")
        self.assertIn("Analytics", plan)        # ROAD-10 slug "analytics"
        self.assertIn("Sharing", plan)          # its milestone's name
        self.assertIn("A person shares a post.", plan)  # the milestone's outcome

    def test_work_in_build_shows_progress_and_age_in_words(self):
        plan = self.section("plan")
        self.assertIn("Read feature", plan)
        self.assertIn("2 of 3 tasks done", plan)
        self.assertIn("started Mon 12 Oct", plan)

    def test_the_eight_week_trend_is_drawn(self):
        happened = self.section("happened")
        self.assertIn("Finished per week", happened)

    def test_finished_milestones_are_left_off_the_map(self):
        roadmap = self.html.split('id="roadmap"', 1)[1].split("</section>", 1)[0]
        overview = re.search(r"<svg.*?</svg>", roadmap, flags=re.S).group(0)
        self.assertNotIn("Accounts", overview)  # MILE-1 is Closed
        self.assertIn("1 finished milestone not shown", self.visible(roadmap))

    def test_overlaps_are_said_with_names(self):
        plan = self.section("plan")
        self.assertIn("Shares code with Read feature (in build) — migrations", plan)
        self.assertNotIn("api/migrations/", plan)  # the path lives in the tooltip, the area in the text

    def test_notes_are_escaped(self):
        self.assertIn("Start ROAD-10 &lt;now&gt;", self.html)
        self.assertNotIn("<now>", self.html)

    def test_graphs_are_inline_svg_with_accessible_names(self):
        svgs = re.findall(r"<svg[^>]*>(.*?)</svg>", self.html, flags=re.S)
        self.assertGreaterEqual(len(svgs), 2)  # milestone graph + at least one item graph
        for body in svgs:
            self.assertRegex(body, r"<title>[^<]+</title>")

    def test_both_themes_are_defined_at_token_level(self):
        self.assertIn("prefers-color-scheme: dark", self.html)
        self.assertIn(':root[data-theme="dark"]', self.html)

    def test_missing_after_coverage_is_called_out(self):
        health = self.html.split('id="health"', 1)[1].split("</section>", 1)[0]
        self.assertIn("4 of 9", health)

    def test_same_snapshot_renders_the_same_bytes_in_separate_processes(self):
        import json, subprocess, sys
        snap = Path(self.tmp.name) / "snap.json"
        snap.write_text(json.dumps(self.snap))
        outs = []
        for n in range(2):
            out = Path(self.tmp.name) / f"page{n}.html"
            subprocess.run([sys.executable, str(Path(__file__).with_name("render.py")), str(snap), "--out", str(out)],
                           check=True, env={"PYTHONHASHSEED": str(n + 1)})
            outs.append(out.read_bytes())
        self.assertEqual(outs[0], outs[1])

    def test_renders_without_notes_or_roadmap(self):
        snap = dict(self.snap, has_roadmap=False, milestones=[], items=[],
                    graph={"ready": [], "blocked": {}, "critical_path": [], "layer": {}, "unlocks": {}, "conflicts": [], "edges": []})
        html = render(snap, None)
        self.assertIn("No roadmap", html)


if __name__ == "__main__":
    unittest.main()
