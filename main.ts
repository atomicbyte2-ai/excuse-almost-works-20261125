import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse: a gamer texts the boss to skip work on GTA 6 launch week.
// The laugh is in the detail itself — not a wild story, just a specific,
// boring, unlucky one: the work laptop is physically trapped in a broken
// lift, and maintenance won't open it until tomorrow. A tired manager has
// heard every excuse twice, but who invents a laptop stuck in a lift?
// The sting is the timing: tomorrow is the very night GTA 6 unlocks, so
// the excuse is almost believable — and almost certainly a lie.
const LINE =
  "my work laptop's stuck in the lift and maintenance won't open it till tomorrow, the night gta 6 unlocks";

// Validate the sealed gate: 1-140 chars, at most 20 words, single line,
// no control characters, and not only whitespace.
if (LINE.length < 1 || LINE.length > 140) {
  throw new Error(`Line must be 1-140 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("Line must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("Line must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  throw new Error("Line must not contain control characters");
}
// A hurried text has no leading or trailing whitespace, and the gate is
// measured in characters while the leaderboard Size column is bytes, so
// check both: the line must be identical after trimming and fit in 140
// UTF-8 bytes as well as 140 characters.
if (LINE !== LINE.trim()) {
  throw new Error("Line must not have leading or trailing whitespace");
}
if (Buffer.byteLength(LINE, "utf8") > 140) {
  throw new Error(
    `Line must be at most 140 UTF-8 bytes, got ${Buffer.byteLength(LINE, "utf8")}`,
  );
}
const words = LINE.trim().split(/\s+/);
if (words.length > 20) {
  throw new Error(`Line must be at most 20 words, got ${words.length}`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), LINE, "utf8");
console.log(`Wrote entry.txt: ${LINE.length} characters, ${words.length} words`);
