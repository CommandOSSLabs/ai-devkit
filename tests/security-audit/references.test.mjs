import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Hunter and verifier prompts copy blocks out of these files verbatim, so a
// silent edit to one copy changes what an agent is told without any validator
// noticing. These checks pin the copies the skill promises are identical.

const ref = (name) =>
  readFileSync(new URL(`../../skills/security-audit/references/${name}`, import.meta.url), "utf8");

const COMPANIONS = [
  "memory-safety-and-binary.md",
  "ai-and-llm.md",
  "web-protocol-and-auth.md",
  "client-side.md",
  "supply-chain-and-release.md",
  "cloud-and-deployment.md",
  "protocols-rpc-and-messaging.md",
  "resource-exhaustion-and-availability.md",
  "data-isolation-and-lifecycle.md",
  "desktop-mobile-and-local-ipc.md",
];

const normalize = (text) => text.replace(/\s+/g, " ").trim();

function promotionBlock(markdown) {
  const match = markdown.match(/```text\n(Artifact promotion procedure[\s\S]*?)```/);
  assert.ok(match, "promotion procedure block not found");
  return match[1];
}

function numberedSteps(text) {
  const steps = text.split(/\n(?=\s*\d+\. )/).filter((chunk) => /^\s*\d+\. /.test(chunk));
  // A step ends at the first blank line, so prose after the list is not part of it.
  return steps.map((step) => normalize(step.split(/\n\s*\n/)[0]).replace(/^\d+\. /, ""));
}

test("hunter and verifier prompts carry byte-identical promotion blocks", () => {
  assert.equal(promotionBlock(ref("hunting.md")), promotionBlock(ref("validation-and-reporting.md")));
});

test("the prompt block states the write-isolation procedure in the same order", () => {
  const block = promotionBlock(ref("hunting.md"));
  const fullAudit = ref("full-audit.md");
  const section = fullAudit.slice(fullAudit.indexOf("### Write isolation"), fullAudit.indexOf("## Full audit planning"));

  const blockSteps = numberedSteps(block);
  const sectionSteps = numberedSteps(section.slice(section.indexOf("\n1. ")));
  assert.equal(blockSteps.length, 11);
  assert.deepEqual(blockSteps, sectionSteps.slice(0, blockSteps.length));

  const preamble = "Before execution, the parent opens and retains trusted, non-inheritable directory descriptors";
  assert.ok(normalize(block).includes(preamble));
  assert.ok(normalize(section).includes(preamble));
});

test("every domain companion carries the sections a hunter prompt copies", () => {
  for (const name of COMPANIONS) {
    const text = ref(name);
    for (const heading of ["When to use this file", "Core discipline", "Universal moves", "Validation rules"]) {
      assert.match(text, new RegExp(`^#+ ${heading}`, "m"), `${name} lacks "${heading}"`);
    }
  }
});

test("attack-class block references in the ledger example resolve to a real class", () => {
  const recon = ref("reconnaissance.md");
  const refs = [...recon.matchAll(/"([a-z-]+\.md)#([^"]+)"/g)];
  assert.ok(refs.length > 0);
  for (const [, file, block] of refs) {
    assert.ok(ref(file).includes(`**${block}**`), `${file}#${block} names no bold class`);
  }
});
