import { validateSceneGraph } from "./validate.mjs";

const CELL = 180;
const BOX_W = 140;
const BOX_H = 56;
const PAD = 40;
const PER_ROW = 4;

export function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function layout(nodes) {
  return nodes.map((n, i) => ({
    node: n,
    x: PAD + (i % PER_ROW) * CELL,
    y: PAD + Math.floor(i / PER_ROW) * CELL,
  }));
}

export function renderSvg(doc) {
  const { valid, errors } = validateSceneGraph(doc);
  if (!valid) throw new Error(`invalid scene graph:\n${errors.join("\n")}`);

  const placed = layout(doc.nodes);
  const byId = new Map(placed.map((p) => [p.node.id, p]));
  const rows = Math.ceil(doc.nodes.length / PER_ROW);
  const width = PAD * 2 + Math.min(doc.nodes.length, PER_ROW) * CELL;
  const height = PAD * 2 + rows * CELL;

  const edges = doc.edges.map((e) => {
    const a = byId.get(e.source);
    const b = byId.get(e.target);
    const dash = e.path === "control" ? ' stroke-dasharray="6 4"' : "";
    const cite = `${e.citations[0].file}:${e.citations[0].line}`;
    return `<line x1="${a.x + BOX_W / 2}" y1="${a.y + BOX_H}" x2="${b.x + BOX_W / 2}" y2="${b.y}" stroke="currentColor" stroke-width="1.5"${dash}><title>${escapeXml(`${e.source} to ${e.target} at ${cite}`)}</title></line>`;
  });

  const boxes = placed.map(({ node, x, y }) => {
    const c = node.citations[0];
    const title = escapeXml(`${node.label} at ${c.file}:${c.line}`);
    return `<g><rect x="${x}" y="${y}" width="${BOX_W}" height="${BOX_H}" rx="6" fill="none" stroke="currentColor"/><text x="${x + 12}" y="${y + 34}" font-family="monospace" font-size="14" fill="currentColor">${escapeXml(node.label)}</text><title>${title}</title></g>`;
  });

  const notes = [];
  if (doc.folded.length > 0) notes.push(`folded: ${doc.folded.length}`);
  if (doc.gaps.length > 0) notes.push(`unresolved: ${doc.gaps.length}`);
  const legend = notes.length > 0
    ? `<text x="${PAD}" y="${height - 12}" font-family="monospace" font-size="12" fill="currentColor">${escapeXml(notes.join("  |  "))}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${edges.join("")}${boxes.join("")}${legend}</svg>`;
}
