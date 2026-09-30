import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync("index.html", "utf8");
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
assert.ok(script, "inline application script must exist");
assert.doesNotThrow(() => new Function(script), "application JavaScript must parse");

const requiredIds = [
  "health", "stageguide", "domain", "file", "text", "parse", "demo-source",
  "ecat", "elist", "rcat", "rlist", "completion", "export", "vfile", "inspect"
  , "momma", "momma-panel", "momma-progress", "momma-back", "momma-next"
  , "executive-title", "lens-tabs", "lens-panel"
];
for (const id of requiredIds) {
  assert.ok(html.includes(`id="${id}"`), `missing required element #${id}`);
}

assert.equal(
  (html.match(/class="step(?:\s|")/g) || []).length,
  6,
  "six workflow steps required"
);
assert.ok(script.includes('$$(".step").forEach'), "step controls must use the collection selector");
assert.ok(
  !/(^|[^$])\$\("\.step"\)\.forEach/.test(script),
  "single-element selector cannot drive step collections"
);
assert.ok(
  script.includes("$$('#rlist .actions button').forEach"),
  "review handlers must remain scoped to the review list"
);
assert.ok(
  !script.includes('$$(".actions button").forEach'),
  "review must not overwrite unrelated action buttons"
);
for (const category of ["entities", "relationships", "events", "contradictions", "questions"]) {
  assert.equal(
    (html.match(new RegExp(`<option>${category}<\\/option>`, "g")) || []).length,
    2,
    `${category} must be available in extraction and review`
  );
}
assert.ok(script.includes("function reviewStats()"), "review completion accounting required");
assert.ok(script.includes("function selfCheck()"), "browser startup self-check required");
assert.ok(html.includes("not automatic truth or canon"), "claims boundary must remain visible");
assert.ok(html.includes("Meet MOMMA"), "founder entry point must remain visible");
assert.ok(script.includes("const MOMMA_STEPS="), "guided MOMMA experience must remain available");
assert.ok(script.includes("MOMMA can help. She cannot take over."), "advisory boundary must be explained plainly");
assert.ok(script.includes("Public-safe boundary present"), "public safety result must remain visible");
assert.ok(script.includes("cannot manufacture authority"), "MOMMA cannot claim authority");
assert.ok(script.includes("const FOUNDER_LENSES="), "founder executive lenses must remain available");
for (const lens of ["today", "protected", "unfinished", "founders"]) {
  assert.ok(html.includes(`data-lens="${lens}"`), `missing founder lens: ${lens}`);
}
assert.ok(script.includes("Absence is not treated as consent."), "founder inactivity cannot imply consent");

console.log("EPU founder showcase smoke checks passed.");
