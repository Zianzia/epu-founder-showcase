import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync("index.html", "utf8");
const progressText = readFileSync("data/founder-progress.json", "utf8");
const progress = JSON.parse(progressText);
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
assert.ok(script, "inline application script must exist");
assert.doesNotThrow(() => new Function(script), "application JavaScript must parse");

const requiredIds = [
  "health", "stageguide", "domain", "file", "text", "parse", "demo-source",
  "ecat", "elist", "rcat", "rlist", "completion", "export", "vfile", "inspect"
  , "momma", "momma-panel", "momma-progress", "momma-back", "momma-next"
  , "executive-title", "lens-tabs", "lens-panel"
  , "snapshot-status"
  , "publication-status"
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
for (const lens of ["progress", "today", "protected", "unfinished", "founders"]) {
  assert.ok(html.includes(`data-lens="${lens}"`), `missing founder lens: ${lens}`);
}
assert.ok(script.includes("Absence is not treated as consent."), "founder inactivity cannot imply consent");
assert.equal(progress.schema, "epu.public-founder-progress.v0.1");
assert.equal(progress.classification, "PUBLIC_SANITIZED_READ_ONLY");
for (const boundary of ["NO_MANUSCRIPTS", "NO_SOURCE_TEXT", "NO_CREDENTIALS", "NO_PRIVATE_EVIDENCE", "NO_WRITE_AUTHORITY", "NOT_CANON_APPROVAL", "NOT_CORPORATE_APPROVAL"]) {
  assert.ok(progress.claimsBoundary.includes(boundary), `missing snapshot boundary: ${boundary}`);
}
for (const forbidden of ["privateKey", "apiKey", "password", "sourceText", "manuscriptText", "credential"]) {
  assert.ok(!progressText.includes(`"${forbidden}"`), `forbidden public snapshot field: ${forbidden}`);
}
assert.ok(script.includes("snapshot safety boundary failed"), "client must fail closed on unsafe snapshots");
assert.ok(script.includes("human publication record failed"), "client must require a human publication record");
assert.ok(script.includes('renderLens("progress")'), "progress since last update must be the default founder view");

console.log("EPU founder showcase smoke checks passed.");
