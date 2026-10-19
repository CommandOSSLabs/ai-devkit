"""Gold-label judgment corpus for reconcile-features."""

from __future__ import annotations

import json
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
CORPUS = HERE / "testdata" / "corpus"


def _load_case(name: str) -> tuple[dict, list[str], dict]:
    root = CORPUS / name
    owns_raw = json.loads((root / "owns.json").read_text())
    owns = {c: set(ps) for c, ps in owns_raw.items()}
    paths = [
        ln.strip()
        for ln in (root / "paths.txt").read_text().splitlines()
        if ln.strip()
    ]
    gold = json.loads((root / "gold.json").read_text())
    return owns, paths, gold


class TestMailgateLabelsCorpus(unittest.TestCase):
    def test_critical_miss_mail_labels_service_is_obs_not_feature(self):
        from corpus_eval import evaluate_gold

        owns, paths, gold = _load_case("mailgate-labels")
        report = evaluate_gold(owns, paths, gold)
        self.assertEqual(report["failures"], [], msg=report)

    def test_obs_id_stable_for_labels_path(self):
        from corpus_eval import evaluate_gold

        owns, paths, gold = _load_case("mailgate-labels")
        a = evaluate_gold(owns, paths, gold)
        b = evaluate_gold(owns, paths, gold)
        self.assertEqual(a["stability_obs_id"], b["stability_obs_id"])
        self.assertRegex(a["stability_obs_id"], r"^OBS-[0-9a-f]{6}$")


class TestKlyntAuthzCorpus(unittest.TestCase):
    def test_sparse_owns_emits_obs_without_proto_codes(self):
        from corpus_eval import evaluate_gold

        owns, paths, gold = _load_case("klynt-authz")
        report = evaluate_gold(owns, paths, gold)
        self.assertEqual(report["failures"], [], msg=report)
        self.assertGreaterEqual(report["new_capability_count"], 1)


if __name__ == "__main__":
    unittest.main()
