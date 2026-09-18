import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderHtml, PROJECTIONS } from "../../skills/visualize/assets/render-html.mjs";

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

test("a node label containing </script> does not break out of the scene-graph payload", () => {
  const doc = fixture();
  const label = "weird </script><script>alert(1)</script> label";
  doc.nodes[0].label = label;
  const out = renderHtml(doc);

  const openTag = '<script type="application/json" id="scene-graph">';
  const start = out.indexOf(openTag) + openTag.length;
  const end = out.indexOf("</script>", start);
  const payload = out.slice(start, end);

  assert.ok(!payload.includes("</script>"));
  const parsed = JSON.parse(payload);
  assert.equal(parsed.nodes[0].label, label);
});

test("the chosen style is embedded in the scene graph the client reads", () => {
  for (const style of ["isometric", "flat", "three-d"]) {
    const out = renderHtml(fixture(), { style });
    const json = out.slice(out.indexOf('id="scene-graph"'), out.indexOf("</script>", out.indexOf('id="scene-graph"')));
    assert.ok(json.includes(`"style":"${style}"`), `${style} not embedded in the scene graph payload`);
  }
});

test("each style produces different output", () => {
  const d = fixture();
  const iso = renderHtml(d, { style: "isometric" });
  const flat = renderHtml(d, { style: "flat" });
  const td = renderHtml(d, { style: "three-d" });
  assert.notEqual(iso, flat);
  assert.notEqual(flat, td);
  assert.notEqual(iso, td);
});

test("each style is individually deterministic", () => {
  for (const style of ["isometric", "flat", "three-d"]) {
    assert.equal(renderHtml(fixture(), { style }), renderHtml(fixture(), { style }));
  }
});

test("every style still embeds the same repo identity", () => {
  const marker = '"repo":{"name":"fixture","commit":"abc1234"}';
  for (const style of ["isometric", "flat", "three-d"]) {
    assert.ok(renderHtml(fixture(), { style }).includes(marker));
  }
});

test("a node label containing </script> does not break out of the scene-graph payload at any style", () => {
  for (const style of ["isometric", "flat", "three-d"]) {
    const doc = fixture();
    const label = "weird </script><script>alert(1)</script> label";
    doc.nodes[0].label = label;
    const out = renderHtml(doc, { style });

    const openTag = '<script type="application/json" id="scene-graph">';
    const start = out.indexOf(openTag) + openTag.length;
    const end = out.indexOf("</script>", start);
    const payload = out.slice(start, end);

    assert.ok(!payload.includes("</script>"));
    const parsed = JSON.parse(payload);
    assert.equal(parsed.nodes[0].label, label);
  }
});

test("PROJECTIONS: all three styles place the same (col, row) differently in row 1", () => {
  const col = 1;
  const row = 1;
  const iso = PROJECTIONS.isometric(col, row);
  const flat = PROJECTIONS.flat(col, row);
  const td = PROJECTIONS["three-d"](col, row);
  assert.notDeepEqual(iso, flat);
  assert.notDeepEqual(flat, td);
  assert.notDeepEqual(iso, td);
});

test("PROJECTIONS: isometric shears, increasing row changes x for a fixed col", () => {
  const col = 2;
  const a = PROJECTIONS.isometric(col, 0);
  const b = PROJECTIONS.isometric(col, 1);
  assert.notEqual(a.x, b.x);
});

test("PROJECTIONS: flat does not shear, increasing row leaves x unchanged for a fixed col", () => {
  const col = 2;
  const a = PROJECTIONS.flat(col, 0);
  const b = PROJECTIONS.flat(col, 1);
  assert.equal(a.x, b.x);
});

test("PROJECTIONS: three-d compresses column spacing with depth", () => {
  const rowNear = PROJECTIONS["three-d"](0, 0);
  const rowNearNextCol = PROJECTIONS["three-d"](1, 0);
  const rowFar = PROJECTIONS["three-d"](0, 1);
  const rowFarNextCol = PROJECTIONS["three-d"](1, 1);
  const distNear = Math.abs(rowNearNextCol.x - rowNear.x);
  const distFar = Math.abs(rowFarNextCol.x - rowFar.x);
  assert.ok(distFar < distNear, `expected row-1 column spacing (${distFar}) to be smaller than row-0 spacing (${distNear})`);
});
