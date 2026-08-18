import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateSceneGraph, SCENE_GRAPH_VERSION } from "../../skills/visualize/assets/validate.mjs";

const node = (id, over = {}) => ({
  id, label: id, kind: "module",
  citations: [{ file: `${id}/index.ts`, line: 1 }],
  ...over,
});

const graph = (over = {}) => ({
  version: SCENE_GRAPH_VERSION,
  repo: { name: "fixture", commit: "abc1234" },
  diagramType: "system-architecture",
  altitude: { mode: "budget", budget: 20, grouping: "directory" },
  nodes: [node("app"), node("lib")],
  edges: [{
    id: "app->lib", source: "app", target: "lib", path: "data",
    citations: [{ file: "app/page.tsx", line: 3 }],
    samples: [{ text: "getSkills()", citation: { file: "app/page.tsx", line: 3 } }],
  }],
  folded: [], gaps: [],
  ...over,
});

test("a fully cited graph is valid", () => {
  assert.deepEqual(validateSceneGraph(graph()), { valid: true, errors: [] });
});

test("an uncited node is rejected", () => {
  const r = validateSceneGraph(graph({ nodes: [node("app", { citations: [] }), node("lib")] }));
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes("nodes[0]") && e.includes("uncited")));
});

test("an uncited edge is rejected", () => {
  const g = graph();
  g.edges[0].citations = [];
  const r = validateSceneGraph(g);
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes("edges[0]") && e.includes("uncited")));
});

test("an edge pointing at a missing node is rejected", () => {
  const g = graph();
  g.edges[0].target = "nope";
  const r = validateSceneGraph(g);
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes('unknown node "nope"')));
});

test("duplicate node ids are rejected", () => {
  const r = validateSceneGraph(graph({ nodes: [node("app"), node("app")] }));
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes("duplicate id")));
});

test("an unknown path kind is rejected", () => {
  const g = graph();
  g.edges[0].path = "vibes";
  assert.equal(validateSceneGraph(g).valid, false);
});

test("nesting deeper than the depth cap is rejected", () => {
  let deepest = graph({ nodes: [node("leaf")], edges: [] });
  for (let i = 0; i < 4; i += 1) {
    deepest = graph({ nodes: [node(`n${i}`, { children: deepest })], edges: [] });
  }
  const r = validateSceneGraph(deepest);
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => e.includes("depth cap")));
});

test("errors accumulate rather than stopping at the first", () => {
  const r = validateSceneGraph(graph({ nodes: [node("a", { citations: [] }), node("a")] }));
  assert.ok(r.errors.length >= 2);
});

test("the schema's required fields match what the validator enforces", () => {
  const schema = JSON.parse(
    readFileSync(new URL("../../skills/visualize/assets/scene-graph.schema.json", import.meta.url)),
  );
  assert.deepEqual(
    [...schema.required].sort(),
    ["altitude", "diagramType", "edges", "folded", "gaps", "nodes", "repo", "version"],
  );
  assert.deepEqual([...schema.properties.nodes.items.required].sort(), ["citations", "id", "kind", "label"]);
  assert.deepEqual([...schema.properties.edges.items.required].sort(), ["citations", "path", "source", "target"]);

  for (const field of schema.required) {
    const g = graph();
    delete g[field];
    const r = validateSceneGraph(g);
    assert.equal(r.valid, false, `expected validateSceneGraph to reject a document missing "${field}"`);
  }
});

test("the committed fixture validates", () => {
  const fixture = JSON.parse(readFileSync(new URL("./fixtures/minimal.json", import.meta.url)));
  assert.deepEqual(validateSceneGraph(fixture), { valid: true, errors: [] });
});
