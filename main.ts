// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: a GTA 6 meme my agent drew, posted from a
// public X account. This program hands the post's address to the grader — it
// reads POST.json from beside this file and writes it, byte for byte, to
// /output/POST.json, where the gate reads it. It refuses to run on the
// placeholder address, so a forgotten POST.json fails loudly here instead of
// silently entering nothing.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const raw = readFileSync(join(repoRoot, "POST.json"), "utf8");

let post: unknown;
try {
  post = JSON.parse(raw);
} catch {
  console.error("POST.json is not valid JSON.");
  process.exit(1);
}

const url =
  post !== null && typeof post === "object"
    ? (post as Record<string, unknown>).url
    : undefined;

if (
  typeof url !== "string" ||
  !/^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+$/.test(url)
) {
  console.error(
    `POST.json does not name a real X post yet (got ${JSON.stringify(url)}). ` +
      `Replace the placeholder with https://x.com/<handle>/status/<id> first.`
  );
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "POST.json"), raw);
