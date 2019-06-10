/* eslint-env jest */

const dialog = {
  showMessageBox: jest.fn(),
  showOpenDialog: jest.fn(),
};

const remote = {
  dialog: {
    showSaveDialog: jest.fn((options, cb) => cb('filename.canvas')),
    showOpenDialog: jest.fn((options, cb) => cb(['/dev/null/fake/explore/path'])),
  },
  app: {
    getVersion: jest.fn(() => '0.0.0'),
    getPath: jest.fn(() => '/dev/null/get/electron/path'),
  },
};

const ipcRenderer = {
  send: jest.fn(() => {}),
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
