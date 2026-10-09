import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Set the preset before Nuxt modules choose their runtime integrations.
const result = spawnSync(
  process.execPath,
  [fileURLToPath(new URL("../node_modules/nuxt/bin/nuxt.mjs", import.meta.url)), "build"],
  {
    env: { ...process.env, NITRO_PRESET: "cloudflare_pages" },
    stdio: "inherit",
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
