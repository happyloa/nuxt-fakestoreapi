// Run the Node build in production mode. Externalized packages such as
// vue-router and @intlify/* check NODE_ENV at runtime and otherwise keep
// development diagnostics enabled.
process.env.NODE_ENV ||= "production";

await import("../.output/server/index.mjs");
