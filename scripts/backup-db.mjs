// Timestamped backup of the local DB. Run `npm run db:backup` (or on a cron) so
// the self-hosted store has restore points — there is no cloud copy anymore.
// Keeps the newest 30 backups.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync } from "fs";
import path from "path";

const root = process.cwd();
const src = process.env.EVORA_DB_FILE || path.join(root, "data", "evora-db.json");
const dir = path.join(root, "data", "backups");

let data;
try { data = readFileSync(src); } catch { console.error("No DB file at", src); process.exit(1); }

mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const out = path.join(dir, `evora-db-${stamp}.json`);
writeFileSync(out, data);

// prune to newest 30
const files = readdirSync(dir).filter((f) => f.endsWith(".json"))
  .map((f) => ({ f, t: statSync(path.join(dir, f)).mtimeMs }))
  .sort((a, b) => b.t - a.t);
for (const { f } of files.slice(30)) unlinkSync(path.join(dir, f));

console.log("Backed up →", out, `(${(data.length / 1024).toFixed(1)} KB, ${Math.min(files.length + 1, 30)} kept)`);
