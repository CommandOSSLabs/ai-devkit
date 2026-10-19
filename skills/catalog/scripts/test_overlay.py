"""RED→GREEN overlay index-then-advance tests."""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path


def _repo_with_skills_ignored() -> tempfile.TemporaryDirectory:
    td = tempfile.TemporaryDirectory()
    root = Path(td.name)
    (root / ".gitignore").write_text(".skills/\n")
    (root / ".skills").mkdir()
    return td


class TestCanWriteOverlay(unittest.TestCase):
    def test_requires_gitignore_and_writable_skills(self):
        from overlay import can_write_overlay

        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            self.assertFalse(can_write_overlay(root))
            (root / ".gitignore").write_text("node_modules/\n")
            self.assertFalse(can_write_overlay(root))
            (root / ".gitignore").write_text(".skills/\n")
            self.assertTrue(can_write_overlay(root))

    def test_rejects_when_skills_not_ignored(self):
        from overlay import can_write_overlay

        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            (root / ".gitignore").write_text("dist/\n")
            (root / ".skills").mkdir()
            self.assertFalse(can_write_overlay(root))


class TestIndexOverlay(unittest.TestCase):
    def test_writes_state_active_and_obs_json(self):
        from overlay import index_overlay

        with _repo_with_skills_ignored() as td:
            root = Path(td)
            env = {
                "head": "abc123head",
                "base": "base000",
                "checkpoint": {"previous": None, "advanced_to": None},
                "findings": [
                    {
                        "change_class": "new-capability-candidate",
                        "confidence": "medium",
                        "codes": [],
                        "observation_id": "OBS-aabbcc",
                        "evidence": {
                            "items": [
                                {
                                    "kind": "path",
                                    "locator": "crates/mail_labels_service/src/service.rs",
                                    "status": "observed",
                                }
                            ],
                            "truncated": False,
                        },
                        "disposition": "pending",
                        "domain": "labels",
                        "surface_roots": ["crates/mail_labels_service/"],
                        "cluster_key": "mail_labels_service/src",
                    },
                    {
                        "change_class": "known-impact",
                        "confidence": "high",
                        "codes": ["AGNT"],
                        "observation_id": None,
                        "evidence": {"items": [], "truncated": False},
                        "disposition": "pending",
                    },
                ],
            }
            result = index_overlay(root, env)
            self.assertEqual(result["advanced_to"], "abc123head")
            self.assertEqual(result["written_obs"], ["OBS-aabbcc"])

            state = json.loads((root / ".skills/reverse-features/state.json").read_text())
            self.assertEqual(state["last_reconciled_sha"], "abc123head")
            self.assertEqual(state["recipe_id"], "rfeat-1.0")
            self.assertEqual(state["unresolved_finding_ids"], ["OBS-aabbcc"])

            active = root / ".skills/reverse-features/active/labels.md"
            self.assertTrue(active.is_file())
            body = active.read_text()
            self.assertIn("OBS-aabbcc", body)
            self.assertIn("pending", body)
            self.assertIn("crates/mail_labels_service/", body)

            detail = root / ".skills/reverse-features/observations/OBS-aabbcc.json"
            self.assertTrue(detail.is_file())
            data = json.loads(detail.read_text())
            self.assertEqual(data["observation_id"], "OBS-aabbcc")
            self.assertIn("crates/mail_labels_service/src/service.rs", json.dumps(data))

    def test_skips_tombstoned_obs(self):
        from overlay import index_overlay

        with _repo_with_skills_ignored() as td:
            root = Path(td)
            rf = root / ".skills/reverse-features"
            rf.mkdir(parents=True)
            (rf / "tombstones.jsonl").write_text(
                json.dumps({"observation_id": "OBS-dead01", "disposition": "dismissed"})
                + "\n"
            )
            env = {
                "head": "h1",
                "findings": [
                    {
                        "change_class": "new-capability-candidate",
                        "confidence": "medium",
                        "codes": [],
                        "observation_id": "OBS-dead01",
                        "evidence": {"items": [], "truncated": False},
                        "disposition": "pending",
                        "domain": "x",
                        "surface_roots": ["crates/x/"],
                    }
                ],
            }
            result = index_overlay(root, env)
            self.assertEqual(result["written_obs"], [])
            self.assertFalse((rf / "active/x.md").exists())
            self.assertEqual(result["advanced_to"], "h1")  # still advances

    def test_reconcile_repo_advances_when_overlay_enabled(self):
        from reconcile import reconcile_repo

        with _repo_with_skills_ignored() as td:
            root = Path(td)
            # minimal specs so owns loads empty cleanly
            specs = root / "docs" / "specs"
            specs.mkdir(parents=True)
            (specs / "INDEX.md").write_text("# empty\n")
            env = reconcile_repo(
                root,
                paths=["crates/orphan/src/lib.rs"],
                mode="full",
                base="0" * 40,
                head="1" * 40,
                write_overlay=True,
            )
            self.assertEqual(env["checkpoint"]["advanced_to"], "1" * 40)
            self.assertTrue((root / ".skills/reverse-features/state.json").is_file())
            active_files = list((root / ".skills/reverse-features/active").glob("*.md"))
            self.assertGreaterEqual(len(active_files), 1)


if __name__ == "__main__":
    unittest.main()
