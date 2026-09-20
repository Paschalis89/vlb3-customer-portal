# VLB3 Customer Portal - STEP 2

Customer-facing portal for the VLB3 platform.

This step contains:

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

## Backend requirement for STEP 2

No backend is required while `VITE_DEMO_MODE=true`.

The authentication layer is already split between demo and real API implementations. When the real NestJS backend is connected later, set `VITE_DEMO_MODE=false` and implement the matching backend endpoints:

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

The real implementation is prepared to use `credentials: include`, so the future backend can keep the persistent refresh session in a Secure HttpOnly cookie.

## Start

```bash
cp .env.example .env
docker compose build --no-cache
docker compose up -d
docker compose ps
```

Open:

```text
http://localhost:8080
```

The protected root route redirects to `/login` when there is no session.

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

For STEP 2, command buttons are not implemented yet. Their permissions are already modeled and will be consumed by the device controls in STEP 5.

## STEP 2 checks

1. Open `/` while logged out: it must redirect to `/login`.
2. Login as Owner: it must open the Dashboard.
3. Refresh the browser: the demo session must remain active.
4. Open `/users` as Owner/Admin: it must work.
5. Login as Operator/Viewer: the Users link must disappear.
6. Type `/users` manually as Operator/Viewer: it must redirect to `/`.
7. Open Profile and press Logout: it must return to `/login`.
8. Refresh after logout: protected pages must still require login.

## Security note

The localStorage entry used in STEP 2 contains only a fake demo user and is never intended for production credentials or tokens.

When `VITE_DEMO_MODE=false`, the portal does not persist authentication secrets in localStorage. The future real backend session will use server-side validation and an HttpOnly refresh cookie.
