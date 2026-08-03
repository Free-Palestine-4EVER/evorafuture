# Evora Future Home — handoff state (2026-08-03)

Written at the end of the client-handoff session. **Read this before touching
anything**, alongside `evoraproj.md` (the older, deeper project reference).
Where the two disagree, THIS file wins — a lot changed today.

---

## ✅ The site is LIVE — DNS and HTTPS are done

`evorahome.online` and `www.evorahome.online` both resolve to **`34.159.201.110`**
(A records, set at Namecheap 2026-08-03). Let's Encrypt issued certificates for
both hostnames at 14:03 UTC that day, valid to **1 Nov 2026**; Caddy auto-renews.
Every route returns 200. The old AWS IP `3.69.106.150` is dead — see below.

## 🔴 What is still open

**1. Rotate the admin password.** `bakri123` was committed to a **public** GitHub
repo and authenticated against production. The literal is gone from the working
tree, but **it is still in git history**, so treat it as burned:

```bash
ssh -i ~/.ssh/evora-server-key.pem ubuntu@34.159.201.110
sudo systemctl stop evora
cd /var/www/evora && node scripts/rotate-admin-password.mjs bakri@evorahome.online 'new-password'
sudo systemctl start evora
```
Un-publishing it properly needs the repo made private AND a `git filter-repo`
history rewrite + force push. The user chose to defer the repo-visibility change.

**2. Bakri is never told a lead arrived.** `notifyStaff()` calls OneSignal, which
is disabled (`NEXT_PUBLIC_ONESIGNAL_APP_ID` unset), and there is no email or SMS
path anywhere. A design request lands in `data/evora-db.json` and waits until
someone opens the dashboard. **This is the highest-value remaining fix** — a
WhatsApp or email ping on `createLead` would change how the tool actually works
for him day to day.

**3. Offsite backups are gone.** The daily job still tars `data/` +
`public/uploads/` to `/var/backups/evora/` (keeps 15), but the S3 upload died
with the AWS account. Backups are now **on the same disk as the data** — a single
point of failure. A GCS bucket is the natural replacement.

### What happened on 2026-08-03 that these exist because of

The public API was reachable without a session and `DELETE /api/portal/projects/:id`
was ungated. **15 real client projects were deleted from production** while the
site was live. They were restored from the 13:05 backup (`projects` went 1 → 17).
The API is gated now — but that is why the backup job and the password rotation
matter, not theory.

---

## Infrastructure — AWS is GONE, we are on GCP

**The AWS account was suspended (second time).** The EC2 box, its Elastic IP and
the S3 backup bucket are all unreachable and were never recovered. Do not try to
ssh to `3.69.106.150`, and treat any AWS instructions in `evoraproj.md` /
`DEPLOYMENT.md` as historical.

Everything was rebuilt on Google Cloud today.

| | |
| --- | --- |
| **GCP project** | `project-f60b7286-bdac-445b-b8c` ("My First Project") |
| **Billing account** | `013B5D-487585-796726` — ⚠️ shared with Lahza, see Cost |
| **VM** | `evora-server`, zone `europe-west3-b` (Frankfurt) |
| **Machine type** | `e2-standard-2` (2 vCPU / 8 GB) — upgraded from `e2-medium` |
| **Disk** | 30 GB pd-balanced, Ubuntu 24.04 LTS |
| **Static IP** | `evora-ip` = **`34.159.201.110`** (regional, europe-west3) |
| **Firewall** | `evora-allow-web` — tcp:22,80,443 from 0.0.0.0/0, target tag `evora-server` |
| **SSH** | `ssh -i ~/.ssh/evora-server-key.pem ubuntu@34.159.201.110` |
| **App path** | `/var/www/evora` |
| **Process** | systemd `evora.service` → `npm start`, PORT=3000, Restart=always |
| **Proxy** | Caddy, auto-HTTPS, serves `/uploads/*` directly off disk |
| **Deletion protection** | ENABLED on the instance |

`gcloud` is installed at `~/.local/google-cloud-sdk/bin/gcloud` and is **not on
PATH**. Prepend it. Already authenticated as `abcdappel19@gmail.com` — do NOT run
`gcloud auth login` (needs interactive browser input).

