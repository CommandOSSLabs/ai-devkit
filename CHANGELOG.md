# Changelog

## 2.0.0 — unreleased

The kit takes the Engineer Pack's behavior in this kit's shape ([ADR 0001](docs/decisions/0001-jdk-engine-cmk-shape.md)). Upgrade notes: [MIGRATIONS.md](MIGRATIONS.md).

### Added

- The closed workflow: ten ticket states, three human gates, and five commands — `/cmk:idea`, `/cmk:shape`, `/cmk:go`, `/cmk:board`, `/cmk:release`.
- The feature spec triad under `docs/specs/` with stable requirement IDs, a feature catalog, and traceability checks.
- Its own build engine, `cmk:delivery-build` (continuous waves, story units, inline), with `cmk:tdd`, `cmk:debug` and `cmk:evidence`.
- 56 skills ported from the Engineer Pack; opt-in packs (roadmap, acceptance, ui, ops, quality, project, maintainers, extras) vendored by `cmk:agent-vendors` and synced by `cmk:sync`.
- RED/GREEN evidence (`TESTS.md`, `eval.json`) for every ported skill, including description routing measured against the Engineer Pack.
- Lint: a size ratchet, one-line descriptions, eval shape, hand-offs to user-invoked or uninstalled pack skills, bundled scripts, package-root contents.

### Changed

- `cmk:requirements`, `cmk:design`, `cmk:delivery-spec-plan`, `cmk:delivery-pipeline`, `cmk:delivery-review`, `cmk:delivery-simplify`, `cmk:delivery-ship` and `cmk:interpret` run the Engineer Pack's bodies; this kit's behaviors they lacked are kept where a run showed they were needed (see each skill's `TESTS.md`).
- `cmk:repo-setup` bootstraps greenfield repos to a proven-green baseline and runs `cmk:repo-config`.
- The explorer lists 91 skills in thirteen families; the skills grid no longer ships every skill's body.

### Removed

- The `superpowers` dependency.
