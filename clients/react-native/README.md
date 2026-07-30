# Wayfare React Native

English-language rider prototype for reisefrihet, built with Expo SDK 57 and
Expo Router. The TanStack Start client is the visual reference.

## Start locally

```sh
cp .env.example .env
pnpm install
pnpm api:generate
pnpm start
```

Use `pnpm ios` or `pnpm android` to create and run a development build. The app
needs the Fastify BFF. Set the test customer number and, if needed, a BFF URL
override on the Settings tab.

For an Android Emulator, use `http://10.0.2.2:3001`. The iOS Simulator can use
`http://localhost:3001`. A physical device must use the development machine's
LAN address, and both devices must be on the same network.

## Checks

```sh
pnpm api:generate
pnpm run doctor
pnpm check
```

The generated `src/api/schema.ts` file comes from the BFF OpenAPI document.
Only `EXPO_PUBLIC_BFF_BASE_URL` belongs in the Expo environment. Client IDs,
client secrets, and bearer tokens belong in the BFF and must never be added to
this project.
