import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderSvg } from "../../skills/visualize/assets/render-svg.mjs";

const fixture = () => JSON.parse(readFileSync(new URL("./fixtures/minimal.json", import.meta.url)));

test("renders an svg root", () => {
  const out = renderSvg(fixture());
  assert.match(out, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(out, /<\/svg>$/);
});

test("every node appears with its label", () => {
  const out = renderSvg(fixture());
  assert.ok(out.includes("app/"));
  assert.ok(out.includes("lib/"));
});

test("every node carries its citation in a title element", () => {
  const out = renderSvg(fixture());
  assert.ok(out.includes("app/page.tsx:1"));
});

test("output is deterministic", () => {
  assert.equal(renderSvg(fixture()), renderSvg(fixture()));
});

test("an invalid document throws rather than rendering", () => {
  const bad = fixture();
  bad.nodes[0].citations = [];
  assert.throws(() => renderSvg(bad), /uncited node/);
});

test("labels are escaped", () => {
  const doc = fixture();
  doc.nodes[0].label = "a<b>&c";
  const out = renderSvg(doc);
  assert.ok(out.includes("a&lt;b&gt;&amp;c"));
  assert.ok(!out.includes("a<b>&c"));
});
