# VLB3 Customer Portal - STEP 3

Customer-facing portal for the VLB3 platform.

STEP 3 adds the first complete customer dashboard while keeping the backend optional in demo mode.

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
- dashboard data layer
- dashboard loading, error and empty states
- dynamic KPI cards
- dynamic customer site cards
- responsive dashboard for desktop, tablet and mobile
- demo sites and devices modeled independently from React components

## Backend requirement for STEP 3

No backend is required while:

```env
VITE_DEMO_MODE=true
```

The dashboard page calls `src/api/dashboard.ts`.

In demo mode it reads from:

```text
src/demo/dashboard.ts
src/demo/sites.ts
```

When the real backend is connected, the same page is already prepared to call:

```text
GET /api/customer/dashboard
```

with `VITE_DEMO_MODE=false`.

The route can be adjusted later to match the final NestJS API contract without changing the dashboard components.

## Demo dashboard data

Organization:

```text
Azienda Agricola Demo
```

Sites:

```text
Pozzo Nord
- ONLINE
- pump RUNNING
- 40.00 Hz
- no active alarms

Campo Sud
- ONLINE
- pump STOPPED
- 0.00 Hz
- no active alarms

Serra 2
- OFFLINE
- last contact about 12 minutes ago
- pump status unavailable
- no active alarms
```

The KPI values are calculated from the site data instead of being hardcoded in the page:

```text
Impianti: 3
Online: 2
Pompe attive: 1
Allarmi: 0
```

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

All demo accounts use this password:

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

Expected permissions:

- Owner: read + pump commands + users
- Admin: read + pump commands + users
- Operator: read + pump commands, no users
- Viewer: read only, no users and no commands

## STEP 3 checks

1. Login with `owner@demo.vlb3.local` / `Demo123!`.
2. Dashboard must show 3 sites, 2 online, 1 active pump and 0 alarms.
3. Pozzo Nord must be ONLINE, IN FUNZIONE, 40.00 Hz.
4. Campo Sud must be ONLINE, FERMA, 0.00 Hz.
5. Serra 2 must be OFFLINE and show the last connection around 12 minutes ago.
6. Press `Aggiorna`: data must refresh without replacing the whole page with the initial skeleton.
7. Press `Vedi tutti`: it must open `/sites`.
8. Press `Apri impianto`: it must open `/sites/:siteId`.
9. Test around 390 px width: site cards must become single-column and remain touch friendly.
10. Refresh the browser while authenticated: the demo session must remain active.

## Architecture introduced in STEP 3

```text
DashboardPage
     |
     v
useDashboard
     |
     v
api/dashboard.ts
     |
     +---- VITE_DEMO_MODE=true ----> demo/dashboard.ts
     |                                  |
     |                                  v
     |                              demo/sites.ts
     |
     +---- VITE_DEMO_MODE=false ---> NestJS API
                                        |
                                        v
                              GET /customer/dashboard
```

This keeps fake data outside React pages and lets the real backend replace the demo source later without rewriting the UI.

## Security note

The localStorage entry used in demo mode contains only a fake demo user and is never intended for production credentials or tokens.

When `VITE_DEMO_MODE=false`, authentication secrets are not persisted by the portal in localStorage. Multi-tenancy and command permissions will be enforced again by the backend when the real API is connected.
