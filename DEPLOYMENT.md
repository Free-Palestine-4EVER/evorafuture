# Evora Future Home — environment variables

> **Deploy steps are NOT here.** See **`evoraproj.md` → "How to deploy a change"**
> for the authoritative procedure (build locally → rsync → `evora-deploy.sh`).
> This file documents only the environment surface.
>
> **This app is self-hosted on an AWS VPS** (systemd `evora.service` + Caddy,
> `evorahome.online`). It is **not** on Vercel — an earlier version of this file
> described a Vercel deploy, which has been dead for a long time. Ignore any
> Vercel-flavoured advice you find in old notes.

## Where env vars live

`/var/www/evora/.env.local` on the server. It is **excluded from the rsync** on
purpose, so it survives deploys and must be edited on the box directly:

```bash
ssh -i ~/.ssh/evora-server-key.pem ubuntu@3.69.106.150
nano /var/www/evora/.env.local
```

⚠️ Anything named `NEXT_PUBLIC_*` is **inlined at build time**, not read at
runtime. Changing one has no effect until `/usr/local/bin/evora-deploy.sh`
rebuilds the app. A few vars also come from the systemd unit
(`/etc/systemd/system/evora.service`: `NODE_ENV`, `EVORA_LOCAL_DB`, `PORT`) —
edit that and you must `sudo systemctl daemon-reload` before restarting.

## Currently set in production

```
EVORA_LOCAL_DB=1          # also set in the systemd unit
NODE_ENV=production
NEXT_PUBLIC_EVORA_LOCAL=1 # forces the self-hosted realtime path (see below)
```

That is the whole live configuration. Everything below is **optional and
currently unset** — the app is fully functional without it.

## Self-hosting flags

| Var | Effect |
| --- | --- |
| `EVORA_LOCAL_DB=1` | Use the file-backed JSON DB (`lib/portal/localdb.ts`) instead of Firebase RTDB. |
| `NEXT_PUBLIC_EVORA_LOCAL=1` | Keeps browsers off Firebase entirely: realtime rides the server's SSE `/api/portal/events` stream instead of a direct client→Firebase connection. |
| `EVORA_DB_FILE` | Override the JSON DB path (defaults to `data/evora-db.json`). |
| `EVORA_PUBLIC_BASE` | Override the public base URL used when building upload URLs. Normally derived from the request `Host` header, so leave unset. |
| `NEXT_PUBLIC_PORTAL_API` | Point the portal client at a different API origin. Only needed if the portal is served from a different host than the API. |

**Why `NEXT_PUBLIC_EVORA_LOCAL=1` matters even though nothing appears to break
without it:** `lib/portal/realtime.ts` computes
`realtimeConfigured = !LOCAL && Boolean(apiKey && databaseURL)`. With the flag
absent, the app fell through to the correct SSE path only because the Firebase
keys below happen to be unset too. The moment anyone adds a Firebase key for an
unrelated reason, realtime would silently switch to attempting a direct Firebase
connection that no longer exists. The flag makes the intent explicit and
un-flippable. Added 2026-07-23.

## Firebase (legacy — unset, and intentionally so)

The client's Firebase billing went delinquent, which is why this app moved to a
local DB + local file storage. `firebase-admin` is gone from the server path;
`lib/firebase.ts`, `lib/portal/admin.ts` and `lib/portal/realtime.ts` still
contain the code paths, but they stay dormant while these are unset:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL      # else derived from PROJECT_ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
FIREBASE_DB_URL                        # server-side Admin SDK
```

Do not set these unless you are deliberately migrating back to the cloud. If you
do, set `NEXT_PUBLIC_EVORA_LOCAL=0` in the same change, or you get a
half-local/half-cloud app.

## OneSignal push notifications (optional — unset)

Still wired up in `lib/portal/notify.ts`, `lib/portal/push.ts` and
`components/portal/OneSignalInit.tsx`. Leave unset to disable push entirely.

```
NEXT_PUBLIC_ONESIGNAL_APP_ID    # OneSignal → Settings → Keys & IDs → App ID
ONESIGNAL_REST_API_KEY          # OneSignal → Settings → Keys & IDs → REST API Key
```

To enable: add the **Web** platform in the OneSignal dashboard with the site URL
set to `https://evorahome.online`, and create a segment named **Admins**
(filter: tag `role` = `admin`) so new-lead alerts reach staff. Customers are
auto-identified by their portal uid.

## Secrets that must never be committed

`.env.local` and `service-account.json` are gitignored and excluded from the
rsync. `data/` (password hashes) and `public/uploads/` are live server-only —
never overwrite them from a local copy.
