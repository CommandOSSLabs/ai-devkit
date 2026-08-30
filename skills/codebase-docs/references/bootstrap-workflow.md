# Bootstrap workflow

1. **Survey the repo.** Read the root `README.md`, any `CLAUDE.md` / `AGENTS.md`, the top-level directory layout, and whatever package/workspace manifest the stack uses (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `pom.xml`, `Gemfile`, etc.) for declared workspace members or sub-packages. Identify the 3–8 major areas — apps, services, packages, modules, significant subsystems. Note anything the existing README already explains well — don't duplicate it.

2. **Draft `docs/ai/README.md`.** One paragraph: what this repo is, what it does, who it's for. Then a link menu to the major areas, each a single sentence. Nothing else.

3. **For each area, decide branch vs. leaf.** If the area has ≥2 substantial sub-topics, make it a folder with its own `README.md`. If it's one coherent thing, make it a single `.md` at the parent level.

4. **Drill down recursively.** For each branch, identify its sub-topics by skimming the code (directory structure, module boundaries, key types/functions). Apply the split heuristic in `references/doc-shape.md`. Stop recursing when a sub-topic is either (a) obvious from its name + file path, or (b) small enough to fit as a bullet in its parent.

5. **Write leaf docs.** For each, read enough of the actual code to write a truthful what/why/where. Don't paraphrase from guesswork — open the file. Grab the real symbol names.

6. **Verify links.** All relative links resolve; all file paths exist; all symbol hints are real (grep for them). Broken references are worse than no reference.

7. **Sanity-check length.** Every doc under the length contracts in `references/doc-shape.md`. Any doc that runs long, either split or trim.
