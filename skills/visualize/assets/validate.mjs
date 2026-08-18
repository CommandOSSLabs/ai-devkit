export const SCENE_GRAPH_VERSION = 1;
export const MAX_DEPTH = 3;

const PATH_KINDS = new Set(["control", "data"]);

function isCitation(c) {
  return Boolean(c) && typeof c.file === "string" && c.file.length > 0
    && Number.isInteger(c.line) && c.line > 0;
}

function checkCitations(list, where, errors, subject) {
  if (!Array.isArray(list) || list.length === 0) {
    errors.push(`${where}: uncited ${subject}, citations must be a non-empty array`);
    return;
  }
  list.forEach((c, i) => {
    if (!isCitation(c)) {
      errors.push(`${where}.citations[${i}]: must be { file: string, line: positive integer }`);
    }
  });
}

export function validateSceneGraph(doc, options = {}) {
  const depth = options.depth ?? 0;
  const prefix = options.prefix ?? "";
  const errors = [];

  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    return { valid: false, errors: [`${prefix}document must be an object`] };
  }
  if (doc.version !== SCENE_GRAPH_VERSION) {
    errors.push(`${prefix}version must be ${SCENE_GRAPH_VERSION}`);
  }
  if (depth > MAX_DEPTH) {
    errors.push(`${prefix}nesting exceeds depth cap ${MAX_DEPTH}`);
    return { valid: false, errors };
  }

  const ids = new Set();
  if (!Array.isArray(doc.nodes) || doc.nodes.length === 0) {
    errors.push(`${prefix}nodes must be a non-empty array`);
  } else {
    doc.nodes.forEach((n, i) => {
      const where = `${prefix}nodes[${i}]`;
      if (!n || typeof n !== "object") {
        errors.push(`${where}: must be an object`);
        return;
      }
      if (typeof n.id !== "string" || n.id.length === 0) {
        errors.push(`${where}: id must be a non-empty string`);
      } else if (ids.has(n.id)) {
        errors.push(`${where}: duplicate id "${n.id}"`);
      } else {
        ids.add(n.id);
      }
      if (typeof n.label !== "string" || n.label.length === 0) {
        errors.push(`${where}: label must be a non-empty string`);
      }
      if (typeof n.kind !== "string" || n.kind.length === 0) {
        errors.push(`${where}: kind must be a non-empty string`);
      }
      checkCitations(n.citations, where, errors, "node");
      if (n.children !== undefined && n.children !== null) {
        const nested = validateSceneGraph(n.children, {
          depth: depth + 1,
          prefix: `${where}.children.`,
        });
        errors.push(...nested.errors);
      }
    });
  }

  if (!Array.isArray(doc.edges)) {
    errors.push(`${prefix}edges must be an array`);
  } else {
    doc.edges.forEach((e, i) => {
      const where = `${prefix}edges[${i}]`;
      if (!e || typeof e !== "object") {
        errors.push(`${where}: must be an object`);
        return;
      }
      for (const end of ["source", "target"]) {
        if (typeof e[end] !== "string") {
          errors.push(`${where}: ${end} must be a string`);
        } else if (!ids.has(e[end])) {
          errors.push(`${where}: ${end} references unknown node "${e[end]}"`);
        }
      }
      if (!PATH_KINDS.has(e.path)) {
        errors.push(`${where}: path must be one of control, data`);
      }
      checkCitations(e.citations, where, errors, "edge");
      if (e.samples !== undefined) {
        if (!Array.isArray(e.samples)) {
          errors.push(`${where}: samples must be an array`);
        } else {
          e.samples.forEach((s, j) => {
            if (typeof s?.text !== "string") {
              errors.push(`${where}.samples[${j}]: text must be a string`);
            }
            if (!isCitation(s?.citation)) {
              errors.push(`${where}.samples[${j}]: citation must be { file, line }`);
            }
          });
        }
      }
    });
  }

  for (const field of ["folded", "gaps"]) {
    if (!Array.isArray(doc[field])) {
      errors.push(`${prefix}${field} must be an array (use [] when empty)`);
    }
  }

  return { valid: errors.length === 0, errors };
}
