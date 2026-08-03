// Rotate a portal account's password in the self-hosted JSON store.
//
// Why this exists: bootstrap() in lib/portal/serverdb.ts only ever CREATES the
// admin account when it is missing — it deliberately never resets a live
// password — and there is no change-password screen in the dashboard. This is
// the supported way to change an existing password.
//
//   node scripts/rotate-admin-password.mjs bakri@evorahome.online 'new-password'
//   node scripts/rotate-admin-password.mjs bakri@evorahome.online          # generates one
//
// STOP THE SERVER FIRST. localdb.ts caches the whole store in memory and
// rewrites the file on the next write, so an edit made while the service is
// running is silently discarded:
//
//   sudo systemctl stop evora
//   node scripts/rotate-admin-password.mjs bakri@evorahome.online 'new-password'
//   sudo systemctl start evora
//
// A timestamped copy of the store is written next to it before anything
// changes. The password is never stored in the clear: the hash format is
// exactly the `salt:scrypt` pair that serverdb.ts's verifyPw() expects.

import { readFileSync, writeFileSync, renameSync } from "fs";
import { randomBytes, scryptSync } from "crypto";
import path from "path";

const FILE = process.env.EVORA_DB_FILE || path.join(process.cwd(), "data", "evora-db.json");

const identifier = (process.argv[2] || "").trim();
if (!identifier) {
  console.error("usage: node scripts/rotate-admin-password.mjs <email-or-phone> [new-password]");
  process.exit(1);
}
const supplied = process.argv[3];
const password = supplied && supplied.length ? supplied : randomBytes(15).toString("base64url");
if (password.length < 8) { console.error("Password must be at least 8 characters."); process.exit(1); }

// Same scheme as hashPw() in lib/portal/serverdb.ts — keep the two in step.
const salt = randomBytes(16).toString("hex");
const hash = `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;

let db;
try { db = JSON.parse(readFileSync(FILE, "utf8")); }
catch (e) { console.error("Cannot read DB at", FILE, "—", e.message); process.exit(1); }

const digits = (s) => { const d = (s || "").replace(/[^\d]/g, ""); return d.length ? d : (s || "").trim().toLowerCase(); };
const want = identifier.toLowerCase();
const users = db.users || {};
const uid = Object.keys(users).find((k) => {
  const u = users[k] || {};
  return (u.email || "").trim().toLowerCase() === want || (u.phone && digits(u.phone) === digits(identifier));
});

if (!uid) {
  console.error(`No account matching "${identifier}". Accounts present:`);
  for (const k of Object.keys(users)) console.error(`  ${k}  ${users[k]?.email || users[k]?.phone || ""}  (${users[k]?.role || "?"})`);
  process.exit(1);
}

const backup = `${FILE}.${new Date().toISOString().replace(/[:.]/g, "-")}.bak`;
writeFileSync(backup, readFileSync(FILE));

users[uid].password = hash;
const tmp = `${FILE}.tmp`;
writeFileSync(tmp, JSON.stringify(db));
renameSync(tmp, FILE);

console.log(`Rotated password for ${users[uid].email || users[uid].phone} (uid ${uid}).`);
console.log(`Backup written to ${backup}`);
if (!supplied) console.log(`\n  NEW PASSWORD: ${password}\n\nStore it in a password manager now — it is not saved anywhere else.`);
console.log("Restart the server for the change to take effect.");
