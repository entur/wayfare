import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { buildApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";

const target = resolve("contract/mobile.openapi.json");
const app = await buildApp({
  config: loadConfig({
    NODE_ENV: "test",
    CLIENT_ID: "contract",
    CLIENT_SECRET: "contract",
    CHECKOUT_SIMULATOR_ENABLED: "true",
  }),
});
await mkdir(dirname(target), { recursive: true });
await writeFile(target, `${JSON.stringify(app.swagger(), null, 2)}\n`);
await app.close();
