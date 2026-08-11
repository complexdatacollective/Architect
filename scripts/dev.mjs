#!/usr/bin/env node
// Architect's dev server.
//
// Architect's preview window renders the Interviewer app from the
// `@codaco/interviewer-classic` workspace package. In development it loads the
// Interviewer's Vite dev server (http://localhost:3000) so edits to the
// interview UI live-reload inside the preview. NC_PREVIEW_HOST tells the
// Interviewer process to stay headless (no window of its own): Architect owns
// the visible window and hosts the preview IPC, so we only need the
// Interviewer's renderer dev server.
//
// We spawn the Interviewer's dev server in the background — detached, so it
// leads its own process group and its whole process tree (electron-vite, vite,
// electron) can be torn down as a unit — and run Architect's own
// `electron-vite dev` in the foreground.
import { spawn, spawnSync } from 'node:child_process';

const isWindows = process.platform === 'win32';
const env = { ...process.env, NC_PREVIEW_HOST: 'true' };

const interviewer = spawn(
  'pnpm',
  ['--filter', '@codaco/interviewer-classic', 'dev'],
  { stdio: 'inherit', env, shell: isWindows, detached: !isWindows },
);

let interviewerStopped = false;
function stopInterviewer() {
  if (interviewerStopped || !interviewer.pid) return;
  interviewerStopped = true;
  try {
    if (isWindows) {
      spawnSync('taskkill', ['/pid', String(interviewer.pid), '/t', '/f']);
    } else {
      // Negative pid targets the whole process group `detached` created,
      // reaching everything electron-vite/vite/electron spawned underneath.
      process.kill(-interviewer.pid, 'SIGTERM');
    }
  } catch {
    // Already exited.
  }
}

interviewer.on('error', (error) => {
  console.error(
    `[architect-classic dev] failed to launch the Interviewer dev server: ${error.message}`,
  );
});

const architect = spawn('electron-vite', ['dev'], {
  stdio: 'inherit',
  env,
  shell: isWindows,
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopInterviewer();
    architect.kill(signal);
  });
}

architect.on('error', (error) => {
  console.error(
    `[architect-classic dev] failed to launch electron-vite: ${error.message}`,
  );
  stopInterviewer();
  process.exit(1);
});

architect.on('exit', (code, signal) => {
  stopInterviewer();
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
