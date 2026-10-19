"""RED→GREEN reconcile script tests (unittest)."""

from __future__ import annotations

import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
FIXTURE = HERE / "testdata"


class TestObsId(unittest.TestCase):
    def test_obs_id_is_sha256_prefix_of_sorted_locators(self):
        from reconcile import obs_id

        a = obs_id(["b/path.rs", "a/path.rs"])
        b = obs_id(["a/path.rs", "b/path.rs", "a/path.rs"])
        self.assertEqual(a, b)
        self.assertRegex(a, r"^OBS-[0-9a-f]{6}$")
        self.assertNotIn("LABL", a)


class TestGeneratedFilter(unittest.TestCase):
    def test_drops_lockfiles_and_build_dirs(self):
        from reconcile import is_generated

        self.assertTrue(is_generated("pnpm-lock.yaml"))
        self.assertTrue(is_generated("crates/foo/target/debug/foo"))
        self.assertTrue(is_generated("apps/web/dist/index.js"))
        self.assertFalse(is_generated("crates/mail_labels_service/src/service.rs"))


class TestClassify(unittest.TestCase):
    def test_owned_path_is_known_impact(self):
        from reconcile import classify_paths

        owns = {"DEMO": {"crates/demo/src/lib.rs", "crates/demo/"}}
        rows = classify_paths(["crates/demo/src/routes.rs"], owns)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["change_class"], "known-impact")
        self.assertEqual(rows[0]["codes"], ["DEMO"])
        self.assertEqual(rows[0]["disposition"], "pending")

    def test_unowned_source_is_new_capability_with_obs(self):
        from reconcile import classify_paths

        owns = {"DEMO": {"crates/demo/"}}
        rows = classify_paths(
            [
                "crates/mail_labels_service/src/a.rs",
                "crates/mail_labels_service/src/b.rs",
            ],
            owns,
        )
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["change_class"], "new-capability-candidate")
        self.assertEqual(rows[0]["codes"], [])
        self.assertRegex(rows[0]["observation_id"], r"^OBS-[0-9a-f]{6}$")
        self.assertLessEqual(len(rows[0]["evidence"]["items"]), 8)

    def test_docs_only_is_no_spec_impact(self):
        from reconcile import classify_paths

        rows = classify_paths(["docs/guide/README.md"], {})
        self.assertEqual(rows[0]["change_class"], "no-spec-impact")

    def test_findings_capped_at_twelve(self):
        from reconcile import classify_paths, FINDINGS_MAX

        owns: dict[str, set[str]] = {}
        paths = [f"crates/svc{i}/src/lib.rs" for i in range(20)]
        rows = classify_paths(paths, owns)
        self.assertEqual(FINDINGS_MAX, 12)
        self.assertEqual(len(rows), 12)

    def test_new_capability_survives_cap_ahead_of_known_impact(self):
        from reconcile import classify_paths

        # Many owners → known-impact must not starve OBS; OBS must not erase known
        owns = {
            "A": {"crates/a/"},
            "B": {"crates/b/"},
            "C": {"crates/c/"},
            "D": {"crates/d/"},
            "E": {"crates/e/"},
            "F": {"crates/f/"},
        }
        paths = [
            "crates/a/src/x.rs",
            "crates/b/src/x.rs",
            "crates/c/src/x.rs",
            "crates/d/src/x.rs",
            "crates/e/src/x.rs",
            "crates/f/src/x.rs",
            "crates/mail_labels_service/src/service.rs",
            "crates/orphan1/src/a.rs",
            "crates/orphan2/src/a.rs",
            "crates/orphan3/src/a.rs",
            "crates/orphan4/src/a.rs",
            "crates/orphan5/src/a.rs",
            "crates/orphan6/src/a.rs",
            "crates/orphan7/src/a.rs",
            "crates/orphan8/src/a.rs",
            "crates/orphan9/src/a.rs",
            "crates/orphan10/src/a.rs",
        ]
        rows = classify_paths(paths, owns)
        self.assertLessEqual(len(rows), 12)
        classes = {r["change_class"] for r in rows}
        self.assertIn("new-capability-candidate", classes)
        self.assertIn("known-impact", classes)
        obs = [r for r in rows if r["change_class"] == "new-capability-candidate"]
        locs = [i["locator"] for r in obs for i in r["evidence"]["items"]]
        self.assertTrue(any("mail_labels_service" in loc for loc in locs))

    def test_novelty_boost_surfaces_singleton_new_crate(self):
        """Novel singleton crate beats larger unowned clusters under FINDINGS_MAX."""
        from reconcile import classify_paths, FINDINGS_MAX, KNOWN_IMPACT_SOFT_MIN

        owns = {"AGNT": {"crates/enclave/src/agent_access/mod.rs"}}
        # Enough large clusters to fill the entire new-capability budget by size alone
        paths: list[str] = []
        for i in range(20):
            for j in range(5):
                paths.append(f"crates/bulk{i}/src/f{j}.rs")
        paths.append("crates/mail_labels_service/src/service.rs")
        rows = classify_paths(paths, owns)
        new_budget = FINDINGS_MAX - 1 - min(1, KNOWN_IMPACT_SOFT_MIN)  # uncertain0 + known reserve
        # Without boost, 20 size-5 clusters would starve the singleton
        self.assertGreaterEqual(20, new_budget)
        locs = [
            i["locator"]
            for r in rows
            if r["change_class"] == "new-capability-candidate"
            for i in r["evidence"]["items"]
        ]
        self.assertTrue(
            any("mail_labels_service" in loc for loc in locs),
            msg=f"mail_labels missing from capped findings: {[r.get('cluster_key') for r in rows]}",
        )

    def test_novel_singleton_soft_max_limits_noise(self):
        from reconcile import classify_paths, NOVEL_SINGLETON_SOFT_MAX

        owns = {"AGNT": {"crates/enclave/src/agent_access/mod.rs"}}
        paths = [f"crates/solo{i}/src/lib.rs" for i in range(15)]
        # one larger unowned cluster should still appear
        paths += [f"crates/bulkpkg/src/f{j}.rs" for j in range(6)]
        rows = classify_paths(paths, owns)
        novel = [
            r
            for r in rows
            if r["change_class"] == "new-capability-candidate"
            and int(r.get("novelty_boost") or 0) == 1
        ]
        self.assertLessEqual(len(novel), NOVEL_SINGLETON_SOFT_MAX)
        keys = [r.get("cluster_key") for r in rows if r["change_class"] == "new-capability-candidate"]
        self.assertTrue(any(k and k.startswith("bulkpkg") for k in keys))


