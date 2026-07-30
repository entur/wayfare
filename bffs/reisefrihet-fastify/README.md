# Wayfare reisefrihet BFF

Fastify backend-for-frontend for the Wayfare React Native prototype. It keeps
client credentials outside the Expo bundle and exposes only the rider
operations used by the app.

## Local setup

```sh
cp .env.example .env
pnpm install
pnpm dev
```

The service listens on `http://localhost:3001` by default. `/health` reports
process health. `/ready` also checks that downstream credentials are present.
The development entry point loads `.env` when the file exists.

## Run against staging

Authenticate with gcloud, then start the local BFF:

```sh
gcloud auth login
pnpm dev:staging
```

The launcher reads `KOLUMBUS_PARTNER_CLIENT_ID` and
`KOLUMBUS_PARTNER_CLIENT_SECRET` from the `ent-reisfri-tst` GCP project. It
checks access to `https://api.staging.entur.io/reisefrihet`, selects the active
adult Kolumbus profile for simulated checkout, and starts the BFF on port 3001.
It does not write either credential to disk or print them.

Set the Android emulator's BFF URL override to `http://10.0.2.2:3001`. The
staging customer numbers are listed in the reisefrihet repository at
`scripts/TEST-CUSTOMERS-TST.md`.

Downstream types are generated from the staging Springdoc document at
`https://api.staging.entur.io/reisefrihet/v3/api-docs`. Set
`REISEFRIHET_SPEC_URL` to use another environment. After a contract change,
run:

```sh
pnpm contract:generate
pnpm openapi:generate
pnpm check
```

Commit the generated TypeScript types. `contract/mobile.openapi.json` is
generated from the Fastify TypeBox schemas for the mobile app. Do not add
client credentials to any `EXPO_PUBLIC_` setting.

## Checkout simulator

The local checkout simulator creates one deterministic bus leg and sends it to
reisefrihet's real `/journey/stop` route. Its fare, distance, zones, main user
profile, and confidence are configured through the `SIMULATOR_*` variables.
Fares use NOK, as required by the Reisefrihet contract. Startup fails if the
simulator is enabled with `NODE_ENV=production`.
