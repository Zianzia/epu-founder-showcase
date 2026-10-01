import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync("index.html", "utf8");
const progressText = readFileSync("data/founder-progress.json", "utf8");
const progress = JSON.parse(progressText);
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
const visualScript = readFileSync("visual-studio.js", "utf8");
assert.ok(script, "inline application script must exist");
assert.doesNotThrow(() => new Function(script), "application JavaScript must parse");
assert.doesNotThrow(() => new Function(visualScript), "visual studio JavaScript must parse");

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
  (html.match(/<button class="step(?:\s|")/g) || []).length,
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
    (html.match(new RegExp(`<option value="${category}">[^<]+<\\/option>`, "g")) || []).length,
    2,
    `${category} must be available in extraction and review`
  );
}
assert.ok(script.includes("function reviewStats()"), "review completion accounting required");
assert.ok(script.includes("function selfCheck()"), "browser startup self-check required");
assert.ok(html.includes("does not transfer ownership, establish consent, or grant canon authority"), "claims boundary must remain visible");
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
assert.ok(html.includes("Choose your <em>threshold.</em>"), "mythic gateway welcome must be visible");
assert.ok(html.includes("Why there are checkboxes here"), "name grouping controls must explain their purpose");
for (const label of ["Use this", "Set aside", "Ask the creator", "Ignore"]) {
  assert.ok(script.includes(label), `creator-friendly choice missing: ${label}`);
}
assert.ok(html.includes("Advanced MOMMA analysis import"), "technical bridge must remain available but optional");
assert.ok(existsSync("assets/alpha-supremica-omniverse-gateway.webp"), "mythic gateway artwork must exist");
for (const domain of ["alpha", "epu", "axiom", "sigmus"]) {
  assert.ok(html.includes(`data-domain="${domain}"`), `missing universal gateway: ${domain}`);
}
assert.ok(script.includes("const DOMAIN_GATEWAYS="), "universal gateways must have bounded domain descriptions");
assert.ok(html.includes("OpenAI / ChatGPT"), "concept-art creative engine attribution must remain visible");
assert.ok(script.includes("Protected · not yet activated"), "unconstructed creator spaces must remain protected");
assert.ok(script.includes("Enter truth and evidence"), "Paradigm lane must remain distinct");
assert.ok(script.includes("Enter stories and lore"), "Paradox lane must remain distinct");
assert.ok(html.includes(".gateway-fallback,#domain-panel+.grid{display:none}"), "duplicate gateway controls and shortcut cards must stay visually removed");
assert.ok(html.includes("background:transparent;color:transparent;box-shadow:none"), "portal hit regions must not cover or distort the artwork");
for (const id of ["wb-editor", "wb-file", "wb-domain", "wb-insights", "wb-conversation", "wb-history", "wb-compare", "wb-replacement", "wb-apply", "wb-download", "wb-download-history"]) {
  assert.ok(html.includes(`id="${id}"`), `creative workbench is missing #${id}`);
}
assert.ok(script.includes("const WB="), "creative workbench state must remain explicit");
assert.ok(script.includes("function wbCaptureSelection()"), "passage-linked revision must remain available");
assert.ok(script.includes("function wbFacts(text)"), "fresh local MOMMA review must remain available");
assert.ok(script.includes("HUMAN_APPLIED_REVISIONS"), "review history must distinguish human-applied changes");
assert.ok(html.includes("full generative MOMMA conversation requires the future secure private model gateway"), "public local reasoning limit must remain visible");
assert.ok(html.includes("Advanced evidence review and portable package"), "existing evidence workflow must remain available as an advanced layer");
assert.ok(script.includes('wbDiscard.id="wb-discard"'), "workspace must expose a complete-review discard control");
assert.ok(script.includes("Discard this entire local review?"), "discarding a review must require explicit confirmation");
assert.ok(script.includes("Workspace refreshed."), "discard must report a clean workspace");
assert.ok(script.includes('WB.original=""') && script.includes('WB.revisions=[]') && script.includes('S={src:null'), "discard must clear both creative and advanced review state");
for (const id of ["project-name", "project-list", "project-autosave", "project-save", "project-load", "project-checkpoint", "project-duplicate", "project-export", "project-import", "project-delete"]) {
  assert.ok(script.includes(`id="${id}"`), `local project library is missing #${id}`);
}
assert.ok(script.includes('indexedDB.open(PROJECT_DB,1)'), "project recovery must use browser-local IndexedDB");
assert.ok(script.includes("function scheduleRecovery()"), "editing must support automatic recovery drafts");
assert.ok(script.includes("LOCAL_DEVICE_ONLY"), "project packages must declare their local-only boundary");
assert.ok(script.includes("Permanently delete the locally saved project"), "saved-project deletion must require explicit confirmation");
assert.ok(script.includes("Saved projects remain available"), "discarding an active review must not silently delete saved projects");
assert.ok(script.includes("Unsupported project structure"), "imported projects must be validated before use");
for (const id of ["wb-annotations", "wb-mark-legend", "wb-toggle-marks", "wb-active-finding"]) {
  assert.ok(script.includes(`id=\"${id}\"`), `inline MOMMA findings are missing #${id}`);
}
assert.ok(script.includes("function wbFindingRanges(text)"), "MOMMA findings must retain exact document ranges");
assert.ok(script.includes("function wbActivateFinding(f)"), "inline findings must select the exact source wording for correction");
assert.ok(script.includes("This is an advisory marker"), "inline findings must preserve MOMMA's advisory boundary");
assert.ok(script.includes("Show MOMMA marks") && script.includes("Edit document"), "authors must be able to enter and leave the annotation view");

for (const id of ["visual", "vs-character", "vs-controller", "vs-concepts", "vs-gallery", "vs-build-brief", "vs-candidate", "vs-canon-status", "vs-commercial-status", "vs-reviewer", "vs-export", "vs-import"]) {
  assert.ok(html.includes(`id="${id}"`), `visual studio is missing #${id}`);
}
assert.ok(existsSync("visual-studio.css"), "visual studio stylesheet must exist");
assert.ok(html.includes("Renderer status: not connected."), "the UI must not imply a renderer is connected");
assert.ok(html.includes("Leonardo da Vinci"), "the foundational visual method must remain visible");
assert.ok(visualScript.includes("epu-visual-studio"), "visual identity records must persist locally");
for (const boundary of ["MOMMA_ADVISORY_ONLY", "HUMAN_CANON_APPROVAL_REQUIRED", "VISUAL_MATCH_NOT_OWNERSHIP", "COMMERCIAL_CLEARANCE_SEPARATE", "LOCAL_DEVICE_ONLY", "RENDERER_NOT_CONNECTED"]) {
  assert.ok(visualScript.includes(boundary), `visual package boundary missing: ${boundary}`);
}
assert.ok(visualScript.includes("Approved status requires a named human reviewer"), "MOMMA must not approve visual canon");
assert.ok(html.includes("Creative / canon disposition") && html.includes("Commercial disposition"), "canon and commercial clearance must remain separate");

console.log("EPU founder showcase smoke checks passed.");
