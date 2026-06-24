# Evora Future Home — deployment

## Environment variables (set these on Vercel / your host)

Firebase (client):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=evorafuture-bdb21.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=evorafuture-bdb21
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=evorafuture-bdb21.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Firebase (server — Realtime Database via Admin SDK):
```
FIREBASE_DB_URL=https://evorafuture-bdb21-default-rtdb.firebaseio.com
# Paste the ENTIRE service-account JSON on one line (it replaces the local
# service-account.json file, which is git-ignored and not deployed):
FIREBASE_SERVICE_ACCOUNT={"type":"service_account", ... }
```

OneSignal push notifications (optional — leave unset to disable push):
```
NEXT_PUBLIC_ONESIGNAL_APP_ID=...        # OneSignal → Settings → Keys & IDs → App ID
ONESIGNAL_REST_API_KEY=...              # OneSignal → Settings → Keys & IDs → REST API Key
```
In the OneSignal dashboard: add your **Web** platform with the site URL = your
domain, and create a segment named **Admins** (filter: tag `role` = `admin`) so
new-lead alerts reach staff. Customers are auto-identified by their portal uid.

## Known Vercel/serverless caveats (need a change before production)

1. **File uploads** (`/api/portal/upload` → `.evora-uploads/`) write to local disk.
   Vercel's filesystem is ephemeral/read-only, so uploaded GLBs/plans/photos
   won't persist. Move these to Firebase Storage or Vercel Blob for production.
2. **Realtime** uses Server-Sent Events (`/api/portal/events`) with an in-process
   event bus — fine on a single long-running Node server, but serverless
   functions can't hold the connection. For Vercel, switch the client to Firebase
   Realtime Database listeners (the data already lives in RTDB).

Both work as-is when self-hosted on a normal Node server (e.g. a VPS) behind your
domain. Ping me to make them Vercel-native and I'll swap uploads → Storage and
SSE → RTDB listeners.