⚠️ **Do not create a new GCP project** — that billing account has exhausted its
project-creation quota. Reuse the existing one.

### Server-side env

`/var/www/evora/.env.local` contains exactly:

```
EVORA_LOCAL_DB=1
EVORA_LOCAL_STORAGE=1
NEXT_PUBLIC_EVORA_LOCAL=1
```

**Firebase keys must stay unset.** The client's Firebase billing went delinquent,
which is why this app runs on a local JSON DB + local file storage. The dormant
Firebase code paths still exist but must not be re-enabled.

### Operational hardening (all added today — none existed on the GCP box)

- `/usr/local/bin/evora-deploy.sh` — `npm ci` only if the lockfile changed, builds
  **in place (never wipes `.next`)**, restarts, health-checks up to 45s.
- `/usr/local/bin/evora-backup.sh` + `/etc/cron.d/evora-backup` — daily 03:15,
  tars `data/` + `public/uploads/` → `/var/backups/evora/`, keeps 15.
  **S3 upload is gone** (the AWS bucket died with the account). Backups are
  currently **local to the VM only** — that is a single point of failure worth
  fixing.
- `/usr/local/bin/evora-watchdog.sh` + `/etc/cron.d/evora-watchdog` — every 5 min,
  restarts only after **3 consecutive** failures so a deploy blip can't loop it.
- Logs: `/var/log/evora-{deploy,backup,watchdog}.log`

---

## How to deploy

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # node is NOT on default PATH
cd ~/Desktop/evorafuture

npx tsc --noEmit -p tsconfig.json    # must pass
npm run build                        # must pass

rsync -az --delete \
  -e "ssh -i ~/.ssh/evora-server-key.pem -o StrictHostKeyChecking=no" \
  --exclude node_modules --exclude .next --exclude .next-prod --exclude .git \
  --exclude backups --exclude .env.local --exclude service-account.json \
  --exclude tsconfig.tsbuildinfo --exclude Icon --exclude data \
  --exclude public/uploads \
  ~/Desktop/evorafuture/ ubuntu@34.159.201.110:/var/www/evora/