class TestSetupNotes(unittest.TestCase):
    def test_notes_when_skills_not_ignored_and_no_index(self):
        import tempfile
        from pathlib import Path

        from reconcile import setup_readiness_notes

        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            (root / ".gitignore").write_text("node_modules/\n")
            notes = setup_readiness_notes(root)
            kinds = {n["kind"] for n in notes}
            self.assertIn("skills_not_ignored", kinds)
            self.assertIn("specs_index_missing", kinds)
            self.assertTrue(any("configure-repo" in str(n.get("detail", "")).lower() for n in notes))

    def test_clean_when_ignored_and_index_present(self):
        import tempfile
        from pathlib import Path

        from reconcile import setup_readiness_notes

        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            (root / ".gitignore").write_text(".skills/\n")
            specs = root / "docs" / "specs"
            specs.mkdir(parents=True)
            (specs / "INDEX.md").write_text("# index\n")
            notes = setup_readiness_notes(root)
            self.assertEqual(notes, [])


class TestEnvelope(unittest.TestCase):
    def test_build_envelope_required_fields(self):
        from reconcile import build_envelope

        owns = {"DEMO": {"crates/demo/"}}
        cov = {"with_owns": 1, "registered": 1, "ratio": 1.0, "missing_dirs": []}
        env = build_envelope(
            mode="full",
            base="aaa",
            head="bbb",
            previous=None,
            advanced_to=None,
            owns=owns,
            owns_coverage=cov,
            paths=["crates/demo/src/lib.rs", "docs/x.md"],
        )
        self.assertTrue(env["advisory"])
        self.assertEqual(env["schema_version"], "1")
        self.assertEqual(env["recipe_id"], "rfeat-1.0")
        self.assertIn("findings", env)
        self.assertIn("findings_truncated", env)
        self.assertIn("owns_coverage", env)
        self.assertIn("checkpoint", env)
        self.assertEqual(env["checkpoint"]["advanced_to"], None)


class TestLoadFixture(unittest.TestCase):
    def test_reconcile_fixture_repo_reports_owns(self):
        from reconcile import reconcile_repo

        env = reconcile_repo(
            FIXTURE,
            specs_dir="specs",
            paths=[
                "crates/demo/src/lib.rs",
                "crates/unknown/src/x.rs",
            ],
            mode="full",
            base="0" * 40,
            head="1" * 40,
            write_overlay=False,
        )
        self.assertGreaterEqual(env["owns_coverage"]["with_owns"], 2)
        classes = {f["change_class"] for f in env["findings"]}
        self.assertIn("known-impact", classes)
        self.assertIn("new-capability-candidate", classes)


if __name__ == "__main__":
    unittest.main()
