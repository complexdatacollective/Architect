#!/usr/bin/env node
// Architect's dev server.
//
// Architect's preview window renders the Interviewer app from the
// `network-canvas-interviewer` workspace package. In development it loads the
// Interviewer's Vite dev server (http://localhost:3000) so edits to the
// interview UI live-reload inside the preview.
//
// `--watch-deps` builds Architect's dependency closure once and then runs each
// dependency's `dev` watcher in the background — including the Interviewer's,
// which serves that dev server. NC_PREVIEW_HOST tells the Interviewer process to
// stay headless (no window of its own): Architect owns the visible window and
// hosts the preview IPC, so we only need the Interviewer's renderer dev server.
//
// This wrapper exists to set NC_PREVIEW_HOST cross-platform (no `cross-env`
// dependency) before delegating to the shared with-turbo helper.
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const withTurbo = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../scripts/with-turbo.mjs',
);

const child = spawn(
  process.execPath,
  [withTurbo, '--watch-deps', 'electron-vite', 'dev'],
  { stdio: 'inherit', env: { ...process.env, NC_PREVIEW_HOST: 'true' } },
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