ssh -i ~/.ssh/evora-server-key.pem ubuntu@34.159.201.110 'sudo /usr/local/bin/evora-deploy.sh'
```

**Always keep `--exclude data` and `--exclude public/uploads`** — those are live,
server-only (client database + uploads) and must never be overwritten from local.

Last deploy: build 113s, health 200 after 2s, all routes verified.

---

## State as of end of session

- `npx tsc --noEmit` — clean.
- `npm run build` — clean, 42 routes.
- Deployed to the server and verified: `/` `/kitchen` `/shop` `/visit` `/catalog`
  `/showroom` `/studio` all **200**; `/portal` 307→/login (correct).
- Client data intact on server: `evora-db.json` 3,232,826 bytes (mtime Jul 24,
  untouched), `public/uploads` 5.0 MB / 22 files.
- **Everything is uncommitted in git.** The working tree has all of today's work.
  It was NOT committed or pushed — the last push was `33f98fe` early in the
  session, before any of the changes below.

---

## What changed today

### Typography (site-wide)
`app/(site)/layout.tsx` — display font **Bricolage Grotesque → Schibsted Grotesk**
(user picked it from 4 live candidates). Added **Fraunces** as `--f-serif-accent`,
used by `.serif-i` in `app/globals.css` for the italic brass accent word.
Arabic (`--font-ar`, IBM Plex Sans Arabic) deliberately does NOT get the Latin
serif — `html[dir="rtl"] .serif-i` falls back to the Arabic face.

### Hero (`components/HeroScroll.tsx`)
- Copy is **fully visible on first paint**, then **dissolves as you scroll**
  (`COPY_HOLD = 0.06` → `COPY_OUT = 0.42`, ease-out cubic).
- The dissolve is written **directly to the node's style in a rAF loop** via
  `copyRef` — deliberately NOT React state, because a setState per frame would
  re-render the hero and its canvas 60×/sec.
- The end-of-film **scroll lock was added and then removed** at the user's
  request. `FILM_END` is gone; the film again spans the whole section and heights
  are back to `600vh` / `420svh`. If a hold is ever wanted again, reintroduce
  `FILM_END` AND inflate those heights together, or the film just plays faster.
- Type: `clamp(2.9rem, min(8.4vw, 10.4vh), 7.4rem)`, weight 500, tracking
  -0.042em. The `min(vw, vh)` is load-bearing — a width-only clamp overflowed
  short laptop windows, pushing the eyebrow under the fixed nav and cutting the
  meta line off the bottom.
- Reduced motion still respects the scroll position; it only drops the animation.
  This is deliberate: Chrome's Battery Saver forces `prefers-reduced-motion`, so
  that path is a large slice of ordinary laptop visitors, not a rare branch.

### Kitchen — moved to its own page
- New route `app/(site)/kitchen/` (`page.tsx` + `layout.tsx` carrying metadata,
  since the page is a client component and can't export it).
- `components/ConfiguratorScroll.tsx` is **unchanged** but no longer on the
  homepage — it now lives at `/kitchen`, followed by four new sections in
  `components/kitchen/`: `KitchenMaterials` (built from the REAL `SURFACES` data
  in `lib/configurator.ts`), `KitchenCraft`, `KitchenFaq`, `KitchenEnquiry`.
- `KitchenEnquiry` reuses the existing lead flow (`openStartProject()` + WhatsApp
  deep link) rather than a new form — deliberately, to avoid a form that posts
  nowhere.
- `components/SiteShell.tsx` — the `showConfigurator` prop is **gone entirely**;
  `components/KitchenTeaser.tsx` renders in its slot unconditionally.

### Kitchen teaser (`components/KitchenTeaser.tsx`) — homepage
- True full-bleed **one-viewport** section: `height: 100svh`, **no `.container`**
  (the container's `max-width:1480px; margin-inline:auto` is exactly what kept
  making it a floating card in white space).
- `grid-template-columns: auto 1fr` — photo column sized by its own **4:3** ratio
  at full height (`max-width: 64vw` guard), copy takes the remainder. Below 900px
  it stacks to `auto 1fr` rows, photo keeping 4:3.
- Copy panel is **dark** (`#0d0b09`), text `#fbf7f0`, eyebrow `--brass-2`, and the
  CTA is inverted (paper bg / ink text) so it still reads as primary.
- Image: **`public/evora/kitchen-teaser-noir.{avif,webp}`**, 1600×1200, 52 KB avif.
  Generated with `sharp` from `public/evora/configurator/surface-nero-marquina.webp`
  (a real Evora configurator render — black marble waterfall island, walnut, warm
  cove lighting).

### Navigation (`components/Nav.tsx`)
`LINKS` is now **Shop → Kitchens → Lookbook → Visit Us**.
- **Added** `/kitchen` (new `nav_kitchen` key in `lib/i18n.tsx`).
- **Removed** "The Studio" and "AR Showroom" from the menu.
- ⚠️ The `/studio` and `/showroom` **routes are still live and reachable** — only
  the menu entries were removed. `/showroom` is still linked from the Footer and
  `/studio` from `components/StartAndTrack.tsx`.

### Footer (`components/Footer.tsx` + new `components/SocialFollow.tsx`)
- The **"Stay with Evora" newsletter/email-capture band is gone**, replaced by a
  follow band for Instagram + Facebook (real URLs, `FOLLOWERS` imported from
  `lib/brand.ts`, never hardcoded).
- Contains an **empty mount point `<div id="evora-ig-feed">`** for a future
  third-party Instagram feed widget. It renders nothing while empty — no
  placeholder box, no reserved space. **No external script is loaded today.**
- Added `/kitchen` ("Kitchen Islands") to the footer Explore list.
- `components/Newsletter.tsx` is unused/unmounted and was left alone; the
  `news_*` i18n keys were intentionally NOT deleted.

