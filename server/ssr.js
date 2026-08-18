// Entry point for Vercel's Node.js serverless runtime (@vercel/node).
// Replaces the abandoned @nuxtjs/vercel-builder launcher, which is
// incompatible with modern Node.js versions (>=22). This boots the
// already-built Nuxt 2 SSR app directly using Nuxt's own programmatic API.
const { loadNuxt } = require('nuxt');

let nuxtPromise;

function getNuxt() {
  if (!nuxtPromise) {
    nuxtPromise = loadNuxt('start');
  }
  return nuxtPromise;
}

module.exports = async (req, res) => {
  const nuxt = await getNuxt();
  nuxt.server.app(req, res);
};
