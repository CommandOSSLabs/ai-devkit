# Feature Specifications

This directory contains one folder per feature specification.

## Canonical Placement

- Reusable Feature Spec template: `docs/templates/feature-spec.md`
- Feature spec entry: `docs/specs/{NNNN}-{feature-name}/spec.md`
- Example: `docs/specs/0001-user-authentication/spec.md`

## Folder Convention

- Use one folder per feature inside `docs/specs/`
- Example feature: `0001-user-authentication/`
- `spec.md` is required as the entry point in each feature folder
- Additional docs are optional (for example: `backend-design.md`, `api-reference.md`, `migration-plan.md`) and can be freely added by the team when needed

## How to Use

1. Copy [`docs/templates/feature-spec.md`](../templates/feature-spec.md) into a new feature folder under `docs/specs/{NNNN}-{feature-name}/`.
2. Rename and fill it as `spec.md`.
3. Keep `spec.md` updated as the latest source of truth.
