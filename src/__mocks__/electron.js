/* eslint-env jest */

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

export {
  remote,
};

export default {
  remote,
};
