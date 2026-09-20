# VLB3 Customer Portal - STEP 4

Customer-facing portal for the VLB3 platform.

STEP 4 implements the complete customer Sites area on top of the demo/API abstraction introduced in STEP 3.

## Included so far

- React + TypeScript + Vite
- React Router
- responsive desktop/mobile shell
- Docker multi-stage build
- nginx SPA runtime
- centralized branding
- demo authentication
- protected routes
- persistent demo session
- customer roles and frontend permissions
- permission-protected Users route
- profile + logout
- dynamic dashboard data layer
- dynamic KPI cards
- dashboard loading/error/empty states
- customer sites API layer
- Sites page with search and filters
- filter by Online / Offline
- filter by active / stopped pump
- filter by active alarms
- responsive sites grid
- Site detail page
- site general status
- location, devices, active pumps and active alarms summary
- device cards inside each site
- offline site/device handling
- loading, refresh, error and no-result states

## Backend requirement for STEP 4

No backend is required while:

```env
VITE_DEMO_MODE=true
```

The Sites pages use:

```text
src/api/sites.ts
```

In demo mode the API layer reads from:

```text
src/demo/sites.ts
```

When the real NestJS backend is connected, the same UI is prepared for:

```text
GET /api/customer/sites
GET /api/customer/sites/:siteId
```

The exact backend route can still be adjusted later without rewriting the React pages.

## Demo organization

```text
Azienda Agricola Demo
```

Demo sites:

```text
Pozzo Nord
- ONLINE
- Pompa principale RUNNING
- 40.00 Hz
- no alarms

Campo Sud
- ONLINE
- Pompa principale STOPPED
- 0.00 Hz
- no alarms

Serra 2
- OFFLINE
- last contact about 12 minutes ago
- pump state unavailable
- no alarms
```

## Sites page

Route:

```text
/sites
```

Available controls:

```text
Search
Connectivity: All / Online / Offline
Pump: All / Active / Stopped
Alarms: All / With alarm
Reset filters
Refresh
```

Search checks:

```text
site name
site description
location label
```

The result count updates live.

## Site detail

Route examples:

```text
/sites/site-pozzonord
/sites/site-camposud
/sites/site-serra2
```

The page shows:

```text
site name
description
general Online / Offline status
area
device count
active pump count
active alarm count
last update
devices belonging to the site
```

Each device card shows only customer-friendly information:

```text
Online / Offline
pump state
frequency
setpoint
fault state
last contact when offline
```

The `Apri dispositivo` action already routes to:

```text
/devices/:deviceId
```

START / STOP / frequency controls remain intentionally in STEP 5.

## Start

```bash
cp .env.example .env
docker compose down
docker compose build --no-cache
docker compose up -d
docker compose ps
```

Open:

```text
http://localhost:8080
```

## Demo accounts

All demo accounts use:

```text
Demo123!
```

Accounts:

```text
owner@demo.vlb3.local
admin@demo.vlb3.local
operator@demo.vlb3.local
viewer@demo.vlb3.local
```

## STEP 4 checks

1. Login with `owner@demo.vlb3.local` / `Demo123!`.
2. Open `/sites`.
3. Confirm that 3 sites are visible.
4. Search `Pozzo` and confirm that only Pozzo Nord remains.
5. Set Connectivity to `Offline` and confirm that only Serra 2 remains.
6. Set Pump to `Attiva` and confirm that only Pozzo Nord remains.
7. Set Pump to `Ferma` and confirm that only Campo Sud remains.
8. Set Alarms to `Con allarme`: the demo currently has zero alarms, therefore the empty result state must appear.
9. Press `Azzera` and confirm that all 3 sites return.
10. Open Pozzo Nord and confirm that site status is ONLINE and its device is RUNNING at 40.00 Hz.
11. Open Campo Sud and confirm that its device is STOPPED at 0.00 Hz.
12. Open Serra 2 and confirm that the site is OFFLINE and remote controls are described as unavailable.
13. Press `Apri dispositivo`: `/devices/:deviceId` must open the STEP 5 placeholder.
14. Test the list and detail pages around 390 px viewport width.
15. Refresh directly on `/sites/site-pozzonord`: nginx SPA routing must keep the page working.

## Architecture introduced in STEP 4

```text
SitesPage
   |
   v
useSites
   |
   v
api/sites.ts
   |
   +---- demo mode ----> demo/sites.ts
   |
   +---- real mode ----> GET /customer/sites

SiteDetailPage
   |
   v
useSite(siteId)
   |
   v
api/sites.ts
   |
   +---- demo mode ----> demo/sites.ts
   |
   +---- real mode ----> GET /customer/sites/:siteId
```

Fake data remains outside React components, so STEP 12 can replace the demo data with NestJS responses without redesigning the pages.

## Security note

Frontend route filtering and UI visibility are convenience features only.

When the real backend is connected, every `siteId`, `deviceId`, telemetry request and command must be restricted server-side using the authenticated user's `organizationId`.
