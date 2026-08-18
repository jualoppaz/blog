// Vercel Node.js server entrypoint (official pattern: a `server.js` at the
// project root that calls `.listen()`). Vercel detects this file
// automatically, builds it and its dependencies, and routes all requests to
// it as a single Vercel Function — no custom Build Output API scripting or
// manual dependency tracing needed.
// https://vercel.com/docs/functions/runtimes/node-js#deploy-a-node.js-server
const { loadNuxt } = require('nuxt');

async function start() {
  const nuxt = await loadNuxt('start');
  // Nuxt reads process.env.PORT internally to configure server.port
  // (see @nuxt/config defaults), so listen() takes no arguments here.
  await nuxt.server.listen();
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