### `/visit` (`app/(site)/visit/page.tsx`, `components/Visit.tsx`, new `components/visit/VisitBooking.tsx`)
- Now has a **real booking form** that POSTs via `createLead()` →
  `/api/portal/leads` — the same live pipeline `StartProjectModal` already uses,
  so submissions genuinely persist. Fields: name (req), phone (req, ≥7 digits),
  preferred day/time, what they'd like to see (last two fold into `message`).
- Alongside it: tap-to-call and a WhatsApp deep link.
- The "free parking / free coffee" perk cards were demoted to a supporting line;
  replaced by "Two floors, fully styled" (sourced from the existing
  `col_film_caption` key).

### Factual correction — financing is 24 months, not 36
Changed in **five** places: `lib/data.ts` (marquee item, `financingPoints`, the
FAQ answer, and a comment) and `lib/i18n.tsx` (`fin_title`, `fin_body`), plus the
`CountUp value` in `components/Financing.tsx`. EN and AR both.
**"Up to 2 years" / "حتى سنتين" — do not let this regress to 36/3 years.**

### Image cropping fixes
- `components/ShopQuickView.tsx` — `.qv-stage-img` `cover` → `contain` (+ padding)
  so the whole product photo shows in the quick-view modal.
- `components/Rooms.tsx` — all 5 image classes `cover` → `contain`. The room
  photos come in two very different shapes (1.75:1 landscape vs ~0.52–0.67:1
  portrait), so the frame **switches ratio per room** via an `orientation` field
  in the room data — landscape rooms get an exact-match 7/4 frame (zero bars).
  Letterbox mats: `var(--ink)` where white caption text overlays the frame,
  `var(--bone)` where it doesn't.

### Squeezed section headers — fixed in three components
Same root cause each time: a narrow `max-width: NNch` on a header sitting inside
`.container` (which is `max-width:1480px; margin-inline:auto`), so the narrow box
got centred while every sibling used the full measure.
Fixed in `components/Rooms.tsx` (`.rm__head`), `components/ProcessJourney.tsx`
(`.pj-head`/`.pj-lede`/`.pj-loss`), `components/StartAndTrack.tsx`
(`.st__head`/`.st__lead`). Pattern: drop the cap, add `text-align: start`, widen
the lead to `70ch`. **If another squeezed header turns up, apply this same fix.**

### Process journey stage 04
`components/TransformStage.tsx` — stage 04 now renders a **still photo** instead
of a video. The still (`/evora/kitchen/stage-4.jpg`, avif sibling exists) was
already the video's own `poster` and was already rendering underneath, so the
video element was simply removed. `reveal.mp4` is still used by
`StartAndTrack.tsx` and `studio/StudioPresentation.tsx` — **do not delete it.**

---

## Desktop-app licences (added 2026-08-03, after the handoff session)

The Evora Studio desktop app (`~/Desktop/dev/Furniture/evora-studio-app` — the
Electron shell around `/evora3dstudio`) is now distributed as a licensed
Windows installer, `release/Evora-Studio-Setup-1.1.0.exe`. The server side of
that licensing lives in THIS repo.

**Two independent gates, on purpose.** The licence key unlocks the app shell.
The `/evora3dstudio` page inside still requires the normal admin sign-in — that
check in `app/(homestudio)/evora3dstudio/page.tsx` is untouched. A leaked
installer plus a leaked key still gets nobody into client data.

| | |
| --- | --- |
| **Model** | one key = one computer, admin-issued |
| **Server module** | `lib/portal/licenses.ts` |
| **Type** | `License` in `lib/portal/types.ts`, stored at `licenses/` in the JSON DB |
| **Signing secret** | `EVORA_LICENSE_SECRET`, else generated once into `config/licenseSecret` — separate from the session secret so rotating one doesn't disturb the other |
| **Admin UI** | `components/portal/LicensesPanel.tsx`, new "Licences" section in `/admindashboard` |
| **Client helpers** | `listLicenses` / `createLicense` / `setLicenseRevoked` / `unbindLicense` / `deleteLicense` in `lib/portal/store.ts` |

Routes, all in the existing catch-all `app/api/portal/[...path]/route.ts`:

