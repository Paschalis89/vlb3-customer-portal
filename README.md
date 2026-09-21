# VLB3 Customer Portal - STEP 7

Customer-facing portal for the VLB3 platform.

STEP 7 adds the customer-facing Alerts area while preserving telemetry and remote-control flows from the previous steps. The portal now separates active alarms from resolved history, provides customer-friendly severity filters and never exposes Modbus codes or internal diagnostics to the customer.

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
- telemetry history data layer
- frequency chart with 1h / 24h / 7d / 30d filters
- pump RUNNING / STOPPED history chart
- telemetry summary metrics
- offline telemetry gaps are shown as missing data rather than fabricated realtime values
- Recharts-based responsive charts
- customer Alerts page
- active alarms and resolved history
- Critical / Warning / Resolved filters
- customer-friendly alert messages
- alert detail dialog with recommended action and resolution
- technical alert codes translated before reaching the customer UI
- loading, refresh, error, empty and offline states

## Backend requirement for STEP 7

No backend is required while:

```env
VITE_DEMO_MODE=true
```

The portal keeps the API abstraction used in the previous steps and adds:

```text
src/api/alerts.ts
```

In demo mode alert data comes from:

```text
src/demo/alerts.ts
```

The real-mode contract is already isolated behind:

```text
GET /api/customer/alerts
```

Device control and telemetry continue to use their existing API layers unchanged.

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

Customer commands supported by the current UI:

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


## STEP 6 telemetry architecture

The device page loads telemetry through:

```text
src/api/telemetry.ts
       |
       +-- demo mode -> src/demo/telemetry.ts
       |
       +-- real mode -> GET /api/customer/devices/:deviceId/telemetry?range=24h
```

Supported ranges:

```text
1h
24h
7d
30d
```

The demo series is deterministic and derived from the current demo device state. The final sample for an online device reflects the current state after a successful START, STOP or SET FREQUENCY command.

For an offline device the series stops at the last known contact and newer samples are represented as missing. The portal never fills a connectivity gap with fake realtime values.

## Charts

STEP 6 uses Recharts for responsive React charts.

The device page now contains:

```text
ANDAMENTO

[Ultima ora] [24 ore] [7 giorni] [30 giorni]

- Frequenza (Hz nel tempo)
- Stato pompa (RUN / STOP nel tempo)
```

Customer-facing telemetry remains intentionally limited to verified values:

```text
visible now:
- frequency
- setpoint
- pump state
- fault state
- connectivity / last seen

hidden until VLB3 scale verification:
- motor voltage
- current
- inverter temperature
- DC Bus
- torque
- power
```

## STEP 6 test

Build and start:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
docker compose ps
```

Then open:

```text
/devices/device-pozzonord-main
```

Verify that all four telemetry ranges load and that frequency ends close to the current 40 Hz state.

Then open:

```text
/devices/device-serra2-main
```

The device must still be clearly OFFLINE and the graph must contain a visible data gap after the last contact instead of extending old telemetry to the present.


## STEP 7 alerts architecture

The Alerts page loads data through:

```text
src/pages/AlertsPage.tsx
        |
        v
src/hooks/useAlerts.ts
        |
        v
src/api/alerts.ts
        |
   +----+----+
   |         |
   v         v
 demo       real
   |         |
   v         v
src/demo/   GET /api/customer/alerts
alerts.ts
```

The demo currently keeps the original presentation scenario with:

```text
0 active alarms
4 resolved historical alarms
```

This preserves the initial demo dashboard requirement while making the complete Alerts UI testable.

Internal demo events are created from technical codes such as:

```text
MODBUS_CONNECTION_ERROR
COMMUNICATION_SIGNAL_WEAK
DEVICE_OFFLINE
VLB3_FAULT
```

The customer UI never displays those codes. They are converted into messages such as:

```text
Comunicazione non disponibile
Collegamento instabile
Impianto temporaneamente offline
Pompa in allarme
```

In production this translation should preferably be performed or validated by the backend so the Customer Portal receives an already sanitized customer DTO.

## STEP 7 test

Build and start:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
docker compose ps
```

Open:

```text
/alerts
```

Expected initial state:

```text
Critici attivi: 0
Warning attivi: 0
Risolti: 4
```

The `Attivi` tab must show the all-clear empty state.

Open `Storico` and verify:

```text
Tutti    -> 4 events
Critici  -> 2 events
Warning  -> 2 events
Risolti  -> 4 events
```

Open an alert detail and verify that the modal shows only customer-facing information:

```text
severity
site / device
message
date and time
recommended action
resolution
```

No Modbus register, raw error, serial-port detail, token or internal diagnostic information should appear.
