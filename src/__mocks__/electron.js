import { vi } from 'vitest';

const dialog = {
  showMessageBox: vi.fn(
    () => Promise.resolve(),
  ),
  showOpenDialog: vi.fn(
    () => Promise.resolve(),
  ),
};

const remote = {
  dialog: {
    showSaveDialog: vi.fn(() => Promise.resolve({
      canceled: false,
      filePath: 'filename.canvas',
    })),
    showOpenDialog: vi.fn(() => Promise.resolve({
      canceled: false,
      filePaths: ['/dev/null/fake/explore/path'],
    })),
  },
  app: {
    getVersion: vi.fn(() => '0.0.0'),
    getPath: vi.fn(() => '/dev/null/get/electron/path'),
  },
  getCurrentWindow: vi.fn(),
};

const ipcRenderer = {
  send: vi.fn(() => {}),
  on: vi.fn(() => {}),
};

module.exports = {
  dialog,
  remote,
  ipcRenderer,
};

export default {
  dialog,
  remote,
  ipcRenderer,
};
