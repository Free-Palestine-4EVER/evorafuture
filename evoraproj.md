# Evora Future Home — project reference

Read this file fully before doing anything when the user references "evoraproj"
or asks for work on Evora. It has the full picture: what this is, what's live,
how to deploy, and gotchas learned the hard way this session — re-learning them
by trial and error wastes real time and (once) filled the disk.

More detail lives in two files on the user's Desktop (not in this repo):
`~/Desktop/EVORA_EVERYTHING.txt` (full credentials, DNS, cost breakdown) and
`~/Desktop/EVORA_CAPACITY_AND_LIMITS.txt` (server capacity/scaling analysis).

## What this is

Evora Future Home — a furniture company in Khalda, Amman. This repo is the
whole platform: marketing site, shop (346 real products), a bilingual
(English/Arabic) client portal, a staff admin dashboard, and a 2D→3D room
design tool ("Evora Home Studio"). Fully self-hosted — no Firebase, no Vercel,
no external DB service. One Next.js 16 app, one server, one JSON file as the
database.

## Live infrastructure

- **Domain**: evorahome.online (Namecheap DNS → A records @ and www both
  point at the server's static IP)
- **Server**: AWS EC2, eu-central-1 (Frankfurt), instance `evora-server`
  (t3.medium, 2 vCPU / 3.7GB RAM, 28GB disk), static Elastic IP
  `3.69.106.150`
- **SSH**: `ssh -i ~/.ssh/evora-server-key.pem ubuntu@3.69.106.150`
- **App path on server**: `/var/www/evora`
- **Database**: `/var/www/evora/data/evora-db.json` — one JSON file, RTDB-
  style API (`lib/portal/localdb.ts`). No Firebase, code removed entirely.
- **Process manager**: systemd unit `evora.service` (`npm start`, auto-
  restarts, auto-starts on boot). Caddy (`caddy.service`) reverse-proxies
  and handles free automatic HTTPS via Let's Encrypt.
- **Hardening in place**: a cron watchdog restarts the app/Caddy if either
  stops responding (every minute); an hourly job cleans logs if disk usage
  gets high; 4GB swap file; a `ChunkErrorRecovery` component (mounted in
  every root layout) auto-reloads a tab once if it hits a stale-chunk error
  after a deploy; **automated daily backups** (see below); a deploy script
  that no longer wipes `.next` before rebuilding (see below).
- **NOT yet done**: no CDN (Cloudflare recommended — needs the user to
  create the free account + switch Namecheap nameservers, then I configure
  it from there), EC2 auto-recovery CloudWatch alarm (the console's
  "Conditions" step reliably fails to render in the automated browser —
  confirmed via page text, it's AWS's own "blocked by firewall/proxy"
  micro-frontend error, not a click-target problem — user needs to finish
  this one manually, exact steps were given to them 2026-07-21), no upload
  size limits, Bahrain region (me-south-1) never finished activating on
  this AWS account — parked, not urgent, Frankfurt works fine.

## Backups (automated, live since 2026-07-21)

Server-side cron, `/usr/local/bin/evora-backup.sh`, runs daily at 03:00 UTC
via `/etc/cron.d/evora-backup`. Each run tars up `data/evora-db.json` +
`public/uploads/`, keeps the last 15 locally at `/var/backups/evora/`, and
also uploads to S3 (`s3://evora-backups-619329232247/`) if the `aws` CLI
and `/etc/evora-backup-bucket` are present — both are, on this server. The
EC2 instance has an IAM role (`evora-backup-role`, `AmazonS3FullAccess` —
broader than strictly needed, flagged as future hardening, not urgent)
attached for the S3 upload to work without stored credentials. Logs to
`/var/log/evora-backup.log`. Verified working end-to-end this session
(local tarball + S3 upload both confirmed).

To restore: pull the tarball down from S3 or `/var/backups/evora/`,
extract, and copy `evora-db.json` back to `/var/www/evora/data/` +
`uploads/` back to `/var/www/evora/public/`, then
`sudo systemctl restart evora.service`.

## How to deploy a change

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # node/npm are NOT on default PATH

# 1. typecheck + build locally FIRST — catch errors before touching the server
cd ~/Desktop/evorafuture && npx tsc --noEmit -p tsconfig.json
npm run build

# 2. sync to server (data/ and public/uploads are EXCLUDED — never overwrite live data)
rsync -az --delete \
  -e "ssh -i ~/.ssh/evora-server-key.pem" \
  --exclude node_modules --exclude .next --exclude .next-prod --exclude .git \
  --exclude backups --exclude .env.local --exclude service-account.json \
  --exclude tsconfig.tsbuildinfo --exclude Icon --exclude data \
  --exclude public/uploads \
  ~/Desktop/evorafuture/ ubuntu@3.69.106.150:/var/www/evora/

# 3. rebuild + restart on the server — use the deploy script, don't hand-run these steps
ssh -i ~/.ssh/evora-server-key.pem ubuntu@3.69.106.150 /usr/local/bin/evora-deploy.sh

# 4. verify
curl -s -o /dev/null -w "%{http_code}\n" https://evorahome.online/
```

Build steps take a while (background them and wait for the notification
rather than blocking). Always exclude `data/` and `public/uploads/` from the
rsync — those are live, server-only, and must never be overwritten by the
local dev copy.

**`/usr/local/bin/evora-deploy.sh` on the server** (added 2026-07-21) runs
`npm run build` then restarts `evora.service` and health-checks it.
Deliberately does **NOT** `rm -rf .next` before building — that used to be
the process, and it meant the live app (still serving real visitors on the
OLD build) could 404 on static chunk requests for the entire build
duration, since Next.js serves some files straight off disk per-request.
`next build` safely regenerates `.next` in place on its own. This shrinks
the live-404 risk window down to just the few seconds of the systemd
restart itself. Always use this script server-side rather than manually
running `rm -rf .next && npm run build` — that old sequence is the thing
this script exists to avoid.

## Architecture map

Three separate root layouts (three route groups, each its own `<html>`):

- `app/(site)/**` — the public marketing site, shop, lookbook (`/catalog`),
  everything a visitor sees. Warm-white theme.
- `app/(portal)/**` — `/dashboard` (client portal) and `/admindashboard`
  (staff admin). Lean chrome, PWA-installable (own manifest each), has the
  service worker (`public/sw.js` — **registers with global scope `/`**, so
  once anyone visits a portal page it starts controlling every page on the
  site for that browser, not just portal pages — relevant to the chunk-
  error-recovery fix below).
- `app/(homestudio)/**` — `/evora3dstudio`, the 2D plan editor + 3D room
  viewer ("Puffer"). Dark bronze/coral theme, Poppins/Space Mono fonts.
  **Gated behind admin login** (added this session) — not linked from
  public nav, requires the same admin account as `/admindashboard`.

Backend: everything goes through one API, `app/api/portal/[...path]/
route.ts`, backed by `lib/portal/serverdb.ts` (business logic) →
`lib/portal/localdb.ts` (the actual JSON-file storage, in-memory cached).
CORS-open (`Access-Control-Allow-Origin: *`) by design, so the EvoraScan iOS
app and the Evora Studio desktop app can call it cross-origin.

**`lib/puffer/*`** (an older, separate 2D-import implementation used by
`/dashboard`'s "Scan room" flow and `components/portal/{ProjectManage,
LiveScanner}.tsx`) is NOT the same code as **`lib/homestudio/*`** (which
powers `/evora3dstudio`). They don't share code — confirmed via full grep,
zero cross-imports. Don't assume a fix in one applies to the other.

## The three things that connect to this backend

| Client | Connects to | Notes |
|---|---|---|
| Web `/evora3dstudio` | `/api/portal` (same-origin relative path, `lib/homestudio/cloud.ts`) | Gated behind admin login |
| **Evora Studio desktop app** (`~/Desktop/evora-studio-app`, Electron) | `https://evorahome.online/evora3dstudio` (hardcoded, `main.js`) | Just a BrowserWindow pointed at the live URL — no bundled server, no separate build. `.dmg` built (universal, Intel+Apple Silicon) at `release/`. Windows `.exe` blocked on Wine/Homebrew not being installed on the dev Mac — user needs to run the Homebrew installer interactively themselves (needs sudo password), then `brew install --cask wine-stable`, then `npm run dist:win` in that directory. |
| **EvoraScan iOS app** (`~/Desktop/dev/3D & AR/evora-scan`) | `EvoraAPI.swift`'s `baseURL`, defaults to `https://evorahome.online` (fixed this session — was pointing at the stale `evorafuturehome.com`) | Change needs an actual app rebuild/resubmit to reach real devices. Also has a SEPARATE, unrelated `pufferURL` for local-Wi-Fi-only pushing scans directly to a Puffer instance — blank by default, user types a local IP, nothing to do with the main server. |

## Admin / login credentials

**One consolidated admin account** (old ones removed):
- Email: `bakri@evorahome.online`, password: `bakri123`
- This is **baked into server code**, not just the database — see
  `lib/portal/serverdb.ts`'s `bootstrap()` function. It checks for a user
  with that exact email and re-creates it if missing. **If you ever need to
  change the admin password, edit `bootstrap()` in serverdb.ts and redeploy
  — do NOT just hand-edit the database file**, the next bootstrap() call
  (which runs on every sign-in) will silently overwrite a direct DB edit
  back to whatever's hardcoded in the source. This bit us once already.
- Demo client: phone `0790000000`, password `evora123`.

## Known gotchas (learned the hard way this session)

- **Node/npm are not on PATH** by default in a fresh shell — always
  `export PATH="$HOME/.local/node/bin:$PATH"` first.
- **`localdb.ts` caches the whole DB in memory** on first read. Editing
  `data/evora-db.json` directly on the server while the app is running has
  NO effect until you `sudo systemctl restart evora.service` — and even
  then, if any hardcoded seed/bootstrap logic in the source re-derives that
  data, your edit gets silently overwritten again on the next relevant API
  call. Fix data problems at the source-code level when a bootstrap/seed
  function is involved, not by hand-editing JSON.
- **Don't run many parallel image-heavy agents at once** — doing so once
  filled the Mac's entire disk (each agent's transcript holds every image
  it read, in full; ~8-10 parallel agents each reading ~35 multi-MB images
  added up to the whole disk). Keep parallel fan-out to a handful of agents
  when the work involves reading images, or run them in smaller batches.
- **AWS console sessions log out unpredictably** mid-session in this
  environment, and when multiple Chrome profiles are connected, navigating
  can silently land on the wrong (logged-out) one. If AWS pages start
  throwing "Frame with ID 0 is showing error page," check login state
  before assuming the target page/region is broken.
- **me-south-1 (Bahrain)** is an AWS "opt-in" region — enabling it in
  Billing shows "Enabled" almost immediately, but the actual regional
  infrastructure (EC2, VPC, etc.) can take much longer to actually respond.
  Confirmed via direct API timeout, not just console flakiness.
- **The service worker's global scope** (`public/sw.js`, registered with
  no explicit `scope` from `components/portal/OfflineReady.tsx`) means once
  anyone visits a portal page, it controls navigation for the WHOLE site in
  that browser — including pages that never mount the registration
  component. Combined with every rebuild minting new Next.js chunk hashes
  and deleting the old files, this is why a tab left open across a deploy
  can "crash." The `ChunkErrorRecovery` component (mounted in all three
  root layouts) auto-reloads once when it detects this — don't remove it.
- **t3.medium OOM'd on the first Next.js build attempt** (2GB RAM instance
  originally) — resized to t3.medium (4GB) + added a 4GB swap file. Builds
  need real headroom; don't go smaller than this without testing.

## Recent work log (most recent first)

- **Full QA & copy audit pass, 2026-07-23 (in progress).** Verified every
  claim in a client-supplied audit against the real code + live site via a
  26-agent workflow before touching anything. Shipped so far, all deployed
  and verified live:
  1. **Security (P0, not in the audit):** `GET /api/portal/{clients,leads,
     projects}` served every customer's name/phone/email/floor-plan URL to
     anyone on the internet (CORS-open, zero auth). Added HMAC httpOnly
     session tokens (`lib/portal/session.ts`), gated the PII reads +
     `POST /clients` to admins, gated `?uid=` to the owning client. Left
     `POST /leads` (public contact form) and `POST /upload` + `POST /projects`
     (the shipped EvoraScan iOS app — verified POST-only in EvoraAPI.swift)
     open; upload now bounded to 25MB + a MIME allowlist.
  2. **Counters:** `CountUp` SSR'd `0` — the live site shipped "0+ homes",
     "0.0★", "up to 0 months" to crawlers and to anyone whose
     IntersectionObserver never fired. Now SSRs the real figure
     (`components/motion.tsx`).
  3. **Share previews:** `metadataBase` pointed at `evorafuturehome.com` — a
     DEAD host (503) — so every WhatsApp/IG share had no image. Now
     `evorahome.online`; verified og/twitter images 200.
  4. **Scroll-frame crash (the "breaks on some phones" report):** root cause
     was NOT what the audit guessed (it prescribed canvas/rAF/clamp, all of
     which the code already had). It was unbounded decoded-image memory: the
     hero+configurator retained a live HTMLImageElement per frame and
     force-decoded every one — **~1,033 MB on a phone**, past iOS Safari's
     ~200-400MB tab ceiling. Replaced the frame-stack scrubber with `<video>`
     currentTime scrubbing (`lib/videoScrub.ts`, technique from
     oso95/scroll-world, MIT). Clips encoded from the SAME frames (no visuals
     regenerated) into `public/evora/scrub/*.mp4`, blob-loaded (all seeks
     instant — streaming froze mid-scrub), configurator lazy-loaded on
     approach. Also fixed 3 hydration mismatches found along the way (Loader,
     StartAndTrack, ConfiguratorScroll height branch) that fired on every
     Battery-Saver laptop. **Note:** could not test on a physical iPhone from
     this environment (browser tool is desktop-pinned) — the crash is fixed
     *structurally* (no decoded-image stacks exist anymore), verified via
     Playwright at desktop+mobile viewports and throttled connections.

  5. **Scroll films — FINAL design, do not re-litigate.** The clips are
     downloaded WHOLE and the branded Loader HOLDS until both are ready, showing
     real byte progress. Streaming was tried twice: smooth on a fast line, but
     it leaves a visibly frozen hero on a slow phone, which reads as broken.
     The user's explicit decision was "I don't care if it takes 10 minutes —
     make the loader stay until everything loads." Two things had been lifting
     the curtain early and were the real bug: `prefers-reduced-motion` lifted it
     after ~900ms with NO asset gating (and **iOS Low Power Mode / Chrome
     Battery Saver FORCE that media query**, so power-saving phones got the page
     instantly over unloaded video), plus an 8s soft cap. Both removed; caps are
     now a 10-minute last resort. Clip sizes: mobile pair 6.0MB, desktop 9.9MB.
  6. **Also shipped:** Arabic now persists across navigation (it reset to English
     on every click — links are plain `<a>`, and the language was never
     persisted); RTL hero scrim mirrored; newsletter form wired for real (it was
     fake-success with an unbound input); per-page metadata + canonicals;
     FurnitureStore JSON-LD; robots.txt + sitemap.xml (neither existed);
     noindex on /v2 /v3 /clientexample /configurator; bilingual alt text; the
     hero scroll indicator moved to bottom-centre (it crossed the meta line).

- **CORRECTION to the entry below:** the claim that `/catalog` was "ripped out
  and rebuilt as a plain PDF embed" and that the flipbook components + nav
  entry were deleted is **FALSE** — verified 2026-07-23 against both the repo
  and the live site. `app/(site)/catalog/page.tsx` still mounts
  `LookbookApp`, `components/lookbook/*` all still exist, and the `/catalog`
  Nav entry + `nav_catalog` i18n key are both present. The custom flipbook is
  still shipping. If "/catalog crashes on iPhone" comes up, it is the
  windowed-but-still-heavy flipbook, NOT a PDF. (Whatever session wrote the
  entry below either never made the change or it was reverted.)

- **`/catalog` (the ARGOS lookbook) ripped out and rebuilt as a plain PDF
  embed, 2026-07-22:** after the windowing fix (below) still didn't stop it
  crashing on the user's actual iPhone, the user cut the losses and asked to
  delete the whole custom flipbook and just serve the real book instead.
  Deleted entirely: `app/(site)/catalog/page.tsx`, all of
  `components/lookbook/*` (LookbookApp/BookMode/TourMode/ZoomMode/data.ts),
  `public/evora/lookbook{,-thumbs}`, the `/catalog` Nav entry + `nav_catalog`
  i18n key. Rebuilt `/catalog` from scratch as a single simple page: the
  original source PDF (`~/Downloads/ابو نواف.pdf`, "ARGOS · Interior Design by
  Evora", 31 pages, confirmed via PDF page-count) copied to
  `public/evora/catalog.pdf`, embedded via a plain `<iframe src="/evora/
  catalog.pdf">` + a download link. No custom pagination/zoom JS at all now —
  the browser's own native PDF renderer handles paging, so there's no
  DOM-image-accumulation class of bug possible anymore. **If "/catalog
  crashes" ever comes up again, it is almost certainly NOT the old bug
  class** — check the PDF itself (corrupt file, wrong path) before assuming a
  memory/windowing issue.
  - Known cost: the PDF is 10.5MB and took ~40s to fully download from this
    Mac's connection (263KB/s) — fine for a book people commit to reading,
    but worth an eye on if "slow to open" complaints come up; a compressed
    version of the PDF would be the first thing to try.
  - Deployed the same targeted way: scp'd just the new page, `Nav.tsx`,
    `lib/i18n.tsx`, and the PDF asset onto the server (not the whole local
    tree — same reasoning as every other deploy this session), then ran the
    detached `evora-deploy.sh` pattern below.
- **Furniture catalog still crashing iPhone Safari after the AVIF conversion,
  fixed 2026-07-22:** converting the 263 thumbnails to AVIF (see below) wasn't
  the whole story — the user confirmed MacBook Chrome was fine but iPhone kept
  crashing. Root cause: `CatalogBrowser.tsx`'s grid rendered **all** matching
  items' `<img>` tags unconditionally (no windowing/virtualization) — with
  category "All" that's ~185 simultaneously-mounted images, decoding on top of
  the Studio's already-live WebGL canvas (GLBs/textures) underneath the modal.
  `loading="lazy"` didn't help because it only defers the *initial* fetch, it
  doesn't unmount already-decoded images once scrolled away — so scrolling the
  whole grid once still accumulates all ~185 decoded bitmaps in memory. Mobile
  Safari's per-tab memory ceiling is far tighter than desktop Chrome's, which
  is exactly why the Mac looked fine. **This is the same bug class already
  found and fixed in `BookMode.tsx`** (the `/catalog` flipbook) — just a
  different component this time. Fix: added a `WindowedThumb` component using
  a real `IntersectionObserver` (not `loading="lazy"`) that mounts the `<img>`
  only while the card is within ~600px of the modal's own scroll viewport, and
  **unmounts it again** once it scrolls back out — so total decoded images in
  memory stays bounded to roughly what's visible, not the full catalog.
  Deployed the same targeted way (scp just `CatalogBrowser.tsx`, then the
  detached `evora-deploy.sh` pattern below). **If a similar "fine on Mac,
  crashes on iPhone" report comes up anywhere else in this app, check for this
  same pattern first** — a long list/grid of images with no windowing, sitting
  on top of (or near) the 3D Studio's WebGL canvas.
- **Uploads 404'd until app restart, fixed 2026-07-21 (no downtime, no app
  redeploy needed):** the user's two newest LiDAR-scan thumbnails weren't
  showing in Evora Home Studio's Cloud panel. Root cause: Next.js 16's
  `next start` snapshots which `public/` files it will serve at process
  start — any file the running app writes to `public/uploads` at runtime
  (i.e. every scan/plan/USDZ a client or the EvoraScan iOS app uploads) 404s
  until the next restart. Confirmed by SSH: file existed on disk, `curl
  localhost:3000/uploads/<hash>.png` 404'd, then 200 immediately after
  `sudo systemctl restart evora.service` — proving it's a serving quirk, not
  a failed/missing upload. **Fix:** edited `/etc/caddy/Caddyfile` so Caddy
  serves `/uploads/*` directly off disk (`handle_path` + `file_server`),
  ahead of the `reverse_proxy localhost:3000` fallback — bypasses Next's
  stale snapshot entirely, verified live by writing a brand-new file
  straight to disk and fetching it over HTTPS immediately, no restart.
  Old Caddyfile backed up on the server at
  `/etc/caddy/Caddyfile.bak-20260721173230`. **If any future upload/thumbnail
  ever 404s again, check this Caddyfile block is still in place before
  re-diagnosing from scratch** — don't assume it's the same Next.js quirk
  recurring, since this fix should make it structurally impossible now.
- **Furniture-catalog thumbnails converted PNG→AVIF 2026-07-21** — the user
  reported the phone crashing hard when opening the furniture catalog
  (`CatalogBrowser.tsx`, 263 items across Kenney + Quaternius sets). Ran
  `scripts/to-avif-catalog.mjs` (new script, mirrors the existing
  `to-avif.mjs` pattern) to convert every thumbnail under
  `public/models/catalog/{thumbs,q/thumbs}` to `.avif` and deleted the PNG
  originals (these are generated stand-in thumbnails, not hand-authored
  art, so no `<picture>` fallback kept) — 6.3MB → 587KB, 91% smaller.
  Updated `thumbnailUrl` references in `lib/homestudio/catalogData.ts`
  (one template-literal) and `catalogDataQuaternius.ts` (89 literal
  strings) from `.png` to `.avif`. Deployed by pushing just the 2 changed
  `.ts` files + new `.avif` assets directly (scp) onto the server on top of
  its existing checkout — deliberately did NOT rsync the whole local
  `~/Desktop/evorafuture` working tree, since it had unrelated uncommitted
  WIP sitting in it at the time that shouldn't ship — then ran
  `/usr/local/bin/evora-deploy.sh` server-side. Verified live: new avif
  thumb 200s, old (deleted) png now correctly 404s, site health-check 200.
  **Gotcha hit during this deploy:** running `evora-deploy.sh` as a plain
  foreground/backgrounded SSH command got killed mid-build when the local
  session was interrupted — the remote build died with it. Fix: launch it
  detached server-side (`nohup bash -c "... ; echo DEPLOY_EXIT_$? >
  /tmp/evora-deploy.done" &`, then `disown`), poll for the done-marker file
  from the Mac side instead of holding one long blocking SSH session open.
- Fixed the REAL /catalog crash — the earlier "fixed" flip-math/click-race
  bugs were real but not the whole story. User reported it crashes the
  whole Safari tab on iPhone. Root cause: `BookMode.tsx` mounted all 31
  full-resolution (1500x1500) page images at once, each forced into its
  own GPU-composited layer (`backface-visibility:hidden` + `preserve-3d`
  on every leaf) — `loading="lazy"` never helped because every leaf sits
  at identical `position:absolute;inset:0` coordinates, so the browser's
  distance-from-viewport heuristic sees them as equally in-view. That's
  200MB+ of simultaneous decoded pixels, well past iOS Safari's per-tab
  memory ceiling. Fixed by windowing: only leaves within `±3` of the
  current page actually mount a `<Face>` image now (`BookMode.tsx`,
  `WINDOW`/`inWindow`); far leaves keep their div (for the stacked-book
  look) but render nothing until paged close. Also generated real 240px
  thumbnails (`public/evora/lookbook-thumbs/`, `thumbSrc`/`thumbSrcAvif`
  in `data.ts`) for the filmstrip, which was reusing the full 1500x1500
  source images to display at 50-62px — another real contributor.
  Verified live: direct-jump-to-page-21 and rapid-click-through-all-31
  both render correctly with no blank pages. Cannot verify the actual
  iOS Safari crash is gone without a real device (the browser automation
  tool here is pinned to a desktop Mac Chrome viewport/UA regardless of
  window resize) — ask the user to confirm on their phone next time it
  comes up.
- Tackled the 4 risks from `EVORA_CAPACITY_AND_LIMITS.txt`: added automated
  daily backups (local + S3, see above), fixed the deploy script so a
  rebuild can't 404 live visitors (see above), attempted the EC2
  auto-recovery CloudWatch alarm (blocked on a genuine AWS console
  micro-frontend load failure in the automated browser — user finishing
  it manually), CDN still needs the user to create a Cloudflare account.
- Fixed `/catalog` crash (two real bugs: odd-page-count blank-flash in
  BookMode, stale-closure rapid-click race in Read/Tour modes) — root-
  caused and fixed via a multi-agent workflow investigation, deployed.
- Added global `ChunkErrorRecovery` (see gotchas above) after a second
  "crashed on load" report traced to stale chunks + the global-scope SW.
- Shop rebuilt: 346 real product photos (from a Higgsfield batch),
  AVIF-converted (15MB total), named/categorized/described by parallel
  agents, colorway-swatch UI removed (was fake — didn't change the photo),
  pagination added (grid was rendering unpaginated — 50,271px tall on
  mobile before the fix), Evora monogram watermark added to every product
  image, "Enquire" promoted to a real button in quick-view.
- `/evora3dstudio` gated behind admin login, unlinked from public nav,
  orphaned `(puffer)` route-group scaffolding deleted. Evora Studio
  desktop app (Electron) built and working, `.dmg` ready.
- `ProjectViewer.tsx` (client portal's saved-project viewer) redesigned
  from tab-switching to a permanent 2D-left-sidebar / 3D-right layout.
- CloudPanel (the studio's save/load-to-server panel) no longer has its
  own separate login — reuses the page-level admin session. Added
  client-assignment: saving a room now lets staff pick which client it
  belongs to, and every scan/saved-room row has an "Assign" control to
  (re)point ownership at a client.
- Consolidated admin credentials to `bakri@evorahome.online` / `bakri123`
  (fixed at the bootstrap() source, see above).
- Fixed EvoraScan iOS app's stale default backend URL.

## Not done yet / good next steps

1. Automated backups of `data/evora-db.json` + `public/uploads` (biggest
   real risk right now — no traffic-count problem, a pure data-loss risk).
2. Cloudflare in front of the domain (free, needs the user to create the
   account + switch nameservers at Namecheap — biggest speed/scaling win).
3. Upload size limits on the portal API (currently unlimited — a stray
   huge upload could exhaust disk/memory).
4. EC2 auto-recovery CloudWatch alarm (attempted, blocked on AWS console
   UI flakiness during setup — worth a clean retry).
5. Windows `.exe` build for Evora Studio (blocked on Homebrew/Wine — user
   needs to run the Homebrew installer interactively for the sudo prompt).
