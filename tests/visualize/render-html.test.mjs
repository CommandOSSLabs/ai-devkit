import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderHtml } from "../../skills/visualize/assets/render-html.mjs";

const fixture = () => JSON.parse(readFileSync(new URL("./fixtures/minimal.json", import.meta.url)));

test("returns a standalone html document", () => {
  const out = renderHtml(fixture());
  assert.match(out, /^<!doctype html>/i);
  assert.ok(out.includes("</html>"));
});

test("embeds the scene graph as inline json", () => {
  const out = renderHtml(fixture());
  assert.ok(out.includes('<script type="application/json" id="scene-graph">'));
  assert.ok(out.includes('"diagramType":"system-architecture"'));
});

test("makes no external requests", () => {
  const out = renderHtml(fixture());
  assert.ok(!/src="http/.test(out));
  assert.ok(!/href="http/.test(out));
});

test("renders an explainer panel naming unresolved relationships", () => {
  const doc = fixture();
  doc.gaps = [{ description: "dynamic import in engine.ts", reason: "dynamic-dispatch" }];
  assert.ok(renderHtml(doc).includes("dynamic import in engine.ts"));
});

test("output is deterministic", () => {
  assert.equal(renderHtml(fixture()), renderHtml(fixture()));
});

test("an invalid document throws rather than rendering", () => {
  const bad = fixture();
  bad.edges[0].citations = [];
  assert.throws(() => renderHtml(bad), /uncited edge/);
});

test("an unknown style is rejected", () => {
  assert.throws(() => renderHtml(fixture(), { style: "hologram" }), /unknown style/);
});
