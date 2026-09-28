/**
 * pnpm resume:check (contrib-engineering §7): recomputes the résumé's
 * source hashes and compares them with resume.lock.json, and checks that the
 * committed PDF is the one the lock recorded. Exit codes: 0 fresh, 1 stale
 * or missing. It never launches a browser.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "../lib/repo";
import {
  combine,
  hashInputs,
  LOCK_PATH,
  PDF_PATH,
  pdfHash,
  type ResumeLock,
} from "./lock";

function fail(problems: readonly string[]): never {
  for (const problem of problems) console.error(`resume:check: ${problem}`);
  console.error("resume:check: the résumé is out of date: run pnpm resume:pdf");
  process.exit(1);
}

const lockPath = join(REPO_ROOT, LOCK_PATH);
const pdfPath = join(REPO_ROOT, PDF_PATH);
if (!existsSync(lockPath)) fail([`missing ${LOCK_PATH}`]);
if (!existsSync(pdfPath)) fail([`missing ${PDF_PATH}`]);

const lock = JSON.parse(readFileSync(lockPath, "utf8")) as ResumeLock;
const fresh = hashInputs();
const problems: string[] = [];

for (const [input, hash] of Object.entries(fresh)) {
  if (lock.inputs[input] === undefined) problems.push(`new input ${input}`);
  else if (lock.inputs[input] !== hash) problems.push(`changed ${input}`);
}
for (const input of Object.keys(lock.inputs)) {
  if (!(input in fresh)) problems.push(`removed input ${input}`);
}
if (lock.file !== PDF_PATH) problems.push(`the lock is for ${lock.file}`);
if (lock.sources !== combine(fresh)) problems.push("the source hash differs");
if (lock.pdf.sha256 !== pdfHash(readFileSync(pdfPath))) {
  problems.push(`${PDF_PATH} is not the PDF the lock recorded`);
}

if (problems.length > 0) fail(problems);
console.log(
  `resume:check: ${PDF_PATH} matches its ${String(Object.keys(fresh).length)} locked inputs`,
);
