"""RED→GREEN owns extraction tests (unittest)."""

from __future__ import annotations

import unittest
from pathlib import Path

from owns import extract_files_paths, load_owns, owners_for_path, parse_index_registry

HERE = Path(__file__).resolve().parent
FIXTURE = HERE / "testdata"


class TestOwns(unittest.TestCase):
    def test_index_does_not_require_feature_code_line(self):
        owns, cov = load_owns(FIXTURE, specs_dir="specs")
        self.assertIn("DEMO", owns)
        self.assertIn("OTHR", owns)
        self.assertEqual(cov["registered"], 3)
        # DEMO has Files + File Structure paths
        self.assertIn("crates/demo/src/lib.rs", owns["DEMO"])
        self.assertIn("crates/demo/src/agent_access/mod.rs", owns["DEMO"])
        self.assertIn("crates/config/src/mail/mod.rs", owns["DEMO"])
        self.assertGreaterEqual(cov["with_owns"], 2)

    def test_sharded_index_loads_feature_cards(self):
        owns, cov = load_owns(FIXTURE, specs_dir="specs-sharded")
        self.assertIn("SHRD", owns)
        self.assertEqual(cov["registered"], 1)
        self.assertIn("crates/mail/src/labels.rs", owns["SHRD"])
        self.assertEqual(cov["with_owns"], 1)

    def test_flat_index_rejected(self):
        """Flat Code|… tables on INDEX are not a shared catalog — empty registry."""
        from owns import is_shared_catalog, parse_index_registry

        text = """# Feature specs index

| Code | Name | Status | Roadmap item | Path |
| ---- | ---- | ------ | ------------ | ---- |
| SEAL | Seal the webview | Implemented | ROAD-3 | `docs/specs/2026-08-20-seal-the-webview/` |
| OFR | Offering kinds (course and bootcamp) | Implemented | ROAD-7 | `docs/specs/2026-08-07-offering-kinds-course-and-bootcamp/` |
"""
        self.assertFalse(is_shared_catalog(text))
        self.assertEqual(parse_index_registry(text), {})

    def test_shard_accepts_backtick_path_column(self):
        """Feature cards in a shard still accept klynt-style Path cells."""
        from owns import _parse_feature_table

        text = """| Code | Name | Status | Roadmap item | Path |
| ---- | ---- | ------ | ------------ | ---- |
| SEAL | Seal the webview | Implemented | ROAD-3 | `docs/specs/2026-08-20-seal-the-webview/` |
| OFR | Offering kinds (course and bootcamp) | Implemented | ROAD-7 | `docs/specs/2026-08-07-offering-kinds-course-and-bootcamp/` |
| SKIP | Spoken only | — | — | — |
"""
        reg = _parse_feature_table(text)
        self.assertEqual(reg.get("SEAL"), "2026-08-20-seal-the-webview")
        self.assertEqual(
            reg.get("OFR"), "2026-08-07-offering-kinds-course-and-bootcamp"
        )
        self.assertNotEqual(reg.get("OFR"), "course and bootcamp")
        self.assertNotIn("SKIP", reg)

    def test_shard_accepts_bare_docs_specs_path_cell(self):
        from owns import _parse_feature_table

        text = """| Code | Name | Status | Roadmap item | Path |
| PTEN | Unique username | Implemented | ROAD-1 | docs/specs/2026-08-06-unique-username-and-personal-tenant-on-signup/ |
"""
        reg = _parse_feature_table(text)
        self.assertEqual(
            reg.get("PTEN"),
            "2026-08-06-unique-username-and-personal-tenant-on-signup",
        )

    def test_shard_accepts_bare_parent_relative_spec_cell(self):
        """Shard Spec cells often use ../YYYY-…/ without a markdown link."""
        from owns import _parse_feature_table

        text = """| Code | Feature | Spec | Status | Roadmap item |
| AUTHZ | Scoped authorization | ../2026-08-25-scoped-authorization-foundation/ | Implemented | ROAD-61 |
"""
        reg = _parse_feature_table(text)
        self.assertEqual(
            reg.get("AUTHZ"),
            "../2026-08-25-scoped-authorization-foundation",
        )

    def test_missing_spec_dir_recorded(self):
        _, cov = load_owns(FIXTURE, specs_dir="specs")
        self.assertIn("2026-01-99-missing", cov["missing_dirs"])

    def test_fence_skips_ignored_path(self):
        text = (FIXTURE / "specs/2026-01-01-demo/tasks.md").read_text()
        paths = extract_files_paths(text)
        self.assertNotIn("crates/ignore/me.rs", paths)

    def test_spoken_section_not_registered(self):
        idx = (FIXTURE / "specs/INDEX.md").read_text()
        reg = parse_index_registry(idx, specs_dir=FIXTURE / "specs")
        self.assertNotIn("SEND", reg)
        self.assertIn("DEMO", reg)

    def test_shared_fixture_catalog_shape(self):
        _, cov = load_owns(FIXTURE, specs_dir="specs")
        self.assertEqual(cov["catalog_shape"], "shared")

    def test_owners_for_path_ancestor(self):
        owns, _ = load_owns(FIXTURE, specs_dir="specs")
        self.assertEqual(
            owners_for_path("crates/demo/src/routes.rs", owns),
            ["DEMO"],
        )
        self.assertEqual(
            owners_for_path("crates/other/src/service.rs", owns),
            ["OTHR"],
        )
        self.assertEqual(owners_for_path("crates/unknown/x.rs", owns), [])

    def test_broad_two_segment_token_does_not_own_deep_children(self):
        """crates/enclave without trailing slash must not swallow the tree."""
        owns = {"ATCH": {"crates/enclave"}, "AGNT": {"crates/enclave/src/agent_access"}}
        self.assertEqual(
            owners_for_path("crates/enclave/src/bootstrap/init.rs", owns),
            [],
        )
        self.assertEqual(
            owners_for_path("crates/enclave/src/agent_access/mod.rs", owns),
            ["AGNT"],
        )
        # Explicit directory marker still owns children
        owns2 = {"ATCH": {"crates/enclave/"}}
        self.assertEqual(
            owners_for_path("crates/enclave/src/bootstrap/init.rs", owns2),
            ["ATCH"],
        )


