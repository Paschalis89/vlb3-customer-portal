# VLB3 Customer Portal - STEP 5

Customer-facing portal for the VLB3 platform.

STEP 5 implements the main operational device page: remote START/STOP, frequency control from 30 to 50 Hz, confirmation dialogs, role-aware controls and a command lifecycle that waits for the simulated plant acknowledgement before changing the displayed state.

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
- Sites list with search and filters
- Site detail page
- device cards inside each site
- Device detail page
- device Online / Offline state
- pump Running / Stopped / Fault / Unknown state
- remote START with confirmation
- remote STOP with confirmation
- frequency control from 30.00 to 50.00 Hz
- slider + numeric frequency input + increment/decrement buttons
- role-aware remote controls
- offline command blocking
- START blocking during a fault
- frequency blocking during a fault
- command lifecycle: QUEUED / DELIVERED / SUCCEEDED / FAILED / EXPIRED
- UI updates only after command success / acknowledgement
- verified customer-facing telemetry only
- loading, refresh, error and offline states

## Backend requirement for STEP 5

No backend is required while:

```env
VITE_DEMO_MODE=true
```

The device page uses:

```text
src/api/devices.ts
src/api/commands.ts
```

In demo mode these APIs read from:

```text
src/demo/devices.ts
src/demo/deviceStore.ts
src/demo/commands.ts
```

The same React page is already prepared for real endpoints such as:

```text
GET  /api/customer/devices/:deviceId
POST /api/customer/devices/:deviceId/commands
GET  /api/customer/commands/:commandId
```

The final backend route names can still be adjusted during STEP 12 without redesigning the UI.

## Important command rule

The portal never declares a command successful only because the server accepted it.

The customer flow is:

```text
START / STOP / SET FREQUENCY
        |
        v
QUEUED
"Invio comando..."
        |
        v
DELIVERED
"Comando ricevuto dall'impianto..."
        |
        v
ACK / execution result
        |
   +----+----+
   |         |
   v         v
SUCCEEDED   FAILED / EXPIRED
```

Only after `SUCCEEDED` is the local device state refreshed.

In demo mode the lifecycle is simulated with short delays, but the UI and API abstraction are the same ones intended for the real backend.

## Remote command rules

Customer commands supported by the STEP 5 UI:

```text
VLB3_START
VLB3_STOP
VLB3_SET_FREQUENCY
```

Frequency range:

```text
minimum: 30.00 Hz
maximum: 50.00 Hz
```

The demo API validates the range again even if the frontend control already prevents normal out-of-range values.

## Roles

`CUSTOMER_OWNER`, `CUSTOMER_ADMIN` and `CUSTOMER_OPERATOR` can use the remote controls.

`CUSTOMER_VIEWER` can open the device and monitor its state, but all remote controls are disabled and the page shows a read-only notice.

The real NestJS backend must later re-check the same permissions server-side. Frontend visibility is not a security boundary.

## Offline handling

For an offline device:

```text
START             disabled
STOP              disabled
SET FREQUENCY     disabled
```

The customer sees a clear message explaining that remote controls will return when the plant reconnects.

## Fault handling

When `hasFault=true`:

```text
START             disabled
SET FREQUENCY     disabled
STOP              still available when meaningful
```

The customer sees a customer-friendly fault message rather than raw VLB3/Modbus data.

## Demo devices

### Pozzo Nord

```text
/device: device-pozzonord-main
ONLINE
RUNNING
frequency 40.00 Hz
setpoint 40.00 Hz
no fault
```

### Campo Sud

```text
/device: device-camposud-main
ONLINE
STOPPED
frequency 0.00 Hz
setpoint 40.00 Hz
no fault
```

### Serra 2

```text
/device: device-serra2-main
OFFLINE
pump state unavailable
last contact about 12 minutes ago
no fault
```

## Device routes

```text
/devices/device-pozzonord-main
/devices/device-camposud-main
/devices/device-serra2-main
```

## START test

Open:

```text
/devices/device-camposud-main
```

Expected initial state:

```text
FERMA
0.00 Hz
setpoint 40.00 Hz
```

Press START.

Expected flow:

```text
confirmation dialog
QUEUED
DELIVERED
SUCCEEDED
```

Only after `SUCCEEDED` should the page refresh to:

```text
IN FUNZIONE
40.00 Hz
```

## STOP test

Open:

```text
/devices/device-pozzonord-main
```

Press STOP and confirm.

Only after `SUCCEEDED` should the state become:

```text
FERMA
0.00 Hz
```

The setpoint remains unchanged.

## Frequency test

On an online, fault-free device with a role allowed to control the plant:

1. move the slider;
2. use `-` / `+`;
3. or write the value in the numeric field;
4. press `Imposta frequenza`.

Example:

```text
42.50 Hz
```

Expected lifecycle:

```text
QUEUED -> DELIVERED -> SUCCEEDED
```

If the pump is RUNNING, both the setpoint and current demo frequency become 42.50 Hz after success.

If the pump is STOPPED, the setpoint changes but current frequency remains 0.00 Hz.

## Offline test

Open:

```text
/devices/device-serra2-main
```

Expected:

```text
OFFLINE
START disabled
STOP disabled
frequency controls disabled
```

No remote command should be sendable from the normal UI.

## Viewer test

Login with:

```text
viewer@demo.vlb3.local
Demo123!
```

Open an online device.

Expected:

```text
state visible
telemetry visible
START disabled
STOP disabled
frequency controls disabled
"Modalità sola lettura" visible
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

## Architecture introduced in STEP 5

```text
DeviceDetailPage
      |
      +---------------------------+
      |                           |
      v                           v
useDevice                    useDeviceCommand
      |                           |
      v                           v
api/devices.ts               api/commands.ts
      |                           |
 +----+----+                 +----+----+
 |         |                 |         |
 v         v                 v         v
demo      real              demo      real
 |         |                 |         |
 v         v                 v         v
device    GET               command   POST command
data      /customer/...      store     GET command status
```

The demo device store is shared with Sites and Dashboard data, so a successful command can be reflected when those pages are loaded again.

## Security note for the real backend

When STEP 12 connects NestJS, every command must be validated again server-side:

```text
authenticated user
active user
organization ownership
resource belongs to organization
customer role / permission
allowed customer command type
device online state
fault / safety rules
frequency 30-50 Hz
```

The client must never be trusted to provide the authoritative `organizationId`.
