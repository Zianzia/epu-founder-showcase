import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const path = process.argv[2] || "data/founder-progress.json";
const text = readFileSync(path, "utf8");
const snapshot = JSON.parse(text);
const requiredBoundaries = ["NO_MANUSCRIPTS", "NO_SOURCE_TEXT", "NO_CREDENTIALS", "NO_PRIVATE_EVIDENCE", "NO_WRITE_AUTHORITY", "NOT_CANON_APPROVAL", "NOT_CORPORATE_APPROVAL"];
const forbiddenKeys = /(?:private.?key|api.?key|password|secret|token|credential|source.?text|manuscript.?text|private.?evidence|receipt.?payload)/i;

function inspect(value, trail = "snapshot") {
  if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${trail}[${index}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    assert.ok(!forbiddenKeys.test(key), `forbidden field at ${trail}.${key}`);
    inspect(nested, `${trail}.${key}`);
  }
}

assert.equal(snapshot.schema, "epu.public-founder-progress.v0.1");
assert.equal(snapshot.classification, "PUBLIC_SANITIZED_READ_ONLY");
assert.match(snapshot.source?.repository || "", /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
assert.match(snapshot.source?.commit || "", /^[a-f0-9]{40}$/);
assert.equal(snapshot.source?.exportMode, "MANUAL_SANITIZED_SNAPSHOT");
assert.ok(!Number.isNaN(Date.parse(snapshot.generatedAt)), "generatedAt must be an ISO date");
for (const boundary of requiredBoundaries) assert.ok(snapshot.claimsBoundary?.includes(boundary), `missing boundary: ${boundary}`);
for (const lens of ["today", "protected", "unfinished", "founders"]) {
  assert.ok(snapshot.lenses?.[lens], `missing lens: ${lens}`);
  assert.ok(Array.isArray(snapshot.lenses[lens].cards), `lens cards missing: ${lens}`);
}
assert.equal(snapshot.publication?.state, "PUBLISHED");
assert.ok(snapshot.publication?.approvedBy, "human approver required");
assert.ok(snapshot.publication?.approvedRole, "approver role required");
assert.ok(!Number.isNaN(Date.parse(snapshot.publication?.approvedAt)), "approvedAt must be an ISO date");
assert.equal(snapshot.publication?.approvalEvidence, "GITHUB_MERGED_CHANGE");
assert.equal(snapshot.publication?.cryptographicSignature, false);
inspect(snapshot);
console.log(`Validated public founder snapshot: ${path}`);
