#!/usr/bin/env node
/**
 * Custom Vercel build script.
 *
 * Replaces the abandoned @nuxtjs/vercel-builder (broken under Node >=22)
 * with Vercel's native Build Output API v3, produced entirely by this
 * script. No third-party builder is involved: we build Nuxt normally,
 * trace the real runtime dependencies of server/ssr.js with @vercel/nft
 * (the same tracing engine Vercel's own official builders use), and
 * assemble .vercel/output ourselves.
 */
/* eslint-disable no-console */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { nodeFileTrace } = require('@vercel/nft');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, '.vercel/output');
const FUNC_DIR = path.join(OUTPUT_DIR, 'functions/index.func');

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      copyFile(s, d);
    }
  });
}

async function main() {
  // 1. Clean previous output.
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });

  // 2. Build the Nuxt app (generates .nuxt/dist with the SSR server bundle).
  run('npm run build');

  // 3. Trace the real dependency graph of the serverless entrypoint.
  const entry = path.join(ROOT, 'server/ssr.js');
  const { fileList } = await nodeFileTrace([entry], { base: ROOT });

  // 4. Copy traced files (node_modules, server/ssr.js itself, etc.) into the
  // function dir. Exclude .env: env vars are injected by Vercel itself,
  // never bundle local secrets into the deployed function.
  fs.mkdirSync(FUNC_DIR, { recursive: true });
  fileList.forEach((relFile) => {
    if (relFile === '.env' || relFile.endsWith('/.env')) return;
    const src = path.join(ROOT, relFile);
    const dest = path.join(FUNC_DIR, relFile);
    if (fs.statSync(src).isFile()) {
      copyFile(src, dest);
    }
  });

  // 5. Copy additional files/dirs the Nuxt config loads dynamically at
  // runtime (not via static require, so @vercel/nft can't see them).
  // Note: .env is intentionally excluded — env vars are injected by Vercel
  // itself, never bundle local secrets into the deployed function.
  const extraPaths = ['nuxt.config.js', '.nuxt', 'locales', 'content', 'api'];
  extraPaths.forEach((rel) => {
    const src = path.join(ROOT, rel);
    const dest = path.join(FUNC_DIR, rel);
    if (!fs.existsSync(src)) return;
    if (fs.statSync(src).isDirectory()) {
      copyDir(src, dest);
    } else {
      copyFile(src, dest);
    }
  });

  // 6. Write the function config (Build Output API v3).
  const vcConfig = {
    runtime: 'nodejs22.x',
    handler: 'server/ssr.js',
    launcherType: 'Nodejs',
    shouldAddHelpers: true,
  };
  fs.writeFileSync(
    path.join(FUNC_DIR, '.vc-config.json'),
    JSON.stringify(vcConfig, null, 2),
  );

  // 7. Copy static assets served directly (favicon, robots.txt, images, etc.)
  // Nuxt itself serves these at runtime from the `static/` dir, but copying
  // them into Vercel's static output means they're served by the CDN
  // directly, without invoking the serverless function.
  const staticSrc = path.join(ROOT, 'static');
  const staticDest = path.join(OUTPUT_DIR, 'static');
  if (fs.existsSync(staticSrc)) {
    copyDir(staticSrc, staticDest);
  }

  // 8. Write top-level Build Output config: every request not matched by a
  // static file falls through to our serverless function.
  const config = {
    version: 3,
    routes: [
      { handle: 'filesystem' },
      { src: '/(.*)', dest: '/index' },
    ],
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'config.json'),
    JSON.stringify(config, null, 2),
  );

  console.log('\n✔ Build Output API v3 generated at .vercel/output');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
