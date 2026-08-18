import { validateSceneGraph } from "./validate.mjs";

const STYLES = new Set(["isometric", "flat", "three-d"]);

function escapeHtml(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function embedJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

const CLIENT = `
const doc = JSON.parse(document.getElementById("scene-graph").textContent);
const svg = document.getElementById("stage");
const panel = document.getElementById("inspector");
const projections = {
  isometric: (col, row) => ({ x: 320 + (col - row) * 110 * 0.866, y: 90 + (col + row) * 110 * 0.5 }),
  flat: (col, row) => ({ x: 110 + col * 150, y: 80 + row * 120 }),
  "three-d": (col, row) => {
    const d = 1 - row * 0.12;
    return { x: 320 + (col - 1.5) * 150 * d, y: 120 + row * 130 * d };
  },
};
const place = (i) => projections[doc.style](i % 4, Math.floor(i / 4));
const pos = new Map(doc.nodes.map((n, i) => [n.id, place(i)]));
const ns = "http://www.w3.org/2000/svg";
const el = (t, a) => { const e = document.createElementNS(ns, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
for (const e of doc.edges) {
  const a = pos.get(e.source), b = pos.get(e.target);
  const line = el("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "currentColor", "stroke-width": 1.2, opacity: 0.5 });
  if (e.path === "control") line.setAttribute("stroke-dasharray", "6 4");
  svg.appendChild(line);
  (e.samples || []).forEach((s, k) => {
    const dot = el("circle", { r: 5, fill: "currentColor", cursor: "pointer" });
    const anim = el("animateMotion", {
      dur: "3s", repeatCount: "indefinite", begin: (k * 0.6) + "s",
      path: "M" + a.x + " " + a.y + " L" + b.x + " " + b.y,
    });
    dot.appendChild(anim);
    dot.addEventListener("click", () => {
      panel.textContent = s.text + "\\n\\n" + s.citation.file + ":" + s.citation.line;
    });
    svg.appendChild(dot);
  });
}
for (const n of doc.nodes) {
  const p = pos.get(n.id);
  const g = el("g", { cursor: "pointer" });
  g.appendChild(el("rect", { x: p.x - 46, y: p.y - 26, width: 92, height: 52, rx: 4, fill: "none", stroke: "currentColor" }));
  const t = el("text", { x: p.x, y: p.y + 5, "text-anchor": "middle", "font-family": "monospace", "font-size": 12, fill: "currentColor" });
  t.textContent = n.label;
  g.appendChild(t);
  g.addEventListener("click", () => {
    panel.textContent = n.label + "\\n\\n" + n.citations.map((c) => c.file + ":" + c.line).join("\\n");
  });
  svg.appendChild(g);
}
`;

export function renderHtml(doc, options = {}) {
  const style = options.style ?? "isometric";
  if (!STYLES.has(style)) throw new Error(`unknown style "${style}"`);
  const { valid, errors } = validateSceneGraph(doc);
  if (!valid) throw new Error(`invalid scene graph:\n${errors.join("\n")}`);

  const folded = doc.folded
    .map((f) => `<li>${escapeHtml(f.nodeId ?? "group")}: ${escapeHtml(String((f.files ?? []).length))} files folded</li>`)
    .join("");
  const gaps = doc.gaps
    .map((g) => `<li>${escapeHtml(g.description)} <em>(${escapeHtml(g.reason)})</em></li>`)
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(doc.repo.name)} map</title>
<style>
body{margin:0;font-family:ui-monospace,monospace;background:#0b0d10;color:#d8dee9;display:grid;grid-template-columns:1fr 320px;min-height:100vh}
#stage{width:100%;height:100vh}
aside{border-left:1px solid #2a2f36;padding:16px;overflow:auto;font-size:12px;line-height:1.6}
h2{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#8b949e;margin:20px 0 8px}
pre{white-space:pre-wrap;word-break:break-word;background:#12161b;padding:10px;border-radius:4px}
ul{padding-left:16px;margin:0}
</style></head><body>
<svg id="stage" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg"></svg>
<aside>
<h2>${escapeHtml(doc.repo.name)} at ${escapeHtml(doc.repo.commit)}</h2>
<p>${escapeHtml(String(doc.nodes.length))} buildings, ${escapeHtml(String(doc.edges.length))} paths. Style: ${escapeHtml(style)}. Solid is data, dashed is control. Click a building or a moving dot.</p>
<h2>Inspector</h2><pre id="inspector">Click a dot to inspect a payload.</pre>
<h2>Folded</h2><ul>${folded || "<li>nothing folded</li>"}</ul>
<h2>Unresolved</h2><ul>${gaps || "<li>nothing unresolved</li>"}</ul>
</aside>
<script type="application/json" id="scene-graph">${embedJson({ ...doc, style })}</script>
<script>${CLIENT}</script>
</body></html>`;
}