```
GET    /api/portal/licenses                 admin — list
POST   /api/portal/licenses                 admin — mint { label, note, expiresAt }
POST   /api/portal/license-revoke           admin — { key, on }
POST   /api/portal/license-unbind           admin — { key }   frees the machine binding
DELETE /api/portal/licenses/:key            admin — delete
POST   /api/portal/license-activate         open  — { key, machineId, machineName, appVersion }
POST   /api/portal/license-verify           open  — { token, machineId }
```

- The last two **must stay unauthenticated** — they are the app's front door,
  and the app has a key, not a session. They are bounded instead by an
  in-memory per-IP throttle (10 failures / 10 min → 429). Successes never
  count, so a real machine re-checking in cannot lock itself out.
- The app treats a 429 or a 5xx as "unreachable" and falls back to its offline
  grace window, so a throttled or wobbling server never locks working staff
  out mid-day. Only a **403** clears the local licence.
- Machine identity is a hash of the OS machine id (Windows `MachineGuid`,
  macOS `IOPlatformUUID`, Linux `/etc/machine-id`) — **not** a MAC address,
  which moves the moment a dock or VPN adapter appears. The raw value never
  leaves the client; only `sha256("evora-machine:" + id)` is stored.
- Tokens are stateless HMAC (same shape as the session token) and are renewed
  on every successful check, so a machine that checks in monthly never expires.
