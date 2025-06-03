/* eslint-env jest */

const dialog = {
  showMessageBox: jest.fn(
    () => Promise.resolve(),
  ),
  showOpenDialog: jest.fn(
    () => Promise.resolve(),
  ),
};

const remote = {
  dialog: {
    showSaveDialog: jest.fn(() => Promise.resolve({
      canceled: false,
      filePath: 'filename.canvas',
    })),
    showOpenDialog: jest.fn(() => Promise.resolve({
      canceled: false,
      filePaths: ['/dev/null/fake/explore/path'],
    })),
  },
  app: {
    getVersion: jest.fn(() => '0.0.0'),
    getPath: jest.fn(() => '/dev/null/get/electron/path'),
  },
  getCurrentWindow: jest.fn(),
};

const ipcRenderer = {
  send: jest.fn(() => {}),
  on: jest.fn(() => {}),
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