class TestCluster(unittest.TestCase):
    def test_domain_from_lcp_not_substring_hijack(self):
        from cluster import domain_slug

        paths = [
            "crates/enclave/src/agent_access/mod.rs",
            "crates/enclave/src/agent_access/context.rs",
            "crates/enclave/src/bootstrap/mail_stack.rs",
        ]
        # Must not become "labels" merely because a path contains the letters
        self.assertEqual(domain_slug(paths), "enclave")

    def test_domain_slug_ignores_filename(self):
        from cluster import domain_slug, surface_roots

        self.assertEqual(
            domain_slug(["crates/mail_labels_service/src/service.rs"]),
            "mail-labels-service",
        )
        roots = surface_roots(["crates/mail_labels_service/src/service.rs"])
        self.assertTrue(roots)
        self.assertTrue(roots[0].endswith("/"))
        self.assertNotIn("service.rs", roots[0])

    def test_cluster_groups_by_two_meaningful_segments(self):
        from cluster import cluster_key, cluster_unowned_paths

        paths = [
            "crates/enclave/src/a.rs",
            "crates/enclave/src/b.rs",
            "apps/web/src/features/labels/x.ts",
            "apps/web/src/features/labels/y.ts",
        ]
        groups = cluster_unowned_paths(paths)
        self.assertIn("enclave/src", groups)
        # apps/src/features stopwords → meaningful web + labels
        self.assertIn("web/labels", groups)
        # filenames must never become cluster segments
        self.assertEqual(cluster_key("crates/enclave/src/a.rs"), "enclave/src")
        self.assertEqual(cluster_key("apps/web/src/features/labels/x.ts"), "web/labels")
        self.assertNotIn("a.rs", cluster_key("crates/enclave/src/a.rs"))


if __name__ == "__main__":
    unittest.main()
