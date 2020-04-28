/* eslint-env jest */

const callCallbackWith = (...resultArgs) =>
  (...args) => {
    const cb = args.pop();
    cb(...resultArgs);
  };

const dialog = {
  showMessageBox: jest.fn(),
  showOpenDialog: jest.fn(),
};

const remote = {
  dialog: {
    showSaveDialog: jest.fn(callCallbackWith('filename.canvas')),
    showOpenDialog: jest.fn(callCallbackWith(['/dev/null/fake/explore/path'])),
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
