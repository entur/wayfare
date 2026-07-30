# React Native and reisefrihet local development

The rider prototype has three parts: reisefrihet, the Fastify BFF in
`bffs/reisefrihet-fastify`, and the Expo app in `clients/react-native`.
reisefrihet remains authoritative for rider profiles, journey state, history,
and failed payments. The BFF holds OAuth credentials and converts Kotlin
objects into a small mobile contract.

## Fastest setup: local BFF with staging reisefrihet

This setup does not require a local reisefrihet process. Authenticate with
gcloud, then run:

```sh
cd bffs/reisefrihet-fastify
pnpm install
gcloud auth login
pnpm dev:staging
```

The launcher gets the Kolumbus partner credentials from the `ent-reisfri-tst`
GCP project and sends downstream requests to
`https://api.staging.entur.io/reisefrihet`. The credentials stay in the BFF
process and are never passed to Expo.

In the Android emulator, use `http://10.0.2.2:3001` as the BFF URL. Use a test
customer listed in the reisefrihet repository at
`scripts/TEST-CUSTOMERS-TST.md`. These accounts are shared staging data, so a
check-in or checkout changes their staging journey state.

## 1. Start reisefrihet

Skip this section when using the staging setup above. For fully local
development, start the service using its own repository instructions. Its
Springdoc contract must be available at `/v3/api-docs`. The BFF defaults to
`http://localhost:8080`, which can be changed with `REISEFRIHET_BASE_URL`.

## 2. Start the BFF

```sh
cd bffs/reisefrihet-fastify
cp .env.example .env
pnpm install
pnpm dev
```

Add working `CLIENT_ID` and `CLIENT_SECRET` values to `.env`. Check
`http://localhost:3001/health` and `http://localhost:3001/ready`.
Authorization values are redacted from structured logs.

The checkout simulator is enabled for local development. It creates a
deterministic one-leg bus completion, then calls reisefrihet's real
`/journey/stop` endpoint. Configure fare, distance, zones, main user profile,
and confidence with the `SIMULATOR_*` values. Production startup fails while
the simulator is enabled.

## 3. Start Expo

```sh
cd clients/react-native
cp .env.example .env
pnpm install
pnpm api:generate
pnpm start
```

Use a development build, not Expo Go. Run `pnpm ios` or `pnpm android` to
generate the native project and launch it. In the app's Settings tab, enter a
test customer number.

The BFF URL depends on the target:

- iOS Simulator: `http://localhost:3001`
- Android Emulator: `http://10.0.2.2:3001`
- Physical device: `http://<development-machine-LAN-address>:3001`

For a physical device, keep it on the same network as the development machine,
allow inbound traffic to port 3001, and keep the BFF host set to `0.0.0.0`.

## Contract changes

The BFF generates downstream types from
`https://api.staging.entur.io/reisefrihet/v3/api-docs`. Set
`REISEFRIHET_SPEC_URL` to use another environment. Regenerate and review the
types after a Reisefrihet contract change:

```sh
cd bffs/reisefrihet-fastify
pnpm contract:generate
pnpm openapi:generate
pnpm check
cd ../../clients/react-native
pnpm api:generate
pnpm check
```

Generated files must remain unchanged when these commands run in CI.

## Manual acceptance

On both iOS and Android, verify first-run setup, rider options, check-in,
process restart recovery, checkout confirmation, the simulated receipt,
history and details, failed-payment retry, light and dark themes, and offline
errors. Test large text, screen-reader labels, keyboard avoidance, safe areas,
and reduced-motion settings. Interactive controls have a minimum 44-point
target and mutations never retry automatically.

Never put `CLIENT_SECRET`, `CLIENT_ID`, or a bearer token in Expo source,
environment files, generated output, screenshots, or logs.