- Offline grace is **14 days** (`OFFLINE_GRACE_MS` in the app's `license.js`);
  a running app re-checks every 6 hours, so a revoked key dies the same day.

⚠️ **`normalizeKey()` has a subtle rule — do not "simplify" it.** Every letter
of `EVRA` is in the key alphabet, so a key body can legitimately begin with
those four characters. The prefix is therefore stripped **only when the string
is exactly 24 characters**. An unconditional `startsWith("EVRA")` slice
corrupts about one key in a million into a permanent "invalid key". The same
rule is duplicated in the app's `activate.html`, which is why the activation
field renders `EVRA-` as fixed chrome outside the input rather than as
editable text — the earlier version could not tell its own auto-inserted
prefix from one the user typed, and turned a hand-typed key into
`EVRA-EVRA1-BGXX7-…`.

🔴 **The app is DNS-blocked like everything else.** Its default target is
`https://evorahome.online/evora3dstudio`, so until the A records at the top of
this file are fixed, activation fails with "Couldn't reach the Evora server".
Nothing about the licensing is wrong when that happens. `EVORA_STUDIO_URL`
overrides the target (licensing follows it — same origin) for dev.

## Open items

1. **DNS + Caddy restart** — see the top of this file. Blocks HTTPS.
2. **Instagram feed widget** — the client must create an account at a feed
   provider (Behold.so recommended: free tier, lightweight) and connect Evora's
   Instagram **Business** account via the provider's OAuth. Then paste the embed
   into the `#evora-ig-feed` mount point using `next/script` with
   `strategy="lazyOnload"`. Nothing external ships until then.
   ⚠️ Verify the provider's CDN is reachable **from Jordan** and that the site's
   service worker doesn't intercept its requests.
3. **A newly generated AI kitchen photo** was requested but never landed — see
   Higgsfield gotcha below. The teaser currently uses the real Nero Marquina
   render, which looks good; decide whether to retry or keep it.
4. **Media bloat, not yet actioned** (audited today, nothing deleted):
   - **~34 MB of dead, unreferenced video** in `public/evora/`:
     `config-source.mp4` (25.2 MB), `hero-c-source.mp4` (9.8 MB), `hero-a.mp4`
     (6.0 MB), `hero-b.mp4` (6.3 MB). Zero references anywhere — safe to delete.
   - `hero-c.mp4` (the Khalda showroom card) is **10.5 MB at 7.3 Mbps / 1600×900**
     — roughly 2–2.5× higher bitrate than needed. Suggested re-encode:
     `ffmpeg -i hero-c.mp4 -an -c:v libx264 -crf 26 -preset slow -maxrate 3500k -bufsize 6000k -movflags +faststart hero-c-web.mp4`
     (~4–4.5 MB). Note it lazy-loads correctly and phones get a 970 KB mobile
     variant — the gap is landscape phones/tablets (>768px) getting the full file.
   - The genuinely biggest files site-wide are 3D models, not video:
     `chesterfield-cream.glb` (58 MB) and `lounge-orange.glb` (41 MB), both used
     ONLY by the `/clientexample` demo page. `public/` totals 618 MB.
5. **Git** — everything today is uncommitted. Nothing has been pushed since
   `33f98fe`. That now includes the licence work described above.
7. **The Windows installer is unsigned** — SmartScreen shows "Windows
   protected your PC" on first run and the user must click *More info* → *Run
   anyway*. Fine for internal use; removing it needs a paid OV/EV code-signing
   certificate.
8. **The `.exe` has never been run on real Windows.** Its licensing logic is
   covered by `scripts/selftest-node.js` (all green against the live API) and
   the activation screen was verified in Chromium, but the packaged installer
   itself has only been verified structurally (x64 PE, correct icon/version
   resources, correct asar payload).
6. **Cost** — see below.

---

## Cost

`e2-standard-2` is **$63.02/mo** in europe-west3. The user's stated budget was
$40–50; they chose to keep it anyway. Facts worth having:

- **E2 gets NO sustained-use discount** (only N1/M1/M2 at 30%, N2/N2D/C2/C2D at
  20%). $63.02 is genuinely the cheapest 8 GB option in Frankfurt.
- **RAM was never the bottleneck.** Measured: peak build RSS **1.02 GB** against
  3.8 GB available on the old box — it never touched swap. The old machine was
  **CPU-throttled** (83% utilisation pinned at e2-medium's shared-core baseline).
  Build went 158s → 113s purely from lifting that.
- **`e2-highcpu-2` is $46.53/mo** — in budget, identical CPU gain, but only 2 GB
  against a ~1 GB build peak plus the running server. Viable but tight.
- A 1-year committed-use discount would bring `e2-standard-2` to $39.71/mo.
- ⚠️ **Billing account `013B5D-487585-796726` is shared with Lahza**, is on the
  $300 free trial, and has a **$20 budget alert** configured. $63/mo will trip
  that alert and burn the shared trial credit in under 5 months.

Rollback to the smaller machine (~90s downtime):

```bash
gcloud compute instances stop evora-server --zone=europe-west3-b && \
gcloud compute instances set-machine-type evora-server --zone=europe-west3-b --machine-type=e2-highcpu-2 && \
gcloud compute instances start evora-server --zone=europe-west3-b
```

---

## Gotchas learned today (do not re-learn these)

- **Vercel is blocked in Jordan** and **Firebase billing went delinquent** — both
  were already tried and abandoned for this project. Do not propose them again.
  Also: the app uses a local JSON DB + local `public/uploads/`, which Vercel's
  ephemeral filesystem physically cannot support.
- **Version an image's FILENAME when its content changes.** Replacing bytes at the
  same path left both the browser disk cache AND the site's service worker
  serving the OLD picture, which cost real debugging time. Hence
  `kitchen-teaser-noir.*`.
- **Lenis hijacks `window.scrollTo`** — programmatic scrolling for testing must go
  through `window.lenis.scrollTo(y, {immediate:true})`, or readings are garbage.
- **Higgsfield unlimited is web-only.** `models_explore` reports
  `unlim.available: false` via MCP, and `generate_image` with `use_unlim` is
  rejected. Account credits are at **0.04**. Generation must be driven through the
  web app's Unlimited toggle in a browser — and **do not close that tab
  mid-generation**, the result was lost that way.
- **The local `/imagine` generator is unusable right now** — the ~6.5 GB models
  under `~/Desktop/dev/Tools & AI/ogai-local/models/` have been deleted.
- **`aspect-ratio` + `max-height` on a CSS grid item** makes Chromium shrink the
  box's *width*, not just cap the height — leaves a blank gap. Fix with an
  explicit `width: 100%`.
- **Screenshots taken immediately after page load can catch the hero mid-animation
  and look blank.** Verify with computed styles / `getBoundingClientRect`, not a
  single screenshot, before concluding something is broken.
